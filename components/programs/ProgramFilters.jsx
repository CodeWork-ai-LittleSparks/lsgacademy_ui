"use client";
import { useEffect, useMemo, useState } from 'react';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import { getCategories } from '@/lib/api/services/programService';
import { Search, Filter, Tag, RotateCcw, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';

export default function ProgramFilters({ filters, onFilterChange }) {
  const [searchLocal, setSearchLocal] = useState(filters?.search ?? '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Keep local input in sync when external filters update (e.g., via URL)
  useEffect(() => {
    const incoming = filters?.search || '';
    if (incoming !== searchLocal) {
      setSearchLocal(incoming);
    }
  }, [filters?.search]);

  // Immediate search update to match Schools behavior
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchLocal(val);
    onFilterChange?.({ ...filters, search: val });
  };

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
    (filters?.search || '').trim() ? 'search' : null,
    filters?.category_id || null,
    filters?.status !== 'all' ? filters?.status : null,
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    setSearchLocal('');
    onFilterChange?.({ ...filters, search: '', category_id: '', status: 'all' });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 overflow-hidden transition-all duration-300">
      {/* Compact Header */}
      <div className="p-3 sm:p-3 flex items-center justify-between gap-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <Filter className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-white text-purple-600 rounded-full">
              {activeFiltersCount}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 ml-1" strokeWidth={2.5} />
          ) : (
            <ChevronDown className="w-4 h-4 ml-1" strokeWidth={2.5} />
          )}
        </button>

        {/* Active Filters Summary (when collapsed) */}
        {!isExpanded && activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-1 overflow-x-auto px-2">
            {filters?.search && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 border border-purple-200 rounded-full whitespace-nowrap text-xs font-medium text-purple-700">
                <Search className="w-3 h-3" />
                {filters.search.length > 15 ? filters.search.substring(0, 15) + '...' : filters.search}
              </div>
            )}
            {filters?.category_id && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 border border-blue-200 rounded-full whitespace-nowrap text-xs font-medium text-blue-700">
                <Tag className="w-3 h-3" />
                Category
              </div>
            )}
            {filters?.status !== 'all' && (
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-medium border ${
                filters.status === 'active'
                  ? 'bg-green-100 border-green-200 text-green-700'
                  : 'bg-red-100 border-red-200 text-red-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${filters.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                {filters.status === 'active' ? 'Active' : 'Inactive'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expanded Filter Fields - Single Row */}
      {isExpanded && (
        <div className="px-4 sm:px-5 pb-2 sm:pb-3 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {/* Search Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Search
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Search className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  placeholder="Program name..."
                  value={searchLocal}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 bg-white text-sm font-medium text-gray-900 placeholder:text-gray-400 transition-all duration-200 hover:border-purple-300"
                />
                {searchLocal && (
                  <button
                    onClick={() => {
                      setSearchLocal('');
                      onFilterChange?.({ ...filters, search: '' });
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-gray-400 hover:text-gray-600 text-lg">×</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Category
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-blue-100 rounded-lg pointer-events-none">
                  <Tag className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                </div>
                <select
                  value={filters?.category_id || ''}
                  onChange={(e) => onFilterChange?.({ ...filters, category_id: e.target.value })}
                  className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white text-sm font-medium text-gray-900 appearance-none cursor-pointer transition-all duration-200 hover:border-blue-300"
                  disabled={loading}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
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
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white text-sm font-medium text-gray-900 appearance-none cursor-pointer transition-all duration-200 hover:border-green-300"
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
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 mt-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="flex-shrink-0 p-1.5 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
