'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ProgramGrid from './_components/ProgramGrid';

export default function ProgramsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleViewLevels = (program) => {
    console.log('View levels for:', program.name);
    // TODO: Implement view levels functionality
  };

  const handleEdit = (program) => {
    console.log('Edit program:', program.name);
    // TODO: Implement edit program functionality
  };

  const handleDelete = (program) => {
    console.log('Delete program:', program.name);
    // TODO: Implement delete program functionality
  };

  const handleCreateProgram = () => {
    setShowCreateForm(true);
    console.log('Create new program');
    // TODO: Implement create program functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Program Management</h1>
              <p className="mt-2 text-gray-600">
                Manage and organize educational programs across all schools
              </p>
            </div>
            
            <button
              onClick={handleCreateProgram}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Create Program
            </button>
          </div>
        </div>

        {/* Program Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ProgramGrid
            onViewLevels={handleViewLevels}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
