"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toPublicAssetUrl } from "@/lib/utils/urlUtils";
import {
  getAllPrograms,
  getCategories,
  assignProgramToSchool,
  getProgramById,
  getProgramLevels,
} from "@/lib/api/services/programService";
import {
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Plus,
  Check,
  X,
  BookOpen,
  Users,
  Building2,
  Layers,
  Calendar,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  Info
} from "lucide-react";

function ConfirmModal({ open, program, onClose, onConfirm, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative overflow-hidden p-6 border-b border-gray-200 bg-gradient-to-r from-[#FFF1F1] to-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E9B3FB] to-[#6F00FF] rounded-full blur-3xl opacity-20" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#E9B3FB] to-[#6F00FF]/30 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-[#6F00FF]" strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Confirm Assignment</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm font-bold text-blue-900 mb-2">
              Assign "<span className="text-[#6F00FF]">{program?.name}</span>" to School?
            </p>
            <p className="text-sm text-blue-700">
              This program will be available for your teachers and students.
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-[#FFF1F1] to-white border border-[#E9B3FB] rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              <p className="text-sm font-bold text-gray-900">Next Steps:</p>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#6F00FF] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>Assign teachers to this program</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#6F00FF] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span>Enroll students</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button 
            type="button" 
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 hover:bg-white text-gray-900 font-bold transition-all" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold transition-all disabled:opacity-50" 
            onClick={onConfirm} 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                Assigning...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Assign Program
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ open, program, onClose, onAssign }) {
  const [levels, setLevels] = useState([]);
  const [levelsLoading, setLevelsLoading] = useState(false);
  const [levelsError, setLevelsError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadLevels() {
      if (!open || !program?.id) return;
      setLevelsLoading(true);
      setLevelsError(null);
      try {
        const res = await getProgramLevels(program.id);
        if (!isMounted) return;
        if (res?.success) {
          const list = Array.isArray(res.data?.levels) ? res.data.levels : [];
          const sorted = [...list].sort((a, b) => (Number(a?.level_number) || 0) - (Number(b?.level_number) || 0));
          setLevels(sorted);
        } else {
          setLevelsError(res?.error || "Failed to load levels");
        }
      } catch (e) {
        if (isMounted) setLevelsError(e.message);
      } finally {
        if (isMounted) setLevelsLoading(false);
      }
    }
    loadLevels();
    return () => { isMounted = false; };
  }, [open, program?.id]);

  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#E9B3FB] to-[#6F00FF]/30 rounded-xl">
              <Eye className="w-5 h-5 text-[#6F00FF]" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{program?.name}</h2>
          </div>
          <button 
            type="button" 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
            onClick={onClose}
          >
            <X className="w-5 h-5 text-gray-500" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Thumbnail */}
          <div className="aspect-video bg-gradient-to-br from-[#E9B3FB] to-[#FFF1F1] rounded-2xl overflow-hidden">
            {program?.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={toPublicAssetUrl(program.thumbnail_url)} 
                alt="Program Thumbnail" 
                className="w-full h-full object-cover" 
                loading="lazy" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-400 mb-2" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-gray-400">No Image</span>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-lg">
              <Layers className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
              <span className="text-sm font-bold text-blue-900">{program?.total_levels ?? 0} Levels</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 rounded-lg">
              <Calendar className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
              <span className="text-sm font-bold text-purple-900">Ages {program?.age_from ?? "-"}-{program?.age_to ?? "-"}</span>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-sm text-gray-700 font-medium whitespace-pre-line">
              {program?.description || "No description available"}
            </p>
          </div>

          {/* Levels */}
          <div className="border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-[#6F00FF]" strokeWidth={2.5} />
              <h3 className="text-base font-bold text-gray-900">Program Levels</h3>
            </div>
            
            {levelsLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                Loading levels...
              </div>
            ) : levelsError ? (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <p className="text-sm text-red-700 font-medium">{levelsError}</p>
              </div>
            ) : levels.length === 0 ? (
              <p className="text-sm text-gray-600">No levels available</p>
            ) : (
              <ul className="space-y-2">
                {levels.map((l, idx) => (
                  <li 
                    key={l?.id || l?.level_id || `${l?.level_number}-${l?.level_name}`}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#FFF1F1] to-white border border-[#E9B3FB] rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#6F00FF] to-[#3B0270] text-white rounded-lg font-bold text-sm">
                      {l?.level_number ?? l?.order_index ?? idx + 1}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {l?.level_name ?? l?.name ?? "Unnamed"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button 
            type="button" 
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold shadow-md hover:shadow-lg transition-all" 
            onClick={() => onAssign?.(program)}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Assign to School
          </button>
        </div>
      </div>
    </div>
  );
}

function ProgramCard({ program, assigned, onPreview, onAssign, onView }) {
  return (
    <div className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#6F00FF] transition-all duration-300 bg-white hover:scale-[1.02]">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-[#E9B3FB] to-[#FFF1F1]">
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
        {assigned && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500 text-white backdrop-blur-sm border border-green-400">
              <Check className="w-3 h-3" strokeWidth={3} />
              Assigned
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-base text-gray-900 line-clamp-1">{program?.name}</h3>
        
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-600">
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg">
            {program?.category?.name || "Uncategorized"}
          </span>
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#6F00FF]" strokeWidth={2.5} />
            {program?.total_levels ?? 0} Levels
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#6F00FF]" strokeWidth={2.5} />
            Ages {program?.age_from ?? "-"}-{program?.age_to ?? "-"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
            <Building2 className="w-3.5 h-3.5 text-blue-600" strokeWidth={2.5} />
            {program?.enrolled_schools ?? 0} Schools
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
            <Users className="w-3.5 h-3.5 text-green-600" strokeWidth={2.5} />
            {program?.total_students ?? 0} Students
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {!assigned ? (
            <>
              <button 
                type="button" 
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-[#6F00FF] text-[#6F00FF] hover:bg-[#FFF1F1] transition-all" 
                onClick={() => onPreview?.(program)}
              >
                <Eye className="w-3.5 h-3.5" strokeWidth={2.5} />
                Preview
              </button>
              <button 
                type="button" 
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] text-white hover:from-[#3B0270] hover:to-[#6F00FF] transition-all" 
                onClick={() => onAssign?.(program)}
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                Assign
              </button>
            </>
          ) : (
            <button 
              type="button" 
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-900 transition-all" 
              onClick={() => onView?.(program)}
            >
              <Eye className="w-3.5 h-3.5" strokeWidth={2.5} />
              View Program
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BrowseProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, total_pages: 1 });
  const [filters, setFilters] = useState({ search: "", category_id: "", age_range: "", status: "active" });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getCategories();
      if (res?.success) setCategories(res.data || []);
    })();
  }, []);

  useEffect(() => {
    loadPrograms(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => loadPrograms(1), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.category_id, filters.status]);

  const loadPrograms = async (page = pagination.page) => {
    setLoading(true);
    const res = await getAllPrograms({
      page,
      limit: 12,
      search: filters.search?.trim() || undefined,
      category_id: filters.category_id || undefined,
      status: filters.status || "active",
    });
    if (res?.success) {
      const list = res.data?.programs || [];
      const meta = res.data?.pagination || {};
      setPrograms(list);
      setPagination({
        page: meta.page ?? page,
        limit: meta.limit ?? 12,
        total: meta.total ?? list.length,
        total_pages: meta.total_pages ?? Math.max(1, Math.ceil((meta.total ?? list.length) / (meta.limit ?? 12))),
      });
    }
    setLoading(false);
  };

  const onPreview = async (p) => {
    setSelectedProgram(p);
    const res = await getProgramById(p?.id);
    if (res?.success) setSelectedProgram(res.data);
    setPreviewOpen(true);
  };

  const onAssign = (p) => {
    setSelectedProgram(p);
    setConfirmOpen(true);
  };

  const confirmAssign = async () => {
    if (!selectedProgram?.id) return;
    setAssigning(true);
    const res = await assignProgramToSchool(selectedProgram.id);
    setAssigning(false);
    setConfirmOpen(false);
    if (res?.success) {
      setPrograms((list) => list.map((item) => item.id === selectedProgram.id ? { ...item, isAssigned: true } : item));
      if (typeof window !== "undefined") window.alert(res.message || "Program assigned successfully");
    } else if (typeof window !== "undefined") {
      window.alert(res?.error || "Failed to assign program");
    }
  };

  const goBack = () => router.push("/Programs");
  const goView = (p) => router.push(`/Programs/${p?.id}`);

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-[#FFF1F1]/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 hover:bg-white text-gray-900 font-semibold transition-all" 
            onClick={goBack}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Browse Programs</h1>
            <p className="text-sm text-gray-600 font-medium mt-1">Discover and assign programs to your school</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-[#6F00FF]" strokeWidth={2.5} />
          <h2 className="text-base font-bold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all bg-white"
            aria-label="Status Filter"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="all">All</option>
          </select>
          <button 
            type="button" 
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#6F00FF] text-[#6F00FF] hover:bg-[#FFF1F1] font-bold transition-all" 
            onClick={() => loadPrograms(1)} 
            aria-label="Refresh"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
            Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 text-[#6F00FF] animate-spin mb-4" strokeWidth={2.5} />
          <p className="text-sm font-semibold text-gray-600">Loading programs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {programs.map((p) => (
            <ProgramCard 
              key={p?.id} 
              program={p} 
              assigned={Boolean(p?.isAssigned)} 
              onPreview={onPreview} 
              onAssign={onAssign} 
              onView={goView} 
            />
          ))}
        </div>
      )}

      <ConfirmModal 
        open={confirmOpen} 
        program={selectedProgram} 
        onClose={() => setConfirmOpen(false)} 
        onConfirm={confirmAssign} 
        loading={assigning} 
      />
      <PreviewModal 
        open={previewOpen} 
        program={selectedProgram} 
        onClose={() => setPreviewOpen(false)} 
        onAssign={onAssign} 
      />
    </div>
  );
}
