"use client"
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar, 
  FileText, 
  ArrowLeft,
  MapPin,
  School,
  Users,
  Star,
  TrendingUp,
  Clock,
  Award,
  AlertCircle,
  Loader2,
  Badge,
  BookOpen
} from 'lucide-react';
import { teacherService } from '@/lib/api/services/teacherService';
import Button from '@/components/ui/Button';
import Loading from '@/components/common/Loading';

export default function TeacherDetails({ teacherId, onBack }) {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (teacherId) {
      fetchTeacherDetails();
    }
  }, [teacherId]);

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await teacherService.getTeacherById(teacherId);
      
      if (response.success) {
        setTeacher(response.data.teacher);
      } else {
        setError(response.error || 'Failed to fetch teacher details');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) return 'Never logged in';
    return new Date(lastLogin).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading teacher details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Teacher Details</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <Button
              onClick={fetchTeacherDetails}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
            <Button
              onClick={onBack}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher Not Found</h3>
          <p className="text-gray-600 mb-4">The requested teacher could not be found.</p>
          <Button
            onClick={onBack}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-4 rounded-full mr-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{teacher.user.full_name}</h1>
              <p className="text-gray-600">Employee ID: {teacher.employee_id}</p>
              <div className="flex items-center mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  teacher.user.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {teacher.user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
          <Button
            onClick={onBack}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Teachers
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{teacher.user.email}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{teacher.user.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
              Professional Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                <p className="text-gray-900">{teacher.qualifications || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{teacher.experience_years} years</span>
                </div>
              </div>
              {teacher.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <p className="text-gray-900 leading-relaxed">{teacher.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* School Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <School className="h-5 w-5 mr-2 text-blue-600" />
              School Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <p className="text-gray-900 font-medium">{teacher.school.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{teacher.school.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Programs */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Programs ({teacher.programs.length})
            </h2>
            {teacher.programs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teacher.programs.map((program, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-900">{program.name}</p>
                    <p className="text-sm text-gray-600">{program.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No programs assigned yet</p>
            )}
          </div>
        </div>

        {/* Statistics Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Statistics
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Students Taught</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{teacher.statistics.students_taught}</span>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Evaluations</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{teacher.statistics.evaluations_completed}</span>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">This Month</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{teacher.statistics.evaluations_this_month}</span>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Avg Rating</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">
                    {teacher.statistics.average_rating ? teacher.statistics.average_rating.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Active Since</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-600">{teacher.statistics.active_since_months}m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Account Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
                <p className="text-gray-900">{formatDate(teacher.joined_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                <p className="text-gray-900">{formatLastLogin(teacher.user.last_login)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                <p className="text-gray-900">{formatDate(teacher.created_at)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                <p className="text-gray-900">{formatDate(teacher.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}