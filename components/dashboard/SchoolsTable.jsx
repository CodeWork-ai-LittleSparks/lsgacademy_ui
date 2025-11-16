"use client";
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import { School, GraduationCap, Users, ClipboardCheck, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, Trophy, Sparkles } from 'lucide-react';

function sortBy(items, key, asc = true) {
  return [...items].sort((a, b) => {
    const va = a[key] ?? 0;
    const vb = b[key] ?? 0;
    return asc ? va - vb : vb - va;
  });
}

export default function SchoolsTable({ data = [] }) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState('evaluation_count');
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => sortBy(data.slice(0, 5), sortKey, asc), [data, sortKey, asc]);

  const onSort = (key) => {
    if (sortKey === key) setAsc((p) => !p);
    else { setSortKey(key); setAsc(false); }
  };

  const goToSchool = (school) => {
    const id = school.school_id || school.id;
    router.push(id ? `/schools/${id}` : '/schools');
  };

  const getSortIcon = (key) => {
    if (sortKey !== key) return <ArrowUpDown className="w-4 h-4 text-gray-400" strokeWidth={2} />;
    return asc 
      ? <ArrowUp className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
      : <ArrowDown className="w-4 h-4 text-purple-600" strokeWidth={2.5} />;
  };

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-purple-200 p-5 sm:p-6 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-300">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl shadow-sm">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                Top Performing Schools
              </h3>
              <p className="text-xs text-gray-600 mt-0.5 font-medium">Based on evaluation metrics</p>
            </div>
          </div>
          
          <button 
            className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-purple-50"
            onClick={() => router.push('/schools')}
          >
            View All
            <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <Table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr className="text-left text-xs sm:text-sm">
                <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide whitespace-nowrap">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-purple-700 transition-colors" onClick={() => onSort('school_name')}>
                    <School className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                    <span>School Name</span>
                    {getSortIcon('school_name')}
                  </div>
                </th>
                <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2 cursor-pointer hover:text-purple-700 transition-colors" onClick={() => onSort('student_count')}>
                    <GraduationCap className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                    <span>Students</span>
                    {getSortIcon('student_count')}
                  </div>
                </th>
                <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2 cursor-pointer hover:text-purple-700 transition-colors" onClick={() => onSort('teacher_count')}>
                    <Users className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                    <span>Teachers</span>
                    {getSortIcon('teacher_count')}
                  </div>
                </th>
                <th className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 uppercase tracking-wide text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2 cursor-pointer hover:text-purple-700 transition-colors" onClick={() => onSort('evaluation_count')}>
                    <ClipboardCheck className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
                    <span>Evaluations</span>
                    {getSortIcon('evaluation_count')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td className="py-8 sm:py-12 px-3 sm:px-4 text-center" colSpan={4}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-inner">
                        <Trophy className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
                      </div>
                      <p className="text-base font-semibold text-gray-600">
                        No top schools data available
                      </p>
                    </div>
                  </td>
                </tr>
              ) : rows.map((s, i) => (
                <tr 
                  key={i} 
                  className="group/row relative hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                  onClick={() => goToSchool(s)}
                >
                  {/* Rank Badge */}
                  <td className="py-3 sm:py-4 px-3 sm:px-4">
                    <div className="flex items-center gap-3">
                      {/* Ranking Number */}
                      <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg font-bold text-xs sm:text-sm shadow-sm ${
                        i === 0 
                          ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white' 
                          : i === 1 
                          ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                          : i === 2
                          ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {i + 1}
                      </div>
                      
                      {/* School Name with Hover Effect */}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-1.5 h-8 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-200" />
                        <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover/row:text-purple-700 transition-colors truncate">
                          {s.school_name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Students Count */}
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-xl">
                      <GraduationCap className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                      <span className="text-xs sm:text-sm font-bold text-blue-700">
                        {s.student_count?.toLocaleString() ?? 0}
                      </span>
                    </div>
                  </td>

                  {/* Teachers Count */}
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-xl">
                      <Users className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                      <span className="text-xs sm:text-sm font-bold text-green-700">
                        {s.teacher_count?.toLocaleString() ?? 0}
                      </span>
                    </div>
                  </td>

                  {/* Evaluations Count */}
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 rounded-xl">
                      <ClipboardCheck className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
                      <span className="text-xs sm:text-sm font-bold text-orange-700">
                        {s.evaluation_count?.toLocaleString() ?? 0}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Footer Note */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
          <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" strokeWidth={2.5} />
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            Showing top 5 schools ranked by performance metrics
          </p>
        </div>
      </div>
    </Card>
  );
}
