"use client";

import React from "react";

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="h-4 w-40 rounded bg-zinc-200" />
        <div className="h-5 w-20 rounded-full bg-zinc-200" />
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-16 rounded bg-zinc-100" />
        <div className="h-16 rounded bg-zinc-100" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="h-4 w-24 rounded bg-zinc-200" />
        <div className="h-4 w-24 rounded bg-zinc-200" />
      </div>
      <div className="mt-4 h-3 w-32 rounded bg-zinc-100" />
    </div>
  );
}

export default function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}