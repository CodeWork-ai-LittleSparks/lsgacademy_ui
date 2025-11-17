"use client";
import { MapPin, CheckCircle, XCircle, ArrowLeft, Edit, Trash2, Calendar, Shield } from 'lucide-react';

export default function SchoolHeader({ school, onEdit, onDelete, onBack }) {
  const isActive = !!school?.is_active;
  const statusBadge = isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200';
  const createdDate = school?.created_at ? new Date(school.created_at).toLocaleDateString() : '';
  const logoUrl = school?.logo_url || '/favicon.ico';

  return (
    <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-sm">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Top Section - Back Button & Actions */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => onBack?.()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-semibold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
            <span className="hidden sm:inline">Back to Schools</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onEdit?.(school)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors font-semibold"
            >
              <Edit className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={() => onDelete?.(school)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors font-semibold"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Main Profile Section */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Logo/Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt={`${school?.name || 'School'} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Verification Badge */}
            <div className="absolute -bottom-2 -right-2 p-1 bg-white rounded-full shadow">
              <Shield className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
            </div>
          </div>

          {/* School Information */}
          <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
            {/* Name & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                {school?.name}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold border ${statusBadge} w-fit`}>
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

            {/* View Tag */}
            <div className="flex items-center gap-3 pt-1">
              <div className="px-2.5 py-1 bg-purple-100 rounded-full border border-purple-200">
                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">View</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
