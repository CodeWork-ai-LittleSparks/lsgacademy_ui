"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSchoolPrograms,
  getCategories,
} from "@/lib/api/services/programService";
import { toPublicAssetUrl } from "@/lib/utils/urlUtils";
import {
  Search,
  Filter,
  Eye,
  UserPlus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Users,
  Building2,
  Layers,
  Calendar,
  AlertCircle,
  Sparkles,
  Image as ImageIcon
} from "lucide-react";

function CategoryBadge({ category }) {
  const bg = category?.color || "#6F00FF";
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg"
      style={{ 
        backgroundColor: bg + "20", 
        color: bg,
        border: `1px solid ${bg}40`
      }}
      aria-label={`Category ${category?.name || "Unknown"}`}
    >
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: bg }} />
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
      className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-[#6F00FF] transition-all duration-300 bg-white cursor-pointer hover:scale-[1.02]"
      role="button"
      tabIndex={0}
      onClick={() => onView?.(program)}
      onKeyDown={(e) => { if (e.key === "Enter") onView?.(program); }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-[#E9B3FB] to-[#FFF1F1] overflow-hidden">
        {program?.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={toPublicAssetUrl(program.thumbnail_url)} 
            alt={program?.name || "Program"} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            loading="lazy" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="w-12 h-12 mb-2" strokeWidth={1.5} />
            <span className="text-sm font-semibold">No Image</span>
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-sm ${
            active 
              ? 'bg-green-500/90 text-white border border-green-300' 
              : 'bg-gray-500/90 text-white border border-gray-300'
          }`}>
            <div className={`w-2 h-2 rounded-full ${active ? 'bg-white' : 'bg-gray-300'}`} />
            {active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-gray-900 line-clamp-1 flex-1" aria-label="Program name">
              {program?.name}
            </h3>
          </div>
          {program?.category && <CategoryBadge category={program.category} />}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-gray-600 font-semibold">
          <div className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#6F00FF]" strokeWidth={2.5} />
            {program?.total_levels ?? 0} Levels
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#6F00FF]" strokeWidth={2.5} />
            Ages {program?.age_from ?? "-"}-{program?.age_to ?? "-"}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-700 line-clamp-2 font-medium" aria-label="Program description">
            {description}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Users className="w-3.5 h-3.5 text-blue-600" strokeWidth={2.5} />
            </div>
            {studentsCount} Students
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Building2 className="w-3.5 h-3.5 text-purple-600" strokeWidth={2.5} />
            </div>
            {schoolsCount} Schools
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-[#6F00FF] text-[#6F00FF] hover:bg-[#FFF1F1] transition-all"
            onClick={(e) => { e.stopPropagation(); onView?.(program); }}
            aria-label="View Details"
          >
            <Eye className="w-3.5 h-3.5" strokeWidth={2.5} />
            View Details
          </button>
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] text-white hover:from-[#3B0270] hover:to-[#6F00FF] transition-all"
            onClick={(e) => { e.stopPropagation(); onEnroll?.(program); }}
            aria-label="Enroll Students"
          >
            <UserPlus className="w-3.5 h-3.5" strokeWidth={2.5} />
            Enroll
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

  useEffect(() => {
    const t = setTimeout(() => loadPrograms(1), 500);
    return () => clearTimeout(t);
  }, [filters.search, filters.category_id, filters.status]);

  const goBrowse = () => router.push("/Programs/browse");
  const goView = (p) => router.push(`/Programs/${p?.id}`);
  const goEnroll = (p) => router.push(`/Programs/${p?.id}/enroll`);

  const headerCount = useMemo(() => programs.length, [programs]);

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-[#FFF1F1]/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Programs Management</h1>
          <p className="text-sm text-gray-600 font-medium mt-1">Manage and enroll students in programs</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold shadow-md hover:shadow-lg transition-all"
          onClick={goBrowse}
          aria-label="Browse All Programs"
        >
          <Sparkles className="w-4 h-4" strokeWidth={2.5} />
          Browse All Programs
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#E9B3FB] to-[#6F00FF]/30 rounded-xl">
            <BookOpen className="w-5 h-5 text-[#3B0270]" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Assigned Programs</p>
            <p className="text-xl font-bold text-gray-900">{headerCount}</p>
          </div>
        </div>
        <button 
          type="button" 
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#6F00FF] text-[#6F00FF] hover:bg-[#FFF1F1] font-semibold transition-all" 
          onClick={() => loadPrograms(pagination.page)} 
          aria-label="Refresh"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-[#6F00FF]" strokeWidth={2.5} />
          <h2 className="text-base font-bold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2.5} />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium placeholder:text-gray-500 transition-all"
              placeholder="Search programs..."
              aria-label="Search"
            />
          </div>

          {/* Category */}
          <select
            value={filters.category_id}
            onChange={(e) => setFilters((f) => ({ ...f, category_id: e.target.value }))}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all bg-white"
            aria-label="Category Filter"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c?.id} value={c?.id}>{c?.name}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all bg-white"
            aria-label="Status Filter"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Apply Button */}
          <button 
            type="button" 
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold transition-all" 
            onClick={() => loadPrograms(1)} 
            aria-label="Apply Filters"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#E9B3FB] border-t-[#6F00FF] rounded-full animate-spin" />
          </div>
          <p className="text-sm font-semibold text-gray-600 mt-4">Loading programs...</p>
        </div>
      ) : programs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-lg">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-inner mb-4">
              <AlertCircle className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No programs assigned yet</h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md">
              Browse our available programs and assign them to your school to get started with student enrollment
            </p>
            <button 
              type="button" 
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold shadow-md hover:shadow-lg transition-all" 
              onClick={goBrowse}
            >
              <Sparkles className="w-4 h-4" strokeWidth={2.5} />
              Browse Programs
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {programs.map((p) => (
            <ProgramCard key={p?.id} program={p} onView={goView} onEnroll={goEnroll} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination?.total_pages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pagination.page <= 1}
            onClick={() => {
              const prev = Math.max(1, pagination.page - 1);
              setPagination((pg) => ({ ...pg, page: prev }));
              loadPrograms(prev);
            }}
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
            Previous
          </button>
          
          <div className="px-4 py-2 bg-[#E9B3FB] text-[#3B0270] rounded-xl font-bold text-sm">
            Page {pagination.page} of {pagination.total_pages}
          </div>
          
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pagination.page >= pagination.total_pages}
            onClick={() => {
              const next = Math.min(pagination.total_pages, pagination.page + 1);
              setPagination((pg) => ({ ...pg, page: next }));
              loadPrograms(next);
            }}
          >
            Next
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}
