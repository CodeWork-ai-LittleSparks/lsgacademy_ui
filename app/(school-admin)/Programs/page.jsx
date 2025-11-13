"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSchoolPrograms,
  getCategories,
} from "@/lib/api/services/programService";
import { toPublicAssetUrl } from "@/lib/utils/urlutils";

function CategoryBadge({ category }) {
  const bg = category?.color || "#e5e7eb"; // default gray
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded"
      style={{ backgroundColor: bg + "20", color: bg }}
      aria-label={`Category ${category?.name || "Unknown"}`}
    >
      {category?.name || "Uncategorized"}
    </span>
  );
}

function ProgramCard({ program, onView, onEnroll }) {
  const studentsCount = Number(program?.total_students) || 0;
  const schoolsCount = Number(program?.enrolled_schools) || 0;
  const active = program?.is_active === true;
  const description = (program?.description || "").trim();
  return (
    <div
      className="border rounded-lg overflow-hidden hover:shadow transition cursor-pointer bg-white"
      role="button"
      tabIndex={0}
      onClick={() => onView?.(program)}
      onKeyDown={(e) => { if (e.key === "Enter") onView?.(program); }}
    >
      <div className="aspect-video bg-gray-100">
        {program?.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={toPublicAssetUrl(program.thumbnail_url)} alt={program?.name || "Program"} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm md:text-base" aria-label="Program name">{program?.name}</h3>
            <span className={`text-[8px] px-2 py-0.5 rounded border ${active ? 'border-green-200 text-green-700 bg-green-50' : 'border-red-200 text-red-700 bg-red-50'}`}>{active ? 'Active' : 'Inactive'}</span>
          </div>
          {program?.category && <CategoryBadge category={program.category} />}
        </div>
        <div className="text-xs text-gray-600" aria-label="Levels and age range">
          {program?.total_levels ?? 0} Levels • Ages {program?.age_from ?? "-"}-{program?.age_to ?? "-"}
        </div>
        {description && (
          <div className="text-xs text-gray-700 line-clamp-2" aria-label="Program description">{description}</div>
        )}
        <hr />
        <div className="flex items-center justify-between text-xs">
          <span>{studentsCount} Students</span>
          <span>{schoolsCount} Schools</span>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            className="px-2 py-1 text-xs rounded border"
            onClick={(e) => { e.stopPropagation(); onView?.(program); }}
            aria-label="View Details"
          >
            View Details
          </button>
          <button
            type="button"
            className="px-2 py-1 text-xs rounded bg-blue-600 text-white"
            onClick={(e) => { e.stopPropagation(); onEnroll?.(program); }}
            aria-label="Enroll Students"
          >
            Enroll Students
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, total_pages: 1 });
  const [filters, setFilters] = useState({ search: "", category_id: "", status: "all" });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getCategories();
      if (res?.success) setCategories(res.data || []);
    })();
  }, []);

  const loadPrograms = async (page = pagination.page) => {
    setLoading(true);
    const res = await getSchoolPrograms({
      page,
      limit: 12,
      search: filters.search?.trim() || undefined,
      category_id: filters.category_id || undefined,
      status: filters.status === "all" ? undefined : filters.status,
    });
    if (res?.success) {
      const list = res.data?.programs || [];
      // Show only programs that are assigned to the school
      const assignedList = list.filter((p) => Boolean(p?.isAssigned));
      const meta = res.data?.pagination || {};
      setPrograms(assignedList);
      setPagination({
        page: meta.page ?? page,
        limit: meta.limit ?? 12,
        total: meta.total ?? list.length,
        total_pages: meta.total_pages ?? Math.max(1, Math.ceil((meta.total ?? list.length) / (meta.limit ?? 12))),
      });
    }
    setLoading(false);
  };

  useEffect(() => { loadPrograms(1); }, []);

  // Debounced filter updates
  useEffect(() => {
    const t = setTimeout(() => loadPrograms(1), 500);
    return () => clearTimeout(t);
  }, [filters.search, filters.category_id, filters.status]);

  const goBrowse = () => router.push("/Programs/browse");
  const goView = (p) => router.push(`/Programs/${p?.id}`);
  const goEnroll = (p) => router.push(`/Programs/${p?.id}/enroll`);

  const headerCount = useMemo(() => programs.length, [programs]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Programs Management</h1>
        <button
          type="button"
          className="px-3 py-2 rounded border"
          onClick={goBrowse}
          aria-label="Browse All Programs"
        >
          Browse All Programs
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Programs Assigned to Your School ({headerCount})</div>
        <button type="button" className="text-sm text-blue-600" onClick={() => loadPrograms(pagination.page)} aria-label="Refresh">
          ↻ Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="border rounded px-2 py-2 text-sm"
          placeholder="Search programs..."
          aria-label="Search"
        />
        <select
          value={filters.category_id}
          onChange={(e) => setFilters((f) => ({ ...f, category_id: e.target.value }))}
          className="border rounded px-2 py-2 text-sm"
          aria-label="Category Filter"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c?.id} value={c?.id}>{c?.name}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          className="border rounded px-2 py-2 text-sm"
          aria-label="Status Filter"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="flex items-center">
          <button type="button" className="px-3 py-2 rounded border w-full" onClick={() => loadPrograms(1)} aria-label="Apply Filters">Apply</button>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading programs...</div>
      ) : programs.length === 0 ? (
        <div className="border rounded p-8 text-center space-y-2">
          <div className="font-medium">No programs assigned yet</div>
          <div className="text-sm text-gray-600">Browse available programs to get started</div>
          <button type="button" className="px-4 py-2 rounded bg-blue-600 text-white" onClick={goBrowse}>Browse Programs</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {programs.map((p) => (
            <ProgramCard key={p?.id} program={p} onView={goView} onEnroll={goEnroll} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination?.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            type="button"
            className="px-3 py-2 rounded border"
            disabled={pagination.page <= 1}
            onClick={() => {
              const prev = Math.max(1, pagination.page - 1);
              setPagination((pg) => ({ ...pg, page: prev }));
              loadPrograms(prev);
            }}
          >
            ◀ Previous
          </button>
          <span className="text-sm">Page {pagination.page} of {pagination.total_pages}</span>
          <button
            type="button"
            className="px-3 py-2 rounded border"
            disabled={pagination.page >= pagination.total_pages}
            onClick={() => {
              const next = Math.min(pagination.total_pages, pagination.page + 1);
              setPagination((pg) => ({ ...pg, page: next }));
              loadPrograms(next);
            }}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}