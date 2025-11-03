import React, { useState } from 'react';
import { Edit2, Trash2, Check, X, ChevronDown, ChevronRight } from 'lucide-react';

export default function MilestoneCard({ milestone, onEdit, onDelete, onToggleComplete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: milestone.name,
    description: milestone.description,
    evaluation: milestone.evaluation
  });

  const handleSave = () => {
    onEdit(milestone.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: milestone.name,
      description: milestone.description,
      evaluation: milestone.evaluation
    });
    setIsEditing(false);
  };

  return (
    <div className={`border rounded-lg transition-all duration-200 ${
      milestone.completed 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200 bg-white'
    }`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Completion Checkbox */}
            <button
              onClick={() => onToggleComplete(milestone.id)}
              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                milestone.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {milestone.completed && <Check className="h-3 w-3" />}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Milestone name"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="2"
                    placeholder="Milestone description"
                  />
                </div>
              ) : (
                <div>
                  <h4 className={`font-medium ${
                    milestone.completed ? 'text-green-800' : 'text-gray-900'
                  }`}>
                    Milestone {milestone.id}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    milestone.completed ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {milestone.name}
                  </p>
                  <p className={`text-sm mt-1 ${
                    milestone.completed ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {milestone.description}
                  </p>
                </div>
              )}
            </div>

            {/* Expand/Collapse Button */}
            {!isEditing && milestone.evaluation && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors duration-200"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(milestone.id)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && !isEditing && milestone.evaluation && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-3">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Evaluation Method:</h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              {milestone.evaluation}
            </p>
          </div>
        </div>
      )}

      {/* Editing Evaluation */}
      {isEditing && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-3">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Evaluation Method:
            </label>
            <textarea
              value={editData.evaluation}
              onChange={(e) => setEditData(prev => ({ ...prev, evaluation: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="How will this milestone be evaluated?"
            />
          </div>
        </div>
      )}
    </div>
  );
}