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
  TrendingUp
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
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'objectives', label: 'Learning Objectives', icon: Target },
    { id: 'instructions', label: 'Teaching Instructions', icon: Edit2 },
    { id: 'materials', label: 'Required Materials', icon: Plus },
    { id: 'milestones', label: 'Milestones', icon: CheckCircle },
    { id: 'resources', label: 'Teaching Resources', icon: Upload },
    { id: 'statistics', label: 'Level Statistics', icon: BarChart3 }
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
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 uppercase">
                    LEVEL {levelData.id}: {levelData.name}
                  </h1>
                  <p className="text-gray-600 mt-2">{levelData.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(levelData.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Level
                  </button>
                  <button
                    onClick={() => onDelete(levelData.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Level
                  </button>
                  <button
                    onClick={() => onDuplicate(levelData.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate Level
                  </button>
                </div>
              </div>
            </div>

            {/* Level Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">{levelData.id}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Level</span>
                </div>
                <h3 className="font-semibold text-gray-900">{levelData.name}</h3>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Duration</span>
                </div>
                <h3 className="font-semibold text-gray-900">
                  {levelData.duration} {levelData.durationUnit}
                </h3>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Age Range</span>
                </div>
                <h3 className="font-semibold text-gray-900">
                  {levelData.ageRange?.min} years to {levelData.ageRange?.max} years
                </h3>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Milestones</span>
                </div>
                <h3 className="font-semibold text-gray-900">{levelData.milestones?.length || 0}</h3>
              </div>
            </div>
          </div>
        );

      case 'objectives':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Learning Objectives</h2>
            </div>
            
            <div className="space-y-3">
              {levelData.learningObjectives?.map((objective, index) => (
                <div key={objective.id} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-900">{objective.text}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-red-500 hover:bg-red-100 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Add new learning objective..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddObjective}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Add Learning Objective
              </button>
            </div>
          </div>
        );

      case 'instructions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Teaching Instructions</h2>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <textarea
                value={levelData.teachingInstructions || ''}
                onChange={() => {}}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter detailed teaching instructions..."
              />
              <div className="flex justify-end mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
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
              <h2 className="text-xl font-semibold text-gray-900">Required Materials</h2>
            </div>
            
            <div className="space-y-3">
              {levelData.requiredMaterials?.map((material, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="flex-1 text-gray-900">{material}</span>
                  <button className="p-1 text-red-500 hover:bg-red-100 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="Add new material..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddMaterial}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Add Material
              </button>
            </div>
          </div>
        );

      case 'milestones':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Milestones (Evaluation Checkpoints)</h2>
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
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-4">Add New Milestone</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newMilestone.name}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Milestone name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <textarea
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Milestone description"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="3"
                  />
                  <textarea
                    value={newMilestone.evaluation}
                    onChange={(e) => setNewMilestone(prev => ({ ...prev, evaluation: e.target.value }))}
                    placeholder="Evaluation method"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="3"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddMilestone}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Add Milestone
                    </button>
                    <button
                      onClick={() => setShowAddMilestone(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddMilestone(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                Add New Milestone
              </button>
            )}
          </div>
        );

      case 'resources':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Teaching Resources</h2>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Upload className="h-4 w-4" />
                  Upload New Resource
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                  <Link className="h-4 w-4" />
                  Upload from URL
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {levelData.resources?.map((resource) => (
                <div key={resource.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {resource.type === 'pdf' ? (
                      <div className="text-red-600 font-bold text-xs">PDF</div>
                    ) : (
                      <div className="text-blue-600 font-bold text-xs">MP4</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{resource.name}</h4>
                    <p className="text-sm text-gray-600">
                      {resource.size} • {resource.uploadDate && `Uploaded ${resource.uploadDate}`}
                      {resource.downloads && ` • ${resource.downloads} downloads`}
                      {resource.views && ` • ${resource.views} views`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-100 rounded">
                      <Trash2 className="h-4 w-4" />
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Level Statistics</h2>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Students at This Level</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{levelData.statistics?.studentsAtLevel}</h3>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Average Time</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{levelData.statistics?.averageTime}</h3>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Success Rate</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{levelData.statistics?.successRate}%</h3>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Excellent</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">
                      {levelData.statistics?.performance?.excellent?.count} ({levelData.statistics?.performance?.excellent?.percentage}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Average</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">
                      {levelData.statistics?.performance?.average?.count} ({levelData.statistics?.performance?.average?.percentage}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">In Process</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">
                      {levelData.statistics?.performance?.inProcess?.count} ({levelData.statistics?.performance?.inProcess?.percentage}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <BarChart3 className="h-4 w-4" />
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
    <div className="flex-1 bg-gray-50 h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}