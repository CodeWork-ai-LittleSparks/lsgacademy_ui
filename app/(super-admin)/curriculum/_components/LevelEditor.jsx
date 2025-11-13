import React, { useState } from 'react';
import { 
  Edit2, 
  Trash2, 
  Copy, 
  Plus, 
  Upload, 
  Link, 
  Download, 
  Eye, 
  BarChart3,
  Clock,
  Users,
  Target,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Save,
  X,
  Sparkles
} from 'lucide-react';
import { curriculumData } from '@/lib/mockData';
import MilestoneCard from './MilestoneCard';

export default function LevelEditor({ selectedProgram, selectedLevel, onEdit, onDelete, onDuplicate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [newObjective, setNewObjective] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    name: '',
    description: '',
    evaluation: ''
  });

  const programData = curriculumData[selectedProgram] || curriculumData.abacus;
  const levelData = programData.levels.find(level => level.id === selectedLevel) || programData.levels[0];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye, color: 'purple' },
    { id: 'objectives', label: 'Learning Objectives', icon: Target, color: 'blue' },
    { id: 'instructions', label: 'Teaching Instructions', icon: Edit2, color: 'green' },
    { id: 'materials', label: 'Required Materials', icon: Plus, color: 'orange' },
    { id: 'milestones', label: 'Milestones', icon: CheckCircle, color: 'pink' },
    { id: 'resources', label: 'Teaching Resources', icon: Upload, color: 'cyan' },
    { id: 'statistics', label: 'Level Statistics', icon: BarChart3, color: 'indigo' }
  ];

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      // Add objective logic here
      setNewObjective('');
    }
  };

  const handleAddMaterial = () => {
    if (newMaterial.trim()) {
      // Add material logic here
      setNewMaterial('');
    }
  };

  const handleAddMilestone = () => {
    if (newMilestone.name.trim()) {
      // Add milestone logic here
      setNewMilestone({ name: '', description: '', evaluation: '' });
      setShowAddMilestone(false);
    }
  };

  const handleMilestoneEdit = (milestoneId, data) => {
    // Edit milestone logic here
    console.log('Edit milestone:', milestoneId, data);
  };

  const handleMilestoneDelete = (milestoneId) => {
    // Delete milestone logic here
    console.log('Delete milestone:', milestoneId);
  };

  const handleMilestoneToggle = (milestoneId) => {
    // Toggle milestone completion logic here
    console.log('Toggle milestone:', milestoneId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Level Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6 sm:p-8 border-2 border-purple-200 shadow-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl opacity-30" />
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 border-2 border-purple-200 rounded-full mb-3">
                      <Sparkles className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                      <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Current Level</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 uppercase tracking-tight mb-3">
                      LEVEL {levelData.id}: {levelData.name}
                    </h1>
                    <p className="text-base text-gray-700 leading-relaxed font-medium">{levelData.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onEdit(levelData.id)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      <Edit2 className="h-4 w-4" strokeWidth={2.5} />
                      <span className="hidden sm:inline">Edit Level</span>
                    </button>
                    <button
                      onClick={() => onDelete(levelData.id)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                    <button
                      onClick={() => onDuplicate(levelData.id)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      <Copy className="h-4 w-4" strokeWidth={2.5} />
                      <span className="hidden sm:inline">Duplicate</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Level Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <span className="text-lg font-bold text-blue-600">{levelData.id}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Level</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{levelData.name}</h3>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border-2 border-green-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Clock className="h-5 w-5 text-green-600" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Duration</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    {levelData.duration} {levelData.durationUnit}
                  </h3>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border-2 border-purple-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-5 w-5 text-purple-600" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Age Range</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">
                    {levelData.ageRange?.min}-{levelData.ageRange?.max} years
                  </h3>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border-2 border-orange-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Target className="h-5 w-5 text-orange-600" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Milestones</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{levelData.milestones?.length || 0}</h3>
                </div>
              </div>
            </div>
          </div>
        );

      case 'objectives':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-sm">
                  <Target className="w-6 h-6 text-blue-600" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Learning Objectives</h2>
              </div>
            </div>
            
            <div className="space-y-3">
              {levelData.learningObjectives?.map((objective, index) => (
                <div key={objective.id} className="group flex items-start gap-3 p-4 sm:p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm group-hover:scale-110 transition-transform duration-200">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium leading-relaxed">{objective.text}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all duration-200">
                      <Edit2 className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200">
                      <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Add new learning objective..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-medium transition-all duration-200 hover:border-blue-300"
              />
              <button
                onClick={handleAddObjective}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add Objective
              </button>
            </div>
          </div>
        );

      case 'instructions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-sm">
                  <FileText className="w-6 h-6 text-green-600" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Teaching Instructions</h2>
              </div>
            </div>
            
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-5 sm:p-6 shadow-md">
              <textarea
                value={levelData.teachingInstructions || ''}
                onChange={() => {}}
                className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white font-medium transition-all duration-200 hover:border-green-300 resize-none"
                placeholder="Enter detailed teaching instructions for this level..."
              />
              <div className="flex justify-end mt-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <Save className="h-4 w-4" strokeWidth={2.5} />
                  Save Instructions
                </button>
              </div>
            </div>
          </div>
        );

      case 'materials':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl shadow-sm">
                  <Plus className="w-6 h-6 text-orange-600" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Required Materials</h2>
              </div>
            </div>
            
            <div className="space-y-3">
              {levelData.requiredMaterials?.map((material, index) => (
                <div key={index} className="group flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full shadow-sm group-hover:scale-125 transition-transform duration-200"></div>
                  <span className="flex-1 text-gray-900 font-medium">{material}</span>
                  <button className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                    <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="Add new material..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 font-medium transition-all duration-200 hover:border-orange-300"
              />
              <button
                onClick={handleAddMaterial}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add Material
              </button>
            </div>
          </div>
        );

      case 'milestones':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl shadow-sm">
                  <CheckCircle className="w-6 h-6 text-pink-600" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Milestones</h2>
              </div>
            </div>
            
            <div className="space-y-4">
              {levelData.milestones?.map((milestone) => (
                <MilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  onEdit={handleMilestoneEdit}
                  onDelete={handleMilestoneDelete}
                  onToggleComplete={handleMilestoneToggle}
                />
              ))}
            </div>

            {showAddMilestone ? (
              <div className="rounded-2xl border-2 border-gray-200 bg-white p-5 sm:p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Add New Milestone</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newMilestone.name}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Milestone name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 font-medium transition-all duration-200 hover:border-pink-300"
                  />
                  <textarea
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Milestone description"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 font-medium transition-all duration-200 hover:border-pink-300 resize-none"
                    rows="3"
                  />
                  <textarea
                    value={newMilestone.evaluation}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, evaluation: e.target.value }))}
                    placeholder="Evaluation method"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 font-medium transition-all duration-200 hover:border-pink-300 resize-none"
                    rows="3"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddMilestone}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.5} />
                      Add Milestone
                    </button>
                    <button
                      onClick={() => setShowAddMilestone(false)}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all duration-200"
                    >
                      <X className="h-4 w-4" strokeWidth={2.5} />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddMilestone(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add New Milestone
              </button>
            )}
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl shadow-sm">
                  <Upload className="w-6 h-6 text-cyan-600" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Teaching Resources</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <Upload className="h-4 w-4" strokeWidth={2.5} />
                  <span className="hidden sm:inline">Upload</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <Link className="h-4 w-4" strokeWidth={2.5} />
                  <span className="hidden sm:inline">Add URL</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {levelData.resources?.map((resource) => (
                <div key={resource.id} className="group flex items-center gap-4 p-4 sm:p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200 shadow-sm hover:shadow-md">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                    {resource.type === 'pdf' ? (
                      <div className="text-red-600 font-bold text-xs">PDF</div>
                    ) : (
                      <div className="text-blue-600 font-bold text-xs">MP4</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{resource.name}</h4>
                    <p className="text-sm text-gray-600 font-medium">
                      {resource.size} • {resource.uploadDate && `Uploaded ${resource.uploadDate}`}
                      {resource.downloads && ` • ${resource.downloads} downloads`}
                      {resource.views && ` • ${resource.views} views`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-all duration-200">
                      <Download className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200">
                      <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'statistics':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-sm">
                <BarChart3 className="w-6 h-6 text-indigo-600" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Level Statistics</h2>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-5 w-5 text-blue-600" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Students</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{levelData.statistics?.studentsAtLevel}</h3>
                  <p className="text-sm text-gray-600 font-medium mt-1">At This Level</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border-2 border-green-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Clock className="h-5 w-5 text-green-600" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Avg Time</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{levelData.statistics?.averageTime}</h3>
                  <p className="text-sm text-gray-600 font-medium mt-1">Completion Time</p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-2xl border-2 border-purple-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-5 w-5 text-purple-600" strokeWidth={2.5} />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Success Rate</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{levelData.statistics?.successRate}%</h3>
                  <p className="text-sm text-gray-600 font-medium mt-1">Pass Rate</p>
                </div>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-5 sm:p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full shadow-sm"></div>
                    <span className="font-bold text-gray-900">Excellent</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-lg">
                      {levelData.statistics?.performance?.excellent?.count} ({levelData.statistics?.performance?.excellent?.percentage}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full shadow-sm"></div>
                    <span className="font-bold text-gray-900">Average</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-lg">
                      {levelData.statistics?.performance?.average?.count} ({levelData.statistics?.performance?.average?.percentage}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-sm"></div>
                    <span className="font-bold text-gray-900">In Process</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-lg">
                      {levelData.statistics?.performance?.inProcess?.count} ({levelData.statistics?.performance?.inProcess?.percentage}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <BarChart3 className="h-4 w-4" strokeWidth={2.5} />
                  View Detailed Analytics →
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="bg-white border-b-2 border-gray-200 px-4 sm:px-6 py-4 shadow-sm">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-md scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2.5} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
