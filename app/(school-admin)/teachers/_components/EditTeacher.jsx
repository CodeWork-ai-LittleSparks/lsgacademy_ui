"use client"
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar, 
  FileText, 
  Save,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { teacherService } from '@/lib/api/services/teacherService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function EditTeacher({ teacherId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    qualifications: '',
    experience_years: 0,
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load existing teacher data
  useEffect(() => {
    const loadTeacherData = async () => {
      if (!teacherId) {
        console.log('EditTeacher: No teacherId provided');
        return;
      }
      
      console.log('EditTeacher: Loading data for teacherId:', teacherId);
      setLoadingData(true);
      try {
        const response = await teacherService.getTeacherById(teacherId);
        console.log('EditTeacher: API response:', response);
        
        if (response.success && response.data) {
          const teacher = response.data;
          console.log('EditTeacher: Teacher data:', teacher);
          
          const newFormData = {
            full_name: teacher.user?.full_name || '',
            email: teacher.user?.email || '',
            phone: teacher.user?.phone || teacher.phone || '',
            qualifications: teacher.qualifications || '',
            experience_years: teacher.experience_years || 0,
            bio: teacher.bio || ''
          };
          
          console.log('EditTeacher: Setting form data:', newFormData);
          setFormData(newFormData);
        } else {
          console.error('EditTeacher: Failed to load teacher data:', response);
          setError('Failed to load teacher data');
        }
      } catch (error) {
        console.error('EditTeacher: Error loading teacher data:', error);
        setError('Error loading teacher data');
      } finally {
        setLoadingData(false);
      }
    };

    loadTeacherData();
  }, [teacherId]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Updating teacher with ID:', teacherId);
      console.log('Form data being sent:', formData);
      
      const response = await teacherService.updateTeacher(teacherId, formData);
      console.log('API response:', response);
      
      if (response.success) {
        setSuccess('Teacher updated successfully!');
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(response.data);
          }
        }, 1500);
      } else {
        setError(response.error || 'Failed to update teacher');
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
      setError('An error occurred while updating the teacher');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading teacher data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                  className="w-full pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                  placeholder="Years of experience"
                  className="w-full pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
            Professional Information
          </h3>
          
          <div>
            <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">
              Qualifications
            </label>
            <Input
              id="qualifications"
              name="qualifications"
              type="text"
              value={formData.qualifications}
              onChange={handleInputChange}
              placeholder="Enter qualifications (e.g., B.Ed, M.A. in Mathematics)"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Biography
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Enter a brief biography..."
                rows={4}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Teacher
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}