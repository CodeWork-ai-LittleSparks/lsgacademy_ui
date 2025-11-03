import React from 'react';
import { Eye, Edit, Trash2, Users, School, BookOpen, Clock, Target } from 'lucide-react';

export default function ProgramCard({ program, onViewLevels, onEdit, onDelete }) {
  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-800'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-600',
        badge: 'bg-green-100 text-green-800'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-800'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-600',
        badge: 'bg-orange-100 text-orange-800'
      },
      pink: {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        text: 'text-pink-600',
        badge: 'bg-pink-100 text-pink-800'
      },
      indigo: {
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
        text: 'text-indigo-600',
        badge: 'bg-indigo-100 text-indigo-800'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses(program.color);

  const getStatusBadge = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'
      : 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium';
  };

  return (
    <div className={`bg-white rounded-xl border-2 ${colors.border} shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group`}>
      {/* Header with Image */}
      <div className={`${colors.bg} p-6 relative`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center border-2 ${colors.border}`}>
            {/* Placeholder for program image */}
            <BookOpen className={`h-8 w-8 ${colors.text}`} />
          </div>
          <span className={getStatusBadge(program.status)}>
            {program.status}
          </span>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{program.name}</h3>
          <p className={`text-sm font-medium ${colors.text}`}>{program.category}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>

        {/* Program Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Levels</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {program.levels} Levels ({program.levelRange})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Schools</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{program.schools} schools</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Students</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{program.students} students</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Duration</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{program.duration}</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features</h4>
          <div className="flex flex-wrap gap-2">
            {program.features.slice(0, 3).map((feature, index) => (
              <span 
                key={index}
                className={`px-2 py-1 ${colors.badge} text-xs rounded-md`}
              >
                {feature}
              </span>
            ))}
            {program.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{program.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Age Group */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Age Group</span>
            <span className="text-sm font-medium text-gray-900">{program.ageGroup}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewLevels && onViewLevels(program)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 ${colors.text} bg-white border-2 ${colors.border} rounded-lg hover:${colors.bg} transition-colors duration-200 text-sm font-medium`}
          >
            <Eye className="h-4 w-4" />
            View Levels
          </button>
          
          <button
            onClick={() => onEdit && onEdit(program)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            title="Edit Program"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDelete && onDelete(program)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Delete Program"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}