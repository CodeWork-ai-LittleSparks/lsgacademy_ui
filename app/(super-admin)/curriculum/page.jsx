'use client';

import React, { useState } from 'react';
import { Save, Clock } from 'lucide-react';
import LevelStructure from './_components/LevelStructure';
import LevelEditor from './_components/LevelEditor';
import { curriculumData } from '@/lib/mockData';

export default function CurriculumPage() {
  const [selectedProgram, setSelectedProgram] = useState('abacus');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [lastSaved, setLastSaved] = useState('2 minutes ago');

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
  };

  const handleProgramSelect = (programId) => {
    setSelectedProgram(programId);
    setSelectedLevel(0); // Reset to first level when changing programs
  };

  const handleEditLevel = (levelId) => {
    console.log('Edit level:', levelId);
    // Edit level logic here
  };

  const handleDeleteLevel = (levelId) => {
    console.log('Delete level:', levelId);
    // Delete level logic here
  };

  const handleDuplicateLevel = (levelId) => {
    console.log('Duplicate level:', levelId);
    // Duplicate level logic here
  };

  const handleAddLevel = () => {
    console.log('Add new level');
    // Add new level logic here
  };

  const handleSave = () => {
    setLastSaved('Just now');
    // Save logic here
    setTimeout(() => {
      setLastSaved('1 minute ago');
    }, 60000);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Curriculum Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage program levels, learning objectives, and teaching resources
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Last saved: {lastSaved}</span>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Level Structure */}
        <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
          <LevelStructure
            selectedProgram={selectedProgram}
            selectedLevel={selectedLevel}
            onLevelChange={handleLevelSelect}
            onProgramChange={handleProgramSelect}
            onAddLevel={handleAddLevel}
            lastSaved={lastSaved}
          />
        </div>

        {/* Right Content - Level Editor */}
        <LevelEditor
          selectedProgram={selectedProgram}
          selectedLevel={selectedLevel}
          onEdit={handleEditLevel}
          onDelete={handleDeleteLevel}
          onDuplicate={handleDuplicateLevel}
        />
      </div>
    </div>
  );
}
