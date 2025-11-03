"use client"
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  FileText,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Loader2,
  Eye,
  Edit,
  Trash2,
  User
} from 'lucide-react';
import { studentService } from '@/lib/api/services/studentService';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function StudentList({ onViewStudent, onEditStudent }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 16,
    total: 0,
    total_pages: 1
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchStudents();
  }, [pagination.page, pagination.limit, sortBy, sortOrder]);

  const fetchStudents = async (search = searchTerm) => {
    setLoading(true);
    setError('');
    
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort_by: sortBy,
        sort_order: sortOrder,
        ...(search && { search })
      };

      console.log('Fetching students with params:', params);
      const response = await studentService.getStudents(params);
      
      if (response.success) {
        setStudents(response.data.students || []);
        setPagination(prev => ({
          ...prev,
          ...response.data.pagination
        }));
      } else {
        setError(response.error || 'Failed to load students');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchStudents(searchTerm);
  };

  const handleSort = (field) => {
    const newSortOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newSortOrder);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
      : 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium';
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Students</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
        <Button 
          onClick={() => fetchStudents()} 
          className="mt-4 bg-red-600 hover:bg-red-700 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600 mt-1">Manage and view all students</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Total: {pagination.total} students
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search students by name, email, or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="bg-primary hover:bg-primary-700 text-white">
              Search
            </Button>
            <Button 
              type="button" 
              onClick={() => fetchStudents()} 
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Loading students...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'No students match your search criteria.' : 'No students have been added yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                       onClick={() => handleSort('name')}
                     >
                       <div className="flex items-center">
                         Student
                         {sortBy === 'name' && (
                           <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                         )}
                       </div>
                     </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      School
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Programs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.user?.full_name || student.full_name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {student.user?.email || student.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.student_id || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {student.user?.phone || student.phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.school?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {student.school?.location || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 space-y-1">
                          <div className="flex items-center">
                            <BookOpen className="h-3 w-3 mr-1 text-primary" />
                            <span>{student.programs_count || 0} Programs</span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-3 w-3 mr-1 text-purple-500" />
                            <span>{student.evaluations_count || 0} Evaluations</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(student.is_active)}>
                          {student.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {onViewStudent && (
                            <button
                              onClick={() => {
                                console.log('Viewing student:', student);
                                onViewStudent(student.id);
                              }}
                              className="text-primary hover:text-primary-900 p-1 rounded hover:bg-primary-50"
                              title="View Student"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          {onEditStudent && (
                            <button
                              onClick={() => {
                                console.log('Editing student:', student);
                                onEditStudent(student.id);
                              }}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="Edit Student"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <Button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.total_pages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </Button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">
                          {((pagination.page - 1) * pagination.limit) + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">{pagination.total}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <Button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page <= 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          Previous
                        </Button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                pagination.page === pageNum
                                  ? 'z-10 bg-primary-50 border-primary-500 text-primary'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        
                        <Button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page >= pagination.total_pages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          Next
                        </Button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}