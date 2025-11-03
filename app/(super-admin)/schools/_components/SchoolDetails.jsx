import React, { useState, useEffect } from 'react';
import { X, MapPin, Mail, Phone, Globe, Users, BookOpen, Building, FileText, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { schoolService } from '@/lib/api/services/schoolService';

export default function SchoolDetails({ school, onClose, isOpen }) {
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && school?.id) {
      fetchSchoolDetails();
    }
  }, [isOpen, school?.id]);

  const fetchSchoolDetails = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await schoolService.getSchoolById(school.id);
      
      if (response.success) {
        setSchoolData(response.data.school);
      } else {
        setError(response.error || 'Failed to load school details');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading school details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !school) return null;

  const getStatusBadge = (isActive) => {
    return isActive
      ? 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'
      : 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium';
  };

  // Use fetched data if available, fallback to passed school data
  const displayData = schoolData || school;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Building className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{displayData.name}</h2>
              <p className="text-sm text-gray-600">School Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading school details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchSchoolDetails}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
          <div className="p-6 space-y-6">
              {/* Status and Basic Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className={getStatusBadge(!!displayData.is_active)}>
                    <span className="inline-flex items-center gap-1">
                      {displayData.is_active ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {displayData.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </span>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{displayData.location || '—'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{displayData.students_count ?? 0}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
              </div>

            {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Contact Person</div>
                        <div className="font-medium text-gray-900">{displayData.contact_person || '—'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Email</div>
                        <div className="font-medium text-gray-900">{displayData.contact_email || '—'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Phone</div>
                        <div className="font-medium text-gray-900">{displayData.contact_phone || '—'}</div>
                      </div>
                    </div>

                    {displayData.logo_url && (
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-600">Logo</div>
                          <img 
                            src={displayData.logo_url} 
                            alt="School Logo"
                            className="h-12 w-12 object-cover rounded-lg border"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            {/* School Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Additional Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Programs Count:</span>
                      <span className="text-sm font-medium text-gray-900">{displayData.programs_count || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Students Count:</span>
                      <span className="text-sm font-medium text-gray-900">{displayData.students_count || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Teachers Count:</span>
                      <span className="text-sm font-medium text-gray-900">{displayData.teachers_count || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Evaluations Completed:</span>
                      <span className="text-sm font-medium text-gray-900">{displayData.evaluations_completed || 0}</span>
                    </div>
                    {displayData.admin && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">School Admin:</span>
                        <span className="text-sm font-medium text-gray-900">{displayData.admin.full_name || '—'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Address</h4>
                  <div className="text-sm text-gray-900 whitespace-pre-line">
                    {displayData.address || '—'}
                  </div>
                </div>
              </div>

              {displayData.admin && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Admin Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Admin Name:</span>
                        <span className="text-sm font-medium text-gray-900">{displayData.admin.full_name || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Admin Email:</span>
                        <span className="text-sm font-medium text-gray-900">{displayData.admin.email || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Admin Phone:</span>
                        <span className="text-sm font-medium text-gray-900">{displayData.admin.phone || '—'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Admin Role:</span>
                        <span className="text-sm font-medium text-gray-900">{displayData.admin.role || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Admin Status:</span>
                        <span className={`text-sm font-medium ${displayData.admin.is_active ? 'text-green-600' : 'text-red-600'}`}>
                          {displayData.admin.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Login:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {displayData.admin.last_login ? new Date(displayData.admin.last_login).toLocaleDateString() : 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Statistics */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{displayData.students_count ?? 0}</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{displayData.programs_count ?? 0}</div>
                  <div className="text-sm text-gray-600">Programs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{displayData.teachers_count ?? 0}</div>
                  <div className="text-sm text-gray-600">Teachers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{displayData.evaluations_completed ?? 0}</div>
                  <div className="text-sm text-gray-600">Evaluations</div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
