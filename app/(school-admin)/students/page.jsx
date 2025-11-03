"use client";
import React from 'react';
import StudentList from './_components/StudentList';

export default function StudentsPage() {
  const handleViewStudent = (studentId) => {
    console.log('View student:', studentId);
    // TODO: Implement view student functionality
  };

  const handleEditStudent = (studentId) => {
    console.log('Edit student:', studentId);
    // TODO: Implement edit student functionality
  };

  return (
    <div className="p-6">
      <StudentList 
        onViewStudent={handleViewStudent}
        onEditStudent={handleEditStudent}
      />
    </div>
  );
}
