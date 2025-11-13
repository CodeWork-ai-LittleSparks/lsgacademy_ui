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

function ConfirmModal({ open, program, onClose, onConfirm, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-4 space-y-3">
        <div className="font-semibold">Assign "{program?.name}" to School?</div>
        <div className="text-sm text-gray-600">
          This program will be available for your teachers and students.
          <div className="mt-2">Next steps:</div>
          <ul className="list-disc list-inside">
            <li>Assign teachers to this program</li>
            <li>Enroll students</li>
          </ul>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button type="button" className="px-3 py-2 rounded border" onClick={onClose}>Cancel</button>
          <button type="button" className="px-3 py-2 rounded bg-blue-600 text-white" onClick={onConfirm} disabled={loading}>
            {loading ? "Assigning..." : "Assign Program"}
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
          // Sort by level_number when available
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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center" role="dialog" aria-modal>
      <div className="bg-white rounded-lg w-full max-w-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{program?.name}</div>
          <button type="button" className="px-3 py-2 rounded border" onClick={onClose}>Close</button>
        </div>
        <div className="aspect-video bg-gray-100 rounded">
          {program?.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={toPublicAssetUrl(program.thumbnail_url)} alt="Program Thumbnail" className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
        </div>
        <div className="text-sm text-gray-700 whitespace-pre-line">{program?.description}</div>
        <div className="text-xs text-gray-600">{program?.total_levels ?? 0} Levels • Ages {program?.age_from ?? "-"}-{program?.age_to ?? "-"}</div>

        {/* Levels details */}
        <div className="border rounded p-3 space-y-2">
          <div className="font-semibold text-sm">Levels</div>
          {levelsLoading ? (
            <div className="text-xs text-gray-600">Loading levels...</div>
          ) : levelsError ? (
            <div className="text-xs text-red-700">{levelsError}</div>
          ) : levels.length === 0 ? (
            <div className="text-xs text-gray-600">No levels available</div>
          ) : (
            <ul className="text-xs text-gray-700 space-y-1">
              {levels.map((l) => (
                <li key={l?.id || l?.level_id || `${l?.level_number}-${l?.level_name}`}>
                  Level {l?.level_number ?? l?.order_index ?? "?"}: {l?.level_name ?? l?.name ?? "Unnamed"}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-end">
          <button type="button" className="px-3 py-2 rounded bg-blue-600 text-white" onClick={() => onAssign?.(program)}>Assign to School</button>
        </div>
      </div>
    </div>
  );
}

function ProgramCard({ program, assigned, onPreview, onAssign, onView }) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow transition bg-white">
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
          <div className="font-semibold text-sm md:text-base">{program?.name}</div>
          {assigned && (
            <span className="inline-flex items-center gap-1 text-xs text-green-700">
              ✅ Assigned
            </span>
          )}
        </div>
        <div className="text-xs text-gray-600">
          {program?.category?.name || "Uncategorized"} • {program?.total_levels ?? 0} Levels • Ages {program?.age_from ?? "-"}-{program?.age_to ?? "-"}
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-600">
          <span>{program?.enrolled_schools ?? 0} Schools</span>
          <span>{program?.total_students ?? 0} Students</span>
        </div>
        <div className="flex gap-2">
          {!assigned ? (
            <>
              <button type="button" className="px-2 py-1 text-xs rounded border" onClick={() => onPreview?.(program)}>Preview</button>
              <button type="button" className="px-2 py-1 text-xs rounded bg-blue-600 text-white" onClick={() => onAssign?.(program)}>Assign</button>
            </>
          ) : (
            <button type="button" className="px-2 py-1 text-xs rounded border" onClick={() => onView?.(program)}>View</button>
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
  // Use API-provided program.isAssigned; no separate assigned set is needed

  useEffect(() => {
    (async () => {
      const res = await getCategories();
      if (res?.success) setCategories(res.data || []);
    })();
  }, []);

  // Initial load: fetch all active programs
  useEffect(() => {
    loadPrograms(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced filter changes: reload programs only
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

  // Remove duplicate effects; debounced filters handled above

  const onPreview = async (p) => {
    setSelectedProgram(p);
    // Fetch richer details if needed
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
      // Optimistic UI: mark as assigned via isAssigned flag
      setPrograms((list) => list.map((item) => item.id === selectedProgram.id ? { ...item, isAssigned: true } : item));
      // Optional success feedback
      if (typeof window !== "undefined") window.alert(res.message || "Program assigned successfully");
    } else if (typeof window !== "undefined") {
      window.alert(res?.error || "Failed to assign program");
    }
  };

  const goBack = () => router.push("/Programs");
  const goView = (p) => router.push(`/Programs/${p?.id}`);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <button type="button" className="px-3 py-2 rounded border" onClick={goBack}>◀ Back</button>
        <h1 className="text-xl md:text-2xl font-semibold">Browse Available Programs</h1>
      </div>
      <div className="text-sm text-gray-600">Discover programs created by Super Admin and assign them to your school</div>

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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="all">All</option>
        </select>
        <div className="flex items-center">
          <button type="button" className="px-3 py-2 rounded border w-full" onClick={() => loadPrograms(1)} aria-label="Refresh">↻ Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading programs...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((p) => (
            <ProgramCard key={p?.id} program={p} assigned={Boolean(p?.isAssigned)} onPreview={onPreview} onAssign={onAssign} onView={goView} />
          ))}
        </div>
      )}

      <ConfirmModal open={confirmOpen} program={selectedProgram} onClose={() => setConfirmOpen(false)} onConfirm={confirmAssign} loading={assigning} />
      <PreviewModal open={previewOpen} program={selectedProgram} onClose={() => setPreviewOpen(false)} onAssign={onAssign} />
    </div>
  );
}