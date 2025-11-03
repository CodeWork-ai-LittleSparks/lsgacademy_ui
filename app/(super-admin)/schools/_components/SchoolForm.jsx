import React, { useState, useEffect } from 'react';
import { X, Save, Building, User, AlertCircle } from 'lucide-react';

export default function SchoolForm({ school, onSubmit, onClose, isOpen }) {
  const [formData, setFormData] = useState({
    // School Details
    name: '',
    location: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    // School Admin Details
    school_admin: {
      full_name: '',
      email: '',
      phone: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when school prop changes
  useEffect(() => {
    if (school) {
      setFormData({
        // School Details
        name: school.name || '',
        location: school.location || '',
        contact_person: school.contact_person || '',
        contact_email: school.contact_email || '',
        contact_phone: school.contact_phone || '',
        address: school.address || '',
        // School Admin Details
        school_admin: {
          full_name: school.school_admin?.full_name || '',
          email: school.school_admin?.email || '',
          phone: school.school_admin?.phone || ''
        }
      });
    } else {
      // Reset form for new school
      setFormData({
        // School Details
        name: '',
        location: '',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        // School Admin Details
        school_admin: {
          full_name: '',
          email: '',
          phone: ''
        }
      });
    }
    setErrors({});
  }, [school]);

  const validateForm = () => {
    const newErrors = {};

    // School Details validation
    if (!formData.name.trim()) {
      newErrors.name = 'School name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.contact_person.trim()) {
      newErrors.contact_person = 'Contact person is required';
    }

    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contact_email)) {
      newErrors.contact_email = 'Contact email is invalid';
    }

    if (!formData.contact_phone.trim()) {
      newErrors.contact_phone = 'Contact phone is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // School Admin Details validation
    if (!formData.school_admin.full_name.trim()) {
      newErrors['school_admin.full_name'] = 'Admin full name is required';
    }

    if (!formData.school_admin.email.trim()) {
      newErrors['school_admin.email'] = 'Admin email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.school_admin.email)) {
      newErrors['school_admin.email'] = 'Admin email is invalid';
    }

    if (!formData.school_admin.phone.trim()) {
      newErrors['school_admin.phone'] = 'Admin phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested school_admin fields
    if (name.startsWith('school_admin.')) {
      const adminField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        school_admin: {
          ...prev.school_admin,
          [adminField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        school_admin: prev.school_admin || { full_name: '', email: '', phone: '' },
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const schoolData = {
        ...formData,
        id: school?.id || Date.now().toString()
      };

      await onSubmit(schoolData);
    } catch (error) {
      console.error('Error saving school:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Building className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {school ? 'Edit School' : 'Add New School'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* School Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                School Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter school name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter location"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                      errors.contact_person ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter contact person name"
                  />
                  {errors.contact_person && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.contact_person}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                      errors.contact_email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="user@example.com"
                  />
                  {errors.contact_email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.contact_email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                      errors.contact_phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter contact phone number"
                  />
                  {errors.contact_phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.contact_phone}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter school address"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* School Admin Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                School Admin Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="school_admin.full_name"
                    value={formData.school_admin?.full_name || ''}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                      errors['school_admin.full_name'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter admin full name"
                  />
                  {errors['school_admin.full_name'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors['school_admin.full_name']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="school_admin.email"
                    value={formData.school_admin?.email || ''}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                      errors['school_admin.email'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="user@example.com"
                  />
                  {errors['school_admin.email'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors['school_admin.email']}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="school_admin.phone"
                    value={formData.school_admin?.phone || ''}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                      errors['school_admin.phone'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter admin phone number"
                  />
                  {errors['school_admin.phone'] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors['school_admin.phone']}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : (school ? 'Update School' : 'Add School')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}