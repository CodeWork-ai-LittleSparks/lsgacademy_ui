"use client";
import Image from 'next/image';
import { toPublicAssetUrl } from '@/lib/utils/urlUtils';
import Button from '@/components/ui/Button';
import { BookOpen, Users, Target, Eye, Edit, Trash2, CheckCircle, XCircle, Layers, Calendar } from 'lucide-react';

export default function ProgramCard({ program, onView, onEdit, onDelete }) {
  const {
    id,
    name,
    description,
    thumbnail_url,
    total_levels,
    age_from,
    age_to,
    is_active,
    category,
    enrolled_schools,
  } = program || {};

  const categoryColor = category?.color || '#e5e7eb';

  return (
    <div className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-amber-300 bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      
      {/* Thumbnail Section */}
      <button 
        className="relative aspect-[16/9] w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden group/thumb"
        onClick={() => onView?.(program)} 
        aria-label={`Open ${name} details`}
      >
        {thumbnail_url ? (
          <>
            <Image 
              src={toPublicAssetUrl(thumbnail_url)} 
              alt={`${name} thumbnail`} 
              fill 
              className="object-cover group-hover/thumb:scale-110 transition-transform duration-500" 
              sizes="(max-width: 768px) 100vw, 33vw" 
            />
            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300" />
            
            {/* View Badge on Hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300">
              <div className="p-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
                <Eye className="w-6 h-6 text-orange-600" strokeWidth={2.5} />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <div className="p-4 bg-gray-200 rounded-2xl mb-2">
              <BookOpen className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <span className="text-sm font-semibold">No Image</span>
          </div>
        )}

        {/* Status Badge - Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm border-2 ${
            is_active 
              ? 'bg-green-100/90 text-green-700 border-green-200' 
              : 'bg-gray-100/90 text-gray-700 border-gray-200'
          }`}>
            {is_active ? (
              <CheckCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
            ) : (
              <XCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
            )}
            {is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </button>

      {/* Content Section */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Title & Category */}
        <div className="space-y-2">
          <h3 
            className="font-bold text-base sm:text-lg text-gray-900 line-clamp-2 group-hover:text-orange-700 transition-colors leading-tight" 
            title={name}
          >
            {name}
          </h3>
          
          {category?.name && (
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full shadow-sm" 
                style={{ backgroundColor: categoryColor }}
              />
              <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {category.name}
              </span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Levels */}
          <div className="flex flex-col items-center p-2.5 bg-amber-50 rounded-xl border border-amber-100">
            <div className="p-1.5 bg-amber-100 rounded-lg mb-1">
              <Layers className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-orange-700">{total_levels}</span>
            <span className="text-[10px] text-orange-600 font-semibold uppercase">Levels</span>
          </div>

          {/* Age Range */}
          <div className="flex flex-col items-center p-2.5 bg-green-50 rounded-xl border border-green-100">
            <div className="p-1.5 bg-green-100 rounded-lg mb-1">
              <Calendar className="w-4 h-4 text-green-600" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-green-700">{age_from}-{age_to}</span>
            <span className="text-[10px] text-green-600 font-semibold uppercase">Years</span>
          </div>

          {/* Schools */}
          <div className="flex flex-col items-center p-2.5 bg-amber-50 rounded-xl border border-amber-100">
            <div className="p-1.5 bg-amber-100 rounded-lg mb-1">
              <Users className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-bold text-orange-700">{enrolled_schools ?? 0}</span>
            <span className="text-[10px] text-orange-600 font-semibold uppercase">Schools</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView?.(program)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50 text-amber-600 hover:text-amber-700 font-semibold transition-all duration-200 hover:scale-105"
          >
            <Eye className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">View</span>
          </Button>
          
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onEdit?.(program)}
            className="flex items-center justify-center gap-1.5 p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
            title="Edit"
          >
            <Edit className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => onDelete?.(program)}
            className="flex items-center justify-center gap-1.5 p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </div>

      {/* Bottom Corner Decoration */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10" />
    </div>
  );
}
