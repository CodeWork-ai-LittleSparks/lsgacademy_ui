'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';
import { schoolService } from '@/lib/api/services/schoolService';
import SchoolList from './_components/SchoolList';
import SchoolForm from './_components/SchoolForm';
import SchoolDetails from './_components/SchoolDetails';

export default function SchoolsPage() {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [editingSchool, setEditingSchool] = useState(null);
  const { isSuperAdmin } = useAuth();

  const handleAddSchool = () => {
    setEditingSchool(null);
    setShowForm(true);
  };

  const handleEditSchool = (school) => {
    setEditingSchool(school);
    setShowForm(true);
  };

  const handleViewSchool = (school) => {
    setSelectedSchool(school);
    setShowDetails(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSchool(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedSchool(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      let result;
      
      if (editingSchool) {
        // Update existing school
        result = await schoolService.updateSchool(editingSchool.id, formData);
      } else {
        // Create new school
        result = await schoolService.createSchool(formData);
      }
      
      if (result.success) {
        console.log('School saved successfully:', result.data);
        // You can add a toast notification here
        handleCloseForm();
        // Optionally refresh the school list here
      } else {
        console.error('Failed to save school:', result.error);
        // You can add error handling/notification here
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Management</h1>
          <p className="text-gray-600 mt-1">Manage schools, view details, and track performance</p>
        </div>
        {isSuperAdmin?.() && (
          <button
            onClick={handleAddSchool}
            className="flex items-center gap-2 px-4 py-2 bg-[#6F00FF] text-white rounded-lg hover:bg-[#5a00d1] transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Add School
          </button>
        )}
      </div>

      {/* School List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <SchoolList
          onEditSchool={handleEditSchool}
          onViewSchool={handleViewSchool}
        />
      </div>

      {/* School Form Modal */}
      <SchoolForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        school={editingSchool}
      />

      {/* School Details Modal */}
      <SchoolDetails
        isOpen={showDetails}
        onClose={handleCloseDetails}
        school={selectedSchool}
      />
    </div>
  );
}
