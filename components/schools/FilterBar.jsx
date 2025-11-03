"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";

/**
 * FilterBar component provides search, filtering, and sorting controls
 * @param {string} search - Current search term
 * @param {string} location - Current location filter
 * @param {string} status - Current status filter
 * @param {string} sortBy - Current sort field
 * @param {string} sortOrder - Current sort order (asc/desc)
 * @param {Array} locations - Available locations for filtering
 * @param {Function} onChange - Callback for filter changes
 */
export default function FilterBar({
  search,
  location,
  status,
  sortBy,
  sortOrder,
  locations,
  onChange,
}) {
  const [searchTerm, setSearchTerm] = useState(search);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== search) {
        onChange({ search: searchTerm });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, search, onChange]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationChange = (e) => {
    onChange({ location: e.target.value });
  };

  const handleStatusChange = (e) => {
    onChange({ status: e.target.value });
  };

  const handleSortByChange = (e) => {
    onChange({ sortBy: e.target.value });
  };

  const handleSortOrderToggle = () => {
    onChange({ sortOrder: sortOrder === "asc" ? "desc" : "asc" });
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "created_at", label: "Created Date" },
    { value: "students_count", label: "Student Count" },
  ];

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search schools..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={handleSortByChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleSortOrderToggle}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4 text-gray-600" />
            ) : (
              <SortDesc className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Location Filter */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={location}
              onChange={handleLocationChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex-1">
          <select
            value={status}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}