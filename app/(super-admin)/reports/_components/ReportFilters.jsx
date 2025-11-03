'use client';

import React, { useState } from 'react';
import { Calendar, Download, FileText, Printer, Filter } from 'lucide-react';
import { reportsData } from '@/lib/mockData';

export default function ReportFilters({ onFiltersChange, onExport }) {
  const [filters, setFilters] = useState({
    startDate: '2025-10-01',
    endDate: '2025-10-18',
    school: 'All Schools',
    program: 'All Programs',
    level: 'All Levels',
    category: 'All Categories'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleExport = (type) => {
    onExport?.(type, filters);
    // Simulate export action
    console.log(`Exporting ${type} with filters:`, filters);
  };

  const handleGenerateReport = () => {
    console.log('Generating report with filters:', filters);
    // Generate report logic here
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Generate Report</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {/* Date Range */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* School Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schools
          </label>
          <select
            value={filters.school}
            onChange={(e) => handleFilterChange('school', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {reportsData.filterOptions.schools.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>

        {/* Program Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Programs
          </label>
          <select
            value={filters.program}
            onChange={(e) => handleFilterChange('program', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {reportsData.filterOptions.programs.map((program) => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </select>
        </div>

        {/* Level Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Levels
          </label>
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {reportsData.filterOptions.levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categories
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {reportsData.filterOptions.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Export Options */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </button>
          <button
            onClick={() => handleExport('print')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>

        {/* Generate Report Button */}
        <button
          onClick={handleGenerateReport}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Generate Report
        </button>
      </div>

      {/* Applied Filters Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Applied Filters:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {filters.startDate} to {filters.endDate}
          </span>
          {filters.school !== 'All Schools' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              {filters.school}
            </span>
          )}
          {filters.program !== 'All Programs' && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
              {filters.program}
            </span>
          )}
          {filters.level !== 'All Levels' && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">
              {filters.level}
            </span>
          )}
          {filters.category !== 'All Categories' && (
            <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded">
              {filters.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}