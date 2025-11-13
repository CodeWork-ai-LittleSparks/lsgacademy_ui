"use client";
import Table from '@/components/ui/Table';
import { MapPin, Users, GraduationCap, Eye, Edit, Trash2, School, Sparkles } from 'lucide-react';

export default function SchoolTable({ schools = [], onView, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
      {/* Table Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-5 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <School className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              Schools Directory
            </h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-purple-200">
            <Sparkles className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
            <span className="text-sm font-bold text-purple-700">{schools.length} Schools</span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <tr className="text-left text-xs sm:text-sm">
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                School Name
              </th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                Location
              </th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide text-center whitespace-nowrap">
                Students
              </th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide text-center whitespace-nowrap">
                Teachers
              </th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                Status
              </th>
              <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide text-center whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {schools.length === 0 ? (
              <tr>
                <td className="py-12 px-4 text-center" colSpan={6}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-inner">
                      <School className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
                    </div>
                    <p className="text-base font-semibold text-gray-600">
                      No schools found
                    </p>
                    <p className="text-sm text-gray-500">
                      Schools will appear here once added
                    </p>
                  </div>
                </td>
              </tr>
            ) : schools.map((s) => (
              <tr 
                key={s.id} 
                className="group hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200"
              >
                {/* School Name */}
                <td className="py-3 sm:py-4 px-3 sm:px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-10 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-purple-700 transition-colors whitespace-nowrap">
                      {s.name}
                    </span>
                  </div>
                </td>

                {/* Location */}
                <td className="py-3 sm:py-4 px-3 sm:px-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" strokeWidth={2.5} />
                    </div>
                    <span className="whitespace-nowrap">{s.location}</span>
                  </div>
                </td>

                {/* Students Count */}
                <td className="py-3 sm:py-4 px-3 sm:px-4 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-xl">
                    <GraduationCap className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                    <span className="text-xs sm:text-sm font-bold text-blue-700">{s.student_count}</span>
                  </div>
                </td>

                {/* Teachers Count */}
                <td className="py-3 sm:py-4 px-3 sm:px-4 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-xl">
                    <Users className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                    <span className="text-xs sm:text-sm font-bold text-green-700">{s.teacher_count}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3 sm:py-4 px-3 sm:px-4">
                  <span 
                    className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border-2 shadow-sm whitespace-nowrap ${
                      s.is_active 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {s.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3 sm:py-4 px-3 sm:px-4">
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <button 
                      onClick={() => onView?.(s)} 
                      className="group/btn p-2 rounded-lg bg-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
                      title="View"
                    >
                      <Eye className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => onEdit?.(s)} 
                      className="group/btn p-2 rounded-lg bg-teal-100 hover:bg-teal-600 text-teal-600 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => onDelete?.(s)} 
                      className="group/btn p-2 rounded-lg bg-red-100 hover:bg-red-600 text-red-600 hover:text-white transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
