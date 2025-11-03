"use client";

import React from "react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="w-full rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-sm text-red-700">{message || "Failed to load schools."}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 inline-flex items-center rounded-lg bg-[#6F00FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5a00d1]"
        >
          Retry
        </button>
      )}
    </div>
  );
}