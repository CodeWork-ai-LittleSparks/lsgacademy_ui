'use client';

import React from 'react';
import { BookOpen, Users, TrendingUp, Award } from 'lucide-react';
import { reportsData } from '@/lib/mockData';

export default function ProgramPerformance() {
  const { programPerformance } = reportsData;

  const PerformanceCard = ({ program }) => {
    const excellentPercentage = Math.round((program.excellent / program.totalStudents) * 100);
    const averagePercentage = Math.round((program.average / program.totalStudents) * 100);
    const inProcessPercentage = Math.round((program.inProcess / program.totalStudents) * 100);

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{program.name}</h3>
              <p className="text-sm text-gray-600">{program.totalStudents} students</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{excellentPercentage}%</div>
            <div className="text-sm text-gray-600">Excellence Rate</div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm font-medium text-gray-700">Excellent</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-900">{program.excellent}</span>
              <span className="text-sm text-gray-600 ml-1">({excellentPercentage}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-sm font-medium text-gray-700">Average</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-900">{program.average}</span>
              <span className="text-sm text-gray-600 ml-1">({averagePercentage}%)</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-sm font-medium text-gray-700">In Process</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-900">{program.inProcess}</span>
              <span className="text-sm text-gray-600 ml-1">({inProcessPercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div className="flex h-2 rounded-full overflow-hidden">
            <div 
              className="bg-green-500" 
              style={{ width: `${excellentPercentage}%` }}
            ></div>
            <div 
              className="bg-yellow-500" 
              style={{ width: `${averagePercentage}%` }}
            ></div>
            <div 
              className="bg-orange-500" 
              style={{ width: `${inProcessPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{program.completionRate}%</div>
            <div className="text-xs text-gray-600">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{program.avgScore}</div>
            <div className="text-xs text-gray-600">Avg Score</div>
          </div>
        </div>
      </div>
    );
  };

  const SummaryStats = () => {
    const totalStudents = programPerformance.reduce((sum, program) => sum + program.totalStudents, 0);
    const totalExcellent = programPerformance.reduce((sum, program) => sum + program.excellent, 0);
    const overallExcellenceRate = Math.round((totalExcellent / totalStudents) * 100);

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{totalStudents.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{totalExcellent}</div>
              <div className="text-sm text-gray-600">Excellent Students</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{overallExcellenceRate}%</div>
              <div className="text-sm text-gray-600">Excellence Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{programPerformance.length}</div>
              <div className="text-sm text-gray-600">Active Programs</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Performance by Program</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Excellent</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span>Average</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>In Process</span>
          </div>
        </div>
      </div>

      <SummaryStats />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {programPerformance.map((program, index) => (
          <PerformanceCard key={index} program={program} />
        ))}
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Performance Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Excellent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Process
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {programPerformance.map((program, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-50 rounded-lg mr-3">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{program.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {program.totalStudents}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{program.excellent}</div>
                    <div className="text-xs text-gray-500">
                      ({Math.round((program.excellent / program.totalStudents) * 100)}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{program.average}</div>
                    <div className="text-xs text-gray-500">
                      ({Math.round((program.average / program.totalStudents) * 100)}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{program.inProcess}</div>
                    <div className="text-xs text-gray-500">
                      ({Math.round((program.inProcess / program.totalStudents) * 100)}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {program.completionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}