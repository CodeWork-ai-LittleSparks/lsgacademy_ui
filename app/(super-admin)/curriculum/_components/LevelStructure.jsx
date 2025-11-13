import React, { useState } from 'react';
import { Plus, Clock, Users, Target, ChevronRight, Sparkles, BookOpen, TrendingUp } from 'lucide-react';
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
    <div className="w-80 bg-gradient-to-br from-white to-gray-50 border-r-2 border-gray-200 h-full flex flex-col shadow-xl">
      {/* Header */}
      <div className="relative overflow-hidden p-6 border-b-2 border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl opacity-30" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
              <BookOpen className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Level Structure</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <Clock className="w-3.5 h-3.5 text-purple-600" strokeWidth={2.5} />
            <span>{formatLastSaved(programData.lastSaved)}</span>
          </div>
        </div>
      </div>

      {/* Program Selection */}
      <div className="p-4 border-b-2 border-gray-200">
        <div className="space-y-2">
          <button
            onClick={() => toggleProgram('abacus')}
            className={`group w-full text-left p-4 rounded-xl transition-all duration-200 ${
              selectedProgram === 'abacus' 
                ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 shadow-md' 
                : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${
                    selectedProgram === 'abacus' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <BookOpen className={`w-4 h-4 ${
                      selectedProgram === 'abacus' ? 'text-blue-600' : 'text-gray-600'
                    }`} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-gray-900">{programData.name}</h3>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">
                    <Users className="w-3 h-3" strokeWidth={2.5} />
                    <span>{programData.schools} schools</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">
                    <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
                    <span>{programData.students} students</span>
                  </div>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${
                selectedProgram === 'abacus' ? 'text-blue-600 rotate-90' : 'text-gray-400'
              }`} strokeWidth={2.5} />
            </div>
          </button>
        </div>
      </div>

      {/* Levels List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Curriculum Levels</span>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-100 rounded-lg">
              <Sparkles className="w-3 h-3 text-purple-600" strokeWidth={2.5} />
              <span className="text-xs font-bold text-purple-700">{programData.levels.length}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {programData.levels.map((level, index) => (
              <button
                key={level.id}
                onClick={() => onLevelChange(level.id)}
                className={`group relative w-full text-left p-4 rounded-xl transition-all duration-200 overflow-hidden ${
                  selectedLevel === level.id
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 shadow-md scale-105'
                    : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-200 hover:scale-102 shadow-sm'
                }`}
              >
                {/* Decorative Gradient */}
                {selectedLevel === level.id && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
                )}
                
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Level Number Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm shadow-sm ${
                        selectedLevel === level.id 
                          ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white' 
                          : index === 0
                          ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {level.id}
                      </div>
                      <span className={`text-sm font-bold truncate ${
                        selectedLevel === level.id ? 'text-purple-700' : 'text-gray-900'
                      }`}>
                        {level.name}
                      </span>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg font-semibold ${
                        selectedLevel === level.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Users className="w-3 h-3" strokeWidth={2.5} />
                        <span>{level.students}</span>
                      </div>
                      {level.milestones > 0 && (
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg font-semibold ${
                          selectedLevel === level.id 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Target className="w-3 h-3" strokeWidth={2.5} />
                          <span>{level.milestones}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Student Count Badge */}
                  <div className={`flex flex-col items-center justify-center ml-2 px-3 py-2 rounded-xl ${
                    selectedLevel === level.id 
                      ? 'bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-300' 
                      : 'bg-gray-100 border-2 border-gray-200'
                  }`}>
                    <div className={`text-lg font-bold ${
                      selectedLevel === level.id ? 'text-purple-700' : 'text-gray-900'
                    }`}>
                      {level.students}
                    </div>
                    <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
                      Students
                    </div>
                  </div>
                </div>

                {/* Arrow Indicator for Selected */}
                {selectedLevel === level.id && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <ChevronRight className="w-5 h-5 text-purple-600 animate-pulse" strokeWidth={2.5} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add New Level Button */}
      <div className="p-4 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <button
          onClick={onAddLevel}
          className="group w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
            <Plus className="h-4 w-4" strokeWidth={2.5} />
          </div>
          Add New Level
        </button>
      </div>
    </div>
  );
}
