"use client";
import { useEffect, useMemo, useState } from 'react';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import Button from '@/components/ui/Button';
import { getCategories } from '@/lib/api/services/programService';
import { Search, Filter, Grid3x3, List, Tag, ToggleLeft, Sparkles, AlertCircle } from 'lucide-react';

export default function ProgramFilters({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
}) {
  const [searchLocal, setSearchLocal] = useState(filters?.search ?? '');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timerId;
    timerId = setTimeout(() => {
      onFilterChange?.({ ...filters, search: searchLocal });
    }, 500);
    return () => clearTimeout(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchLocal]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getCategories()
      .then((res) => {
        if (!isMounted) return;
        if (res.success) {
          const sorted = (res.data || []).slice().sort((a, b) => a.name.localeCompare(b.name));
          setCategories(sorted);
          setError(null);
        } else {
          setError(res.error || 'Failed to load categories');
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
  }, []);

  const categoryOptions = useMemo(() => {
    return [{ value: '', label: 'All Categories' }, ...categories.map((c) => ({ value: c.id, label: c.name }))];
  }, [categories]);

  const activeFiltersCount = [
    filters?.category_id,
    filters?.is_active !== 'all' ? filters?.is_active : null
  ].filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-4 sm:p-5 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
            <Filter className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Filter Programs
          </h3>
        </div>
        
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 border-2 border-purple-200 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
            <span className="text-xs font-bold text-purple-700">
              {activeFiltersCount} Active
            </span>
          </div>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px] sm:min-w-[280px]">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Search
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-purple-100 rounded-lg pointer-events-none">
              <Search className="h-4 w-4 text-purple-600" strokeWidth={2.5} />
            </div>
            <Input
              value={searchLocal}
              onChange={(e) => setSearchLocal(e.target.value)}
              placeholder="Search program name..."
              className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 bg-white font-medium transition-all duration-200 hover:border-purple-300"
              aria-label="Search programs"
            />
            {searchLocal && (
              <button
                onClick={() => setSearchLocal('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-gray-400 hover:text-gray-600 text-lg">×</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Category
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-green-100 rounded-lg pointer-events-none z-10">
              <Tag className="h-4 w-4 text-green-600" strokeWidth={2.5} />
            </div>
            <Dropdown
              value={filters?.category_id || ''}
              onChange={(e) => onFilterChange?.({ ...filters, category_id: e.target.value })}
              options={categoryOptions}
              aria-label="Filter by category"
              className="pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white font-medium transition-all duration-200 hover:border-green-300 appearance-none w-full"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Status
          </label>
          <div className="relative">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-sm z-10 ${
              filters?.is_active === 'true' 
                ? 'bg-green-500' 
                : filters?.is_active === 'false' 
                ? 'bg-red-500' 
                : 'bg-gray-400'
            }`} />
            <Dropdown
              value={filters?.is_active || 'all'}
              onChange={(e) => onFilterChange?.({ ...filters, is_active: e.target.value })}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
              aria-label="Filter by status"
              className="pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white font-medium transition-all duration-200 hover:border-blue-300 appearance-none w-full"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="ml-auto">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            View Mode
          </label>
          <div className="flex items-center gap-2 p-1 bg-white border-2 border-gray-200 rounded-xl shadow-sm">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              onClick={() => onViewModeChange?.('grid')}
              aria-pressed={viewMode === 'grid'}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md hover:scale-105'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Grid3x3 className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              onClick={() => onViewModeChange?.('list')}
              aria-pressed={viewMode === 'list'}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md hover:scale-105'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <List className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">List</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <div className="flex-shrink-0 p-1.5 bg-red-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
        <div className="w-1 h-4 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full" />
        <p className="text-xs sm:text-sm text-gray-600 font-medium">
          Use multiple filters to refine your program search results
        </p>
      </div>
    </div>
  );
}
