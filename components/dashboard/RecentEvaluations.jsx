"use client";
import Card from '@/components/ui/Card';
import { CheckCircle, Clock, Award, GraduationCap, Building2, User, Sparkles } from 'lucide-react';

function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function getPerformanceBadge(performance) {
  const perfLower = (performance || '').toLowerCase();
  if (perfLower.includes('excellent')) {
    return { color: 'bg-green-100 text-green-700 border-green-300', label: performance };
  } else if (perfLower.includes('average')) {
    return { color: 'bg-amber-100 text-amber-700 border-amber-300', label: performance };
  } else if (perfLower.includes('process')) {
    return { color: 'bg-blue-100 text-blue-700 border-blue-300', label: performance };
  } else {
    return { color: 'bg-gray-100 text-gray-700 border-gray-300', label: performance };
  }
}

export default function RecentEvaluations({ items = [] }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-purple-200 p-5 sm:p-6 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-300">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                Recent Evaluations
              </h3>
              <p className="text-xs text-gray-600 mt-0.5 font-medium">Latest student assessments</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {!Array.isArray(items) || items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
            <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl mb-4 shadow-inner">
              <Award className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-base sm:text-lg font-semibold text-gray-600 mb-1">
              No recent evaluations
            </p>
            <p className="text-xs sm:text-sm text-gray-500 text-center max-w-xs">
              Student evaluations will appear here once completed
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr className="text-left text-xs sm:text-sm">
                  <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                      Student
                    </div>
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                      School
                    </div>
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                      Program
                    </div>
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide text-center whitespace-nowrap">
                    Level
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide text-center whitespace-nowrap">
                    Performance
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                    Teacher
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                      Evaluated At
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((ev) => {
                  const perfBadge = getPerformanceBadge(ev.performance);
                  return (
                    <tr 
                      key={ev.id} 
                      className="group/row hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200"
                    >
                      {/* Student Name */}
                      <td className="py-3 sm:py-4 px-3 sm:px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-8 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-200" />
                          <span className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">
                            {ev.student_name}
                          </span>
                        </div>
                      </td>

                      {/* School */}
                      <td className="py-3 sm:py-4 px-3 sm:px-4">
                        <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">
                          {ev.school}
                        </span>
                      </td>

                      {/* Program */}
                      <td className="py-3 sm:py-4 px-3 sm:px-4">
                        <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">
                          {ev.program}
                        </span>
                      </td>

                      {/* Level */}
                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-center">
                        <span className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-100 rounded-full whitespace-nowrap shadow-sm">
                          {ev.level}
                        </span>
                      </td>

                      {/* Performance */}
                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl border-2 ${perfBadge.color} whitespace-nowrap shadow-sm`}>
                          {perfBadge.label}
                        </span>
                      </td>

                      {/* Teacher */}
                      <td className="py-3 sm:py-4 px-3 sm:px-4">
                        <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">
                          {ev.teacher}
                        </span>
                      </td>

                      {/* Evaluated At */}
                      <td className="py-3 sm:py-4 px-3 sm:px-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                          <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" strokeWidth={2} />
                          <span className="font-medium">{formatDateTime(ev.evaluated_at)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Note */}
        {items.length > 0 && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" strokeWidth={2.5} />
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Showing {items.length} most recent evaluation{items.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
