"use client";
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import { GraduationCap, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

function sortBy(items, key, asc = true) {
  return [...items].sort((a, b) => {
    const va = a[key] ?? 0;
    const vb = b[key] ?? 0;
    return asc ? va - vb : vb - va;
  });
}

export default function ProgramsTable({ data = [] }) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState('total_students');
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => sortBy(data.slice(0, 5), sortKey, asc), [data, sortKey, asc]);

  const onSort = (key) => {
    if (sortKey === key) setAsc((p) => !p);
    else { setSortKey(key); setAsc(false); }
  };

  const goToProgram = (program) => {
    const id = program.program_id || program.id;
    router.push(id ? `/programs/${id}` : '/programs');
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
            <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-800 tracking-tight">
              Program Enrollment Overview
            </h3>
          </div>
          <button 
            className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-purple-50"
            onClick={() => router.push('/programs')}
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
                <th 
                  className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
                  onClick={() => onSort('program_name')}
                >
                  <div className="flex items-center gap-2">
                    <span className="uppercase tracking-wide">Program Name</span>
                    {getSortIcon('program_name')}
                  </div>
                </th>
                <th 
                  className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 cursor-pointer hover:bg-purple-50 transition-colors duration-200 text-right"
                  onClick={() => onSort('enrolled_schools')}
                >
                  <div className="flex items-center justify-end gap-2">
                    <span className="uppercase tracking-wide">Schools</span>
                    {getSortIcon('enrolled_schools')}
                  </div>
                </th>
                <th 
                  className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 cursor-pointer hover:bg-purple-50 transition-colors duration-200 text-right"
                  onClick={() => onSort('total_students')}
                >
                  <div className="flex items-center justify-end gap-2">
                    <span className="uppercase tracking-wide">Students</span>
                    {getSortIcon('total_students')}
                  </div>
                </th>
                <th 
                  className="py-3 sm:py-4 px-3 sm:px-4 font-bold text-gray-700 cursor-pointer hover:bg-purple-50 transition-colors duration-200"
                  onClick={() => onSort('completion_rate')}
                >
                  <div className="flex items-center gap-2">
                    <span className="uppercase tracking-wide">Completion</span>
                    {getSortIcon('completion_rate')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td className="py-8 sm:py-12 px-3 sm:px-4 text-center" colSpan={4}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-gray-100 rounded-2xl">
                        <GraduationCap className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-gray-600">
                        No program statistics available
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Program data will appear here once available
                      </p>
                    </div>
                  </td>
                </tr>
              ) : rows.map((p, i) => (
                <tr 
                  key={i} 
                  className="group/row hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                  onClick={() => goToProgram(p)}
                >
                  <td className="py-3 sm:py-4 px-3 sm:px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-8 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity duration-200" />
                      <span className="text-xs sm:text-sm font-bold text-gray-900 group-hover/row:text-purple-700 transition-colors duration-200">
                        {p.program_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-right">
                    <span className="inline-flex items-center justify-center min-w-[30px] px-3 py-1 text-xs sm:text-sm font-bold text-blue-700 bg-blue-100 rounded-full">
                      {p.enrolled_schools ?? 0}
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4 text-right">
                    <span className="inline-flex items-center justify-center min-w-[30px] px-3 py-1 text-xs sm:text-sm font-bold text-purple-700 bg-purple-100 rounded-full">
                      {p.total_students ?? 0}
                    </span>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[90px] sm:max-w-[105px]">
                        <div className="relative h-2.5 sm:h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${Math.min(Math.max(p.completion_rate ?? 0, 0), 100)}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          </div>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 min-w-[34px]">
                        {(p.completion_rate ?? 0).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
