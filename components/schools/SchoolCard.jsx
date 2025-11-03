"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MapPin, Users, BookOpen, Phone, Mail } from "lucide-react";

/**
 * SchoolCard component displays individual school information in a card format
 * @param {Object} school - School object with properties like id, name, location, etc.
 */
export default function SchoolCard({ school }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/schools/${school.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group"
    >
      {/* Header with school name and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-1">
            {school.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{school.location}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              school.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {school.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        {school.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{school.phone}</span>
          </div>
        )}
        {school.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{school.email}</span>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {school.students_count || 0}
          </div>
          <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
            <Users className="h-3 w-3" />
            Students
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-900">
            {school.programs_count || 0}
          </div>
          <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
            <BookOpen className="h-3 w-3" />
            Programs
          </div>
        </div>
      </div>

      {/* Description (if available) */}
      {school.description && (
        <div className="text-sm text-gray-600 line-clamp-2">
          {school.description}
        </div>
      )}

      {/* Created date */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Created: {new Date(school.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}