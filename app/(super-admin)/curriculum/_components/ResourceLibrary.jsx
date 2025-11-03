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
  BarChart3
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
    switch (type) {
      case 'pdf':
        return <div className="text-red-600 font-bold text-xs">PDF</div>;
      case 'video':
        return <div className="text-blue-600 font-bold text-xs">MP4</div>;
      case 'image':
        return <div className="text-green-600 font-bold text-xs">IMG</div>;
      case 'presentation':
        return <div className="text-orange-600 font-bold text-xs">PPT</div>;
      default:
        return <div className="text-gray-600 font-bold text-xs">FILE</div>;
    }
  };

  const handleUpload = () => {
    if (uploadData.name.trim()) {
      const newResource = {
        id: Date.now(),
        name: uploadData.name,
        type: uploadData.type,
        size: '0 MB', // Would be calculated in real implementation
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
      
      // Reset form
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Teaching Resources</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage and organize teaching materials for this level
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setUploadType('file');
              setShowUploadModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <Upload className="h-4 w-4" />
            Upload New Resource
          </button>
          <button
            onClick={() => {
              setUploadType('url');
              setShowUploadModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Link className="h-4 w-4" />
            Upload from URL
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <File className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Resources</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{displayResources.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Download className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Downloads</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {displayResources.reduce((sum, r) => sum + (r.downloads || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Total Views</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {displayResources.reduce((sum, r) => sum + (r.views || 0), 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Last Updated</span>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {displayResources.length > 0 ? displayResources[0].uploadDate : 'N/A'}
          </p>
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-3">
        {filteredResources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Upload your first teaching resource to get started'
              }
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              Add Resource
            </button>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <div key={resource.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                {getFileIcon(resource.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{resource.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span>{resource.size}</span>
                  {resource.uploadDate && <span>Uploaded {resource.uploadDate}</span>}
                  {resource.downloads && <span>{resource.downloads} downloads</span>}
                  {resource.views && <span>{resource.views} views</span>}
                </div>
                {resource.description && (
                  <p className="text-sm text-gray-500 mt-1 truncate">{resource.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleView(resource)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                  title="View resource"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {}}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                  title="Download resource"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                  title="Delete resource"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {uploadType === 'file' ? 'Upload New Resource' : 'Add Resource from URL'}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-gray-500 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource Name
                </label>
                <input
                  type="text"
                  value={uploadData.name}
                  onChange={(e) => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter resource name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {uploadType === 'url' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resource URL
                  </label>
                  <input
                    type="url"
                    value={uploadData.url}
                    onChange={(e) => setUploadData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com/resource"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource Type
                </label>
                <select
                  value={uploadData.type}
                  onChange={(e) => setUploadData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                  <option value="presentation">Presentation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the resource"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                />
              </div>

              {uploadType === 'file' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, PPT, MP4, JPG, PNG up to 50MB
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpload}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {uploadType === 'file' ? 'Upload Resource' : 'Add Resource'}
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
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