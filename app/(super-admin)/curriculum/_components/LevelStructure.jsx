import React, { useState } from 'react';
import { Plus, Clock, Users, Target } from 'lucide-react';
import { curriculumData } from '@/lib/mockData';

export default function LevelStructure({ selectedProgram, selectedLevel, onProgramChange, onLevelChange, onAddLevel }) {
  const [expandedPrograms, setExpandedPrograms] = useState(['abacus']);

  const programData = curriculumData[selectedProgram] || curriculumData.abacus;

  const toggleProgram = (programKey) => {
    setExpandedPrograms(prev => 
      prev.includes(programKey) 
        ? prev.filter(p => p !== programKey)
        : [...prev, programKey]
    );
  };

  const formatLastSaved = (timeString) => {
    return `Last saved: ${timeString}`;
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Level Structure</h2>
        <div className="text-sm text-gray-600">
          {formatLastSaved(programData.lastSaved)}
        </div>
      </div>

      {/* Program Selection */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-2">
          <button
            onClick={() => toggleProgram('abacus')}
            className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
              selectedProgram === 'abacus' 
                ? 'bg-blue-50 border border-blue-200' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{programData.name}</h3>
                <div className="text-sm text-gray-600 mt-1">
                  ({programData.schools} schools, {programData.students} students)
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Levels List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-2">
            {programData.levels.map((level) => (
              <button
                key={level.id}
                onClick={() => onLevelChange(level.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                  selectedLevel === level.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        Level {level.id}:
                      </span>
                      <span className="text-sm text-gray-700 truncate">
                        {level.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{level.students}</span>
                      </div>
                      {level.milestones > 0 && (
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>{level.milestones} milestones</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-2 text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      {level.students}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Level Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onAddLevel}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          Add New Level
        </button>
      </div>
    </div>
  );
}