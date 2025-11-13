"use client";
import { MapPin, CheckCircle, XCircle, ArrowLeft, Edit, Trash2, Calendar, Shield } from 'lucide-react';

export default function SchoolHeader({ school, onEdit, onDelete, onBack }) {
  const isActive = !!school?.is_active;
  const statusBadge = isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200';
  const createdDate = school?.created_at ? new Date(school.created_at).toLocaleDateString() : '';
  const logoUrl = school?.logo_url || '/favicon.ico';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-gray-50 to-purple-50/30 p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-3xl opacity-15" />
      
      <div className="relative z-10">
        {/* Top Section - Back Button & Actions */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => onBack?.()} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 font-semibold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:translate-x-[-4px] transition-transform duration-200" strokeWidth={2.5} />
            <span className="hidden sm:inline">Back to Schools</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => onEdit?.(school)} 
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
            >
              <Edit className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button 
              onClick={() => onDelete?.(school)} 
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Main Profile Section */}
        <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
          {/* Logo/Avatar */}
          <div className="relative group/avatar flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white border-4 border-white shadow-lg group-hover/avatar:shadow-xl transition-all duration-300 group-hover/avatar:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={logoUrl} 
                alt={`${school?.name || 'School'} logo`} 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Verification Badge */}
            <div className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-full shadow-md">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" strokeWidth={2.5} />
            </div>
          </div>

          {/* School Information */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Name & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                {school?.name}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border-2 ${statusBadge} shadow-sm w-fit`}>
                {isActive ? (
                  <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                  <XCircle className="w-4 h-4" strokeWidth={2.5} />
                )}
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Meta Information */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm sm:text-base">
              {/* Location */}
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                  <MapPin className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                </div>
                <span>{school?.location}</span>
              </div>

              {/* Divider */}
              {createdDate && (
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
              )}

              {/* Created Date */}
              {createdDate && (
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Calendar className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                  </div>
                  <span>Created on {createdDate}</span>
                </div>
              )}
            </div>

            {/* Additional Info Bar (Optional) */}
            <div className="flex items-center gap-3 pt-2">
              <div className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border border-purple-200">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">
                  School Profile
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
