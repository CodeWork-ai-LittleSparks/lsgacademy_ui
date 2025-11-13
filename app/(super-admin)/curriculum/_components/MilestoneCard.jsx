import React, { useState } from 'react';
import { Edit2, Trash2, Check, X, ChevronDown, ChevronRight, Target, Award, CheckCircle2 } from 'lucide-react';

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
    <div className={`group relative overflow-hidden rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl ${
      milestone.completed 
        ? 'border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50' 
        : 'border-2 border-gray-200 bg-white hover:border-purple-300'
    }`}>
      {/* Top Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 transition-opacity duration-300 ${
        milestone.completed
          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
          : 'bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100'
      }`} />

      {/* Decorative Background */}
      {milestone.completed && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-3xl opacity-20" />
      )}

      {/* Header */}
      <div className="relative z-10 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {/* Completion Checkbox */}
          <button
            onClick={() => onToggleComplete(milestone.id)}
            className={`flex-shrink-0 mt-1 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-200 shadow-sm ${
              milestone.completed
                ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-500 text-white scale-110'
                : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
            }`}
          >
            {milestone.completed && <Check className="h-4 w-4" strokeWidth={3} />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 font-medium transition-all duration-200 hover:border-purple-300"
                  placeholder="Milestone name"
                />
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 font-medium transition-all duration-200 hover:border-purple-300 resize-none"
                  rows="2"
                  placeholder="Milestone description"
                />
              </div>
            ) : (
              <div>
                {/* Milestone Badge & Number */}
                <div className="flex items-center gap-2 mb-2">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs uppercase tracking-wide ${
                    milestone.completed 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {milestone.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                    ) : (
                      <Target className="w-3.5 h-3.5" strokeWidth={2.5} />
                    )}
                    <span>Milestone {milestone.id}</span>
                  </div>
                  {milestone.completed && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg">
                      <Award className="w-3.5 h-3.5 text-amber-600" strokeWidth={2.5} />
                      <span className="text-xs font-bold text-amber-700">Completed</span>
                    </div>
                  )}
                </div>

                {/* Name */}
                <h4 className={`text-base font-bold leading-tight mb-2 ${
                  milestone.completed ? 'text-green-800' : 'text-gray-900'
                }`}>
                  {milestone.name}
                </h4>

                {/* Description */}
                <p className={`text-sm leading-relaxed font-medium ${
                  milestone.completed ? 'text-green-700' : 'text-gray-600'
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
              className={`flex-shrink-0 p-2 rounded-xl transition-all duration-200 ${
                milestone.completed 
                  ? 'hover:bg-green-100 text-green-600' 
                  : 'hover:bg-purple-100 text-purple-600'
              }`}
            >
              {isExpanded ? (
                <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
              ) : (
                <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
              )}
            </button>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-all duration-200 hover:scale-110"
                  title="Save"
                >
                  <Check className="h-5 w-5" strokeWidth={2.5} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110"
                  title="Cancel"
                >
                  <X className="h-5 w-5" strokeWidth={2.5} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-110"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => onDelete(milestone.id)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && !isEditing && milestone.evaluation && (
        <div className={`border-t-2 transition-all duration-300 ${
          milestone.completed ? 'border-green-200 bg-green-50/50' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-1.5 rounded-lg ${
                milestone.completed ? 'bg-green-100' : 'bg-purple-100'
              }`}>
                <Target className={`w-4 h-4 ${
                  milestone.completed ? 'text-green-600' : 'text-purple-600'
                }`} strokeWidth={2.5} />
              </div>
              <h5 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Evaluation Method
              </h5>
            </div>
            <p className={`text-sm leading-relaxed font-medium pl-9 ${
              milestone.completed ? 'text-green-700' : 'text-gray-600'
            }`}>
              {milestone.evaluation}
            </p>
          </div>
        </div>
      )}

      {/* Editing Evaluation */}
      {isEditing && (
        <div className="border-t-2 border-gray-200 bg-gray-50">
          <div className="p-4 sm:p-5">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
              <Target className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
              Evaluation Method
            </label>
            <textarea
              value={editData.evaluation}
              onChange={(e) => setEditData(prev => ({ ...prev, evaluation: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 font-medium transition-all duration-200 hover:border-purple-300 resize-none"
              rows="3"
              placeholder="How will this milestone be evaluated?"
            />
          </div>
        </div>
      )}
    </div>
  );
}
