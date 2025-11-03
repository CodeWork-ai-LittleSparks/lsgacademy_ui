"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination component for navigating through pages
 * @param {number} page - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Callback for page changes
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center space-x-1 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          page === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((pageNum, index) => {
          if (pageNum === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-sm text-gray-500"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                page === pageNum
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          page === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
}