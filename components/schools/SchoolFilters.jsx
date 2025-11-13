"use client";
import { useEffect, useState } from 'react';
import { Search, MapPin, Filter, RefreshCw, Sparkles, ArrowUpAZ, ArrowDownZA } from 'lucide-react';

export default function SchoolFilters({ filters, onFilterChange, onRefresh }) {
  const [localSearch, setLocalSearch] = useState(filters?.search || '');
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    // Debounce search input by 500ms
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      onFilterChange?.({ ...filters, search: localSearch });
    }, 500);
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  const activeFiltersCount = [
    filters?.location,
    filters?.status !== 'all' ? filters?.status : null
  ].filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
            <Filter className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Filter Schools
          </h3>
        </div>
        
        {/* Active Filters Badge */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 border-2 border-purple-200 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
            <span className="text-xs font-bold text-purple-700">
              {activeFiltersCount} Active
            </span>
          </div>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Search
          </label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <Search className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Search schools by name..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 bg-white text-sm font-medium text-gray-900 placeholder:text-gray-400 transition-all duration-200 hover:border-purple-300"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-gray-400 hover:text-gray-600 text-lg">×</span>
              </button>
            )}
          </div>
        </div>

        {/* Location Input (exact match) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Location (exact)
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-blue-100 rounded-lg pointer-events-none">
              <MapPin className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
            </div>
            <input
              type="text"
              value={filters?.location || ''}
              onChange={(e) => onFilterChange?.({ ...filters, location: e.target.value })}
              placeholder="e.g., Chennai"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white text-sm font-medium text-gray-900 transition-all duration-200 hover:border-blue-300"
            />
          </div>
        </div>

        {/* Status Select */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Status
          </label>
          <div className="relative">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${
              filters?.status === 'active' 
                ? 'bg-green-500' 
                : filters?.status === 'inactive' 
                ? 'bg-red-500' 
                : 'bg-gray-400'
            } shadow-sm`} />
            <select
              value={filters?.status || 'all'}
              onChange={(e) => onFilterChange?.({ ...filters, status: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white text-sm font-medium text-gray-900 appearance-none cursor-pointer transition-all duration-200 hover:border-green-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Sort by
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-purple-100 rounded-lg pointer-events-none">
              <ArrowUpAZ className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
            </div>
            <select
              value={filters?.sort_by || 'name'}
              onChange={(e) => onFilterChange?.({ ...filters, sort_by: e.target.value })}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 bg-white text-sm font-medium text-gray-900 appearance-none cursor-pointer transition-all duration-200 hover:border-purple-300"
            >
              <option value="name">Name</option>
              <option value="created_at">Created At</option>
              <option value="students_count">Students Count</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Sort order
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-purple-100 rounded-lg pointer-events-none">
              <ArrowDownZA className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
            </div>
            <select
              value={filters?.sort_order || 'asc'}
              onChange={(e) => onFilterChange?.({ ...filters, sort_order: e.target.value })}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 bg-white text-sm font-medium text-gray-900 appearance-none cursor-pointer transition-all duration-200 hover:border-purple-300"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full" />
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            Refine your search with multiple filters
          </p>
        </div>
        
        <button 
          onClick={onRefresh} 
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </div>
  );
}
