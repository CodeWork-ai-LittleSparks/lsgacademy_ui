"use client";
import Image from 'next/image';
import Card from '@/components/ui/Card';
import { MapPin, Users, GraduationCap, CheckCircle, XCircle, Eye, Edit, Trash2, ArrowRight } from 'lucide-react';

export default function SchoolCard({ school, onView, onEdit, onDelete }) {
  const isActive = !!school?.is_active;
  const statusBadge = isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200';
  const logoUrl = school?.logo_url || '/favicon.ico';

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-purple-300 p-5 sm:p-6 bg-gradient-to-br from-white to-gray-50 hover:from-purple-50 hover:to-blue-50 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header Section with Logo & Status */}
        <div className="flex items-start gap-3 sm:gap-4 mb-5">
          {/* Logo with Border */}
          <div className="relative flex-shrink-0 group/logo">
            <div className="w-14 h-14 sm:w-16 sm:h-16 overflow-hidden rounded-2xl bg-white border-4 border-white shadow-lg group-hover/logo:shadow-xl transition-all duration-300 group-hover/logo:scale-110">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={logoUrl} 
                alt={`${school?.name || 'School'} logo`} 
                className="object-cover w-full h-full"
              />
            </div>
            
            {/* Verification Badge */}
            <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-md">
              {isActive ? (
                <CheckCircle className="w-4 h-4 text-green-600" strokeWidth={2.5} />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" strokeWidth={2.5} />
              )}
            </div>
          </div>

          {/* School Info & Status Badge */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-1">
                {school?.name}
              </h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border-2 ${statusBadge} shadow-sm whitespace-nowrap`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600 font-medium">
              <div className="p-1 bg-purple-100 rounded-lg">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" strokeWidth={2.5} />
              </div>
              <span className="line-clamp-1">{school?.location}</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
          {/* Students Count */}
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-xl flex-1">
            <div className="p-1 bg-white rounded-lg">
              <GraduationCap className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Students</span>
              <span className="text-sm sm:text-base font-bold text-blue-900 truncate">
                {school?.student_count?.toLocaleString?.() ?? school?.student_count ?? 0}
              </span>
            </div>
          </div>

          {/* Teachers Count */}
          <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-xl flex-1">
            <div className="p-1 bg-white rounded-lg">
              <Users className="w-4 h-4 text-green-600" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Teachers</span>
              <span className="text-sm sm:text-base font-bold text-green-900 truncate">
                {school?.teacher_count?.toLocaleString?.() ?? school?.teacher_count ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onView?.(school); }} 
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-100 to-blue-100 hover:from-indigo-600 hover:to-blue-600 text-indigo-600 hover:text-white font-semibold text-sm transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md group/btn"
          >
            <Eye className="w-4 h-4" strokeWidth={2.5} />
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover/btn:opacity-100 transition-opacity" strokeWidth={2.5} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit?.(school); }} 
            className="p-2.5 rounded-xl bg-teal-100 hover:bg-teal-600 text-teal-600 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
            title="Edit"
          >
            <Edit className="w-4 h-4" strokeWidth={2.5} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete?.(school); }} 
            className="p-2.5 rounded-xl bg-red-100 hover:bg-red-600 text-red-600 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Hover Accent Border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 to-blue-400 opacity-10" />
      </div>
    </Card>
  );
}
