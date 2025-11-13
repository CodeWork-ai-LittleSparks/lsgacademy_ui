import React from 'react';
import { X, MapPin, Mail, Phone, Globe, Calendar, Users, BookOpen, Building, FileText } from 'lucide-react';
import { programsData } from '@/lib/mockData';

export default function SchoolDetails({ school, onClose, isOpen }) {
  if (!isOpen || !school) return null;

  const getStatusBadge = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'
      : 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium';
  };

  const getSchoolPrograms = () => {
    if (!school.programsList || school.programsList.length === 0) return [];
    return programsData.filter(program => school.programsList.includes(program.id));
  };

  const schoolPrograms = getSchoolPrograms();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Building className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{school.name}</h2>
              <p className="text-sm text-gray-600">School Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Status and Basic Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={getStatusBadge(school.status)}>
                  {school.status}
                </span>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{school.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{school.students}</div>
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
                      <div className="font-medium text-gray-900">{school.contactPerson}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium text-gray-900">{school.email}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium text-gray-900">{school.phone}</div>
                    </div>
                  </div>

                  {school.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Website</div>
                        <a 
                          href={school.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {school.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* School Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Additional Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
                <div className="space-y-4">
                  {school.establishedYear && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Established</div>
                        <div className="font-medium text-gray-900">{school.establishedYear}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Programs Offered</div>
                      <div className="font-medium text-gray-900">{school.programs} Programs</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-600">Student Enrollment</div>
                      <div className="font-medium text-gray-900">{school.students} Students</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              {school.address && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <div className="text-gray-900 whitespace-pre-line">{school.address}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Programs */}
            {schoolPrograms.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Programs Offered</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {schoolPrograms.map(program => (
                    <div key={program.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">{program.name}</div>
                        <div className="text-sm text-gray-600">{program.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {school.description && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-1" />
                  <div className="text-gray-700 whitespace-pre-line">{school.description}</div>
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{school.students}</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{school.programs}</div>
                  <div className="text-sm text-gray-600">Programs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{school.establishedYear ? new Date().getFullYear() - parseInt(school.establishedYear) : 'N/A'}</div>
                  <div className="text-sm text-gray-600">Years Active</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${school.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                    {school.status === 'Active' ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>
            </div>
          </div>
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