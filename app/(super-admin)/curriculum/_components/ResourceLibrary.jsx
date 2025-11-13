import React, { useState } from 'react';
import { 
  Upload, 
  Link, 
  Download, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  FileText,
  Video,
  Image,
  File,
  Plus,
  X,
  Calendar,
  BarChart3,
  Sparkles,
  FolderOpen
} from 'lucide-react';

export default function ResourceLibrary({ levelId, resources = [], onUpload, onDelete, onView }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'url'
  const [uploadData, setUploadData] = useState({
    name: '',
    url: '',
    type: 'pdf',
    description: ''
  });

  // Sample resources data if none provided
  const sampleResources = [
    {
      id: 1,
      name: 'Counting Worksheet.pdf',
      type: 'pdf',
      size: '2.3 MB',
      uploadDate: 'Oct 15, 2025',
      downloads: 45,
      views: null,
      description: 'Basic counting exercises for beginners'
    },
    {
      id: 2,
      name: 'Number Recognition Video.mp4',
      type: 'video',
      size: '15.2 MB',
      uploadDate: 'Oct 12, 2025',
      downloads: null,
      views: 123,
      description: 'Interactive video for number recognition'
    },
    {
      id: 3,
      name: 'Flashcards 1-50.pdf',
      type: 'pdf',
      size: '5.1 MB',
      uploadDate: 'Oct 10, 2025',
      downloads: 67,
      views: null,
      description: 'Number flashcards for practice'
    },
    {
      id: 4,
      name: 'Abacus Introduction.pptx',
      type: 'presentation',
      size: '8.7 MB',
      uploadDate: 'Oct 8, 2025',
      downloads: 23,
      views: null,
      description: 'PowerPoint presentation for abacus basics'
    }
  ];

  const displayResources = resources.length > 0 ? resources : sampleResources;

  const resourceTypes = [
    { value: 'all', label: 'All Types', icon: File },
    { value: 'pdf', label: 'PDF Documents', icon: FileText },
    { value: 'video', label: 'Videos', icon: Video },
    { value: 'image', label: 'Images', icon: Image },
    { value: 'presentation', label: 'Presentations', icon: FileText }
  ];

  const filteredResources = displayResources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getFileIcon = (type) => {
    const icons = {
      pdf: { text: 'PDF', color: 'from-red-500 to-pink-600', bgColor: 'from-red-100 to-pink-100' },
      video: { text: 'MP4', color: 'from-blue-500 to-cyan-600', bgColor: 'from-blue-100 to-cyan-100' },
      image: { text: 'IMG', color: 'from-green-500 to-emerald-600', bgColor: 'from-green-100 to-emerald-100' },
      presentation: { text: 'PPT', color: 'from-orange-500 to-amber-600', bgColor: 'from-orange-100 to-amber-100' },
    };
    const config = icons[type] || { text: 'FILE', color: 'from-gray-500 to-slate-600', bgColor: 'from-gray-100 to-slate-100' };
    
    return (
      <div className={`w-full h-full bg-gradient-to-br ${config.bgColor} rounded-xl flex items-center justify-center`}>
        <span className={`text-xs font-bold bg-gradient-to-br ${config.color} bg-clip-text text-transparent`}>
          {config.text}
        </span>
      </div>
    );
  };

  const handleUpload = () => {
    if (uploadData.name.trim()) {
      const newResource = {
        id: Date.now(),
        name: uploadData.name,
        type: uploadData.type,
        size: '0 MB',
        uploadDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        downloads: 0,
        views: uploadData.type === 'video' ? 0 : null,
        description: uploadData.description,
        url: uploadType === 'url' ? uploadData.url : null
      };
      
      if (onUpload) {
        onUpload(newResource);
      }
      
      setUploadData({ name: '', url: '', type: 'pdf', description: '' });
      setShowUploadModal(false);
    }
  };

  const handleDelete = (resourceId) => {
    if (onDelete) {
      onDelete(resourceId);
    }
  };

  const handleView = (resource) => {
    if (onView) {
      onView(resource);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl shadow-sm">
            <FolderOpen className="w-6 h-6 text-cyan-600" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Teaching Resources</h2>
            <p className="text-sm text-gray-600 font-medium mt-0.5">
              Manage and organize teaching materials for this level
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setUploadType('file');
              setShowUploadModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Upload className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Upload New</span>
          </button>
          <button
            onClick={() => {
              setUploadType('url');
              setShowUploadModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <Link className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Add URL</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-purple-100 rounded-lg">
            <Search className="text-purple-600 h-4 w-4" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resources by name or description..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 font-medium transition-all duration-200 hover:border-purple-300"
          />
        </div>
        <div className="flex items-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl bg-white">
          <Filter className="h-4 w-4 text-gray-600 flex-shrink-0" strokeWidth={2.5} />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border-none outline-none font-semibold text-gray-900 bg-transparent cursor-pointer"
          >
            {resourceTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resource Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-white p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <File className="h-4 w-4 text-blue-600" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{displayResources.length}</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border-2 border-green-200 bg-white p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <Download className="h-4 w-4 text-green-600" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Downloads</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {displayResources.reduce((sum, r) => sum + (r.downloads || 0), 0)}
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border-2 border-purple-200 bg-white p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Eye className="h-4 w-4 text-purple-600" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Views</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {displayResources.reduce((sum, r) => sum + (r.views || 0), 0)}
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border-2 border-orange-200 bg-white p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-orange-100 rounded-lg">
                <Calendar className="h-4 w-4 text-orange-600" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Updated</span>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {displayResources.length > 0 ? displayResources[0].uploadDate : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-3">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border-2 border-gray-200 shadow-md">
            <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-inner w-fit mx-auto mb-4">
              <FolderOpen className="h-12 w-12 text-gray-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto font-medium">
              {searchTerm || selectedType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Upload your first teaching resource to get started'
              }
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add Resource
            </button>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <div key={resource.id} className="group flex items-center gap-4 p-4 sm:p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-14 h-14 flex-shrink-0">
                {getFileIcon(resource.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 truncate mb-1">{resource.name}</h4>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-600">
                  <span className="px-2 py-1 bg-gray-100 rounded-lg">{resource.size}</span>
                  {resource.uploadDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" strokeWidth={2.5} />
                      {resource.uploadDate}
                    </span>
                  )}
                  {resource.downloads !== null && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Download className="w-3 h-3" strokeWidth={2.5} />
                      {resource.downloads}
                    </span>
                  )}
                  {resource.views !== null && (
                    <span className="flex items-center gap-1 text-purple-600">
                      <Eye className="w-3 h-3" strokeWidth={2.5} />
                      {resource.views}
                    </span>
                  )}
                </div>
                {resource.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-1 font-medium">{resource.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleView(resource)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110"
                  title="View resource"
                >
                  <Eye className="h-4 w-4" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => {}}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 hover:scale-110"
                  title="Download resource"
                >
                  <Download className="h-4 w-4" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110"
                  title="Delete resource"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="relative overflow-hidden p-6 border-b-2 border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-30" />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-sm">
                    {uploadType === 'file' ? (
                      <Upload className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                    ) : (
                      <Link className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {uploadType === 'file' ? 'Upload New Resource' : 'Add Resource from URL'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-gray-500 hover:bg-white/80 rounded-xl transition-colors"
                >
                  <X className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Resource Name
                </label>
                <input
                  type="text"
                  value={uploadData.name}
                  onChange={(e) => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter resource name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-medium transition-all duration-200"
                />
              </div>

              {uploadType === 'url' && (
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Resource URL
                  </label>
                  <input
                    type="url"
                    value={uploadData.url}
                    onChange={(e) => setUploadData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com/resource"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-medium transition-all duration-200"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Resource Type
                </label>
                <select
                  value={uploadData.type}
                  onChange={(e) => setUploadData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-semibold text-gray-900 transition-all duration-200"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                  <option value="presentation">Presentation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Description (Optional)
                </label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the resource"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-medium transition-all duration-200 resize-none"
                  rows="3"
                />
              </div>

              {uploadType === 'file' && (
                <div className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-8 text-center transition-colors cursor-pointer">
                  <div className="p-3 bg-blue-100 rounded-xl w-fit mx-auto mb-3">
                    <Upload className="h-8 w-8 text-blue-600" strokeWidth={2} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    PDF, DOC, PPT, MP4, JPG, PNG up to 50MB
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 p-6 border-t-2 border-gray-200 bg-gray-50">
              <button
                onClick={handleUpload}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                {uploadType === 'file' ? 'Upload Resource' : 'Add Resource'}
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
