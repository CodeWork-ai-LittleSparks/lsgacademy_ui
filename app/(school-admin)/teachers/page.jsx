"use client"
import React, { useState } from 'react';
import { Plus, Users, ArrowLeft } from 'lucide-react';
import TeacherList from './_components/TeacherList';
import AddTeacher from './_components/AddTeacher';
import EditTeacher from './_components/EditTeacher';
import TeacherDetails from './_components/TeacherDetails';
import Button from '@/components/ui/Button';

export default function TeachersPage() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit', or 'details'
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);

  const handleAddTeacher = () => {
    setCurrentView('add');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedTeacherId(null);
  };

  const handleViewTeacher = (teacherId) => {
    setSelectedTeacherId(teacherId);
    setCurrentView('details');
  };

  const handleEditTeacher = (teacherId) => {
    console.log('Main page: handleEditTeacher called with teacherId:', teacherId);
    setSelectedTeacherId(teacherId);
    setCurrentView('edit');
  };

  const handleTeacherCreated = (newTeacher) => {
    // Teacher was successfully created, go back to list
    setCurrentView('list');
    // The TeacherList component will automatically refresh when it mounts
  };

  const handleTeacherUpdated = (updatedTeacher) => {
    // Teacher was successfully updated, go back to list
    setCurrentView('list');
    // The TeacherList component will automatically refresh when it mounts
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {currentView === 'list' ? (
          <>
            {/* Single Clean Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
                  
                </div>
                <Button
                  onClick={handleAddTeacher}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Teacher
                </Button>
              </div>
            </div>
            
            {/* Teacher List */}
            <TeacherList onViewTeacher={handleViewTeacher} onEditTeacher={handleEditTeacher} />
          </>
        ) : currentView === 'add' ? (
          <>
            {/* Add Teacher Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center">
                <Button
                  onClick={handleBackToList}
                  className="bg-gray-500 hover:bg-gray-600 text-white mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Teachers
                </Button>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Teacher</h1>
                    <p className="text-gray-600 mt-1">Create a new teacher profile</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Add Teacher Form */}
            <AddTeacher 
              onClose={handleBackToList}
              onSuccess={handleTeacherCreated}
            />
          </>
        ) : currentView === 'edit' ? (
          <>
            {/* Edit Teacher Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center">
                <Button
                  onClick={handleBackToList}
                  className="bg-gray-500 hover:bg-gray-600 text-white mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Teachers
                </Button>
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                    <Users className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Teacher</h1>
                    <p className="text-gray-600 mt-1">Update teacher information</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Edit Teacher Form */}
            {console.log('Main page: Rendering EditTeacher with selectedTeacherId:', selectedTeacherId)}
            <EditTeacher 
              teacherId={selectedTeacherId}
              onClose={handleBackToList}
              onSuccess={handleTeacherUpdated}
            />
          </>
        ) : (
          <>
            {/* Teacher Details Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center">
                <Button
                  onClick={handleBackToList}
                  className="bg-gray-500 hover:bg-gray-600 text-white mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Teachers
                </Button>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Teacher Details</h1>
                    <p className="text-gray-600 mt-1">View detailed teacher information</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Teacher Details */}
            <TeacherDetails teacherId={selectedTeacherId} />
          </>
        )}
      </div>
    </div>
  );
}
