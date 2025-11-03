"use client"
import React, { useState } from 'react';
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

export default function AddTeacher({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    qualifications: '',
    experience_years: 0,
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      const response = await teacherService.createTeacher(formData);
      
      if (response.success) {
        setSuccess(response.message || 'Teacher created successfully!');
        // Reset form
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          qualifications: '',
          experience_years: 0,
          bio: ''
        });
        
        // Call success callback if provided
        if (onSuccess) {
          setTimeout(() => onSuccess(response.data), 1500);
        }
      } else {
        setError(response.error || 'Failed to create teacher');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-800">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Full Name *
            </label>
            <Input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="Enter teacher's full name"
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email Address *
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="teacher@example.com"
              required
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone Number
            </label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Years of Experience
            </label>
            <Input
              type="number"
              name="experience_years"
              value={formData.experience_years}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              max="50"
              className="w-full"
            />
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <GraduationCap className="h-4 w-4 inline mr-1" />
            Qualifications
          </label>
          <Input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleInputChange}
            placeholder="e.g., M.Ed, B.Sc in Mathematics, Teaching Certificate"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="h-4 w-4 inline mr-1" />
            Bio / Description
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Brief description about the teacher's background, specialties, and teaching philosophy..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-center pt-6 border-t border-gray-200">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating Teacher...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Create Teacher
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Field Requirements */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Field Requirements:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Full Name and Email are required fields</li>
          <li>• Email must be in valid format (e.g., user@example.com)</li>
          <li>• Experience years must be between 0 and 50</li>
          <li>• All other fields are optional but recommended</li>
        </ul>
      </div>
    </div>
  );
}