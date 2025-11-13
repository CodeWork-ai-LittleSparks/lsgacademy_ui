"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getEvaluations, exportEvaluations } from '@/lib/api/services/evaluationService';
import { getTeachers } from '@/lib/api/services/teacherService';
import { getAllPrograms, getProgramLevels } from '@/lib/api/services/programService';
import EmptyState from '@/components/common/EmptyState';
import Loading from '@/components/common/Loading';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import { toPublicAssetUrl } from '@/lib/utils/urlUtils';

function formatDateTime(dtStr) {
  try {
    const d = new Date(dtStr);
    return d.toLocaleString();
  } catch {
    return dtStr;
  }
}

function percentage(a, b) {
  const total = Number(b) || 0;
  const got = Number(a) || 0;
  if (!total) return 0;
  return Math.round((got / total) * 100);
}

function calcAvgStars(summary) {
  const br = summary?.performance_breakdown || {};
  const e = Number(br.excellent || 0);
  const a = Number(br.average || 0);
  const i = Number(br.in_process || br.inprocess || 0);
  const total = e + a + i;
  if (!total) return 0;
  // Simple weighted average: Excellent=5, Average=3, In Process=2
  const avg = (e * 5 + a * 3 + i * 2) / total;
  return Math.round(avg * 10) / 10; // one decimal
}

function perfColor(perf) {
  const p = String(perf || '').toLowerCase();
  if (p.includes('excellent')) return 'bg-green-100 text-green-800 border-green-300';
  if (p.includes('average')) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  return 'bg-blue-100 text-blue-800 border-blue-300';
}

export default function EvaluationsPage() {
  const router = useRouter();
  const [evaluations, setEvaluations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(() => {
    const now = new Date();
    const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fmt = (d) => d.toISOString().slice(0, 10);
    return {
      search: '',
      teacher_id: '',
      program_id: '',
      level_id: '',
      performance: '',
      date_from: fmt(from),
      date_to: fmt(now),
      sort_by: 'evaluated_at',
      sort_order: 'desc',
      page: 1,
      limit: 20,
    };
  });

  const [teacherOptions, setTeacherOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);

  const searchDebounceRef = useRef(null);

  async function loadFiltersMeta() {
    try {
      const [tRes, pRes] = await Promise.all([
        getTeachers({ limit: 100, sort_by: 'name', sort_order: 'asc' }),
        getAllPrograms({ limit: 100, sort_by: 'name', sort_order: 'asc' }),
      ]);
      if (tRes?.success) setTeacherOptions(tRes.data?.teachers || []);
      if (pRes?.success) setProgramOptions(pRes.data?.programs || pRes?.data?.items || []);
    } catch (e) {
      // best-effort; ignore errors
    }
  }

  async function loadLevels(programId) {
    try {
      if (!programId) { setLevelOptions([]); return; }
      const res = await getProgramLevels(programId);
      if (res?.success) setLevelOptions(res?.data?.levels || res?.levels || []);
    } catch {
      setLevelOptions([]);
    }
  }

  async function fetchEvaluations(payload) {
    setLoading(true);
    setError(null);
    try {
      const res = await getEvaluations(payload);
      if (res?.success) {
        const { evaluations: list, pagination: pg, summary: sm } = res.data || {};
        setEvaluations(Array.isArray(list) ? list : []);
        setPagination(pg || { page: payload.page || 1, limit: payload.limit || 20, total: 0, total_pages: 1 });
        setSummary(sm || null);
      } else {
        setError(res?.error || 'Failed to load evaluations');
      }
    } catch (e) {
      setError(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFiltersMeta();
  }, []);

  useEffect(() => {
    // Debounce search field only
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      fetchEvaluations(filters);
    }, 500);
    return () => clearTimeout(searchDebounceRef.current);
  }, [filters.search]);

  useEffect(() => {
    // Non-search filters: fetch immediately
    fetchEvaluations(filters);
  }, [filters.page, filters.limit, filters.teacher_id, filters.program_id, filters.level_id, filters.performance, filters.date_from, filters.date_to, filters.sort_by, filters.sort_order]);

  useEffect(() => {
    loadLevels(filters.program_id);
  }, [filters.program_id]);

  const avgStars = useMemo(() => calcAvgStars(summary), [summary]);
  const perfBreakdown = useMemo(() => summary?.performance_breakdown || {}, [summary]);

  function onClearFilters() {
    const now = new Date();
    const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fmt = (d) => d.toISOString().slice(0, 10);
    setFilters({
      search: '',
      teacher_id: '',
      program_id: '',
      level_id: '',
      performance: '',
      date_from: fmt(from),
      date_to: fmt(now),
      sort_by: 'evaluated_at',
      sort_order: 'desc',
      page: 1,
      limit: 20,
    });
  }

  function onExport() {
    exportEvaluations(filters);
  }

  function SummaryCards() {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-blue-200">
          <div className="text-sm text-gray-500">Total Evaluations</div>
          <div className="text-2xl font-semibold text-blue-700">{summary?.total_evaluations ?? summary?.total ?? pagination?.total ?? 0}</div>
        </Card>
        <Card className="p-4 border-green-200">
          <div className="text-sm text-gray-500">This Week</div>
          <div className="text-2xl font-semibold text-green-700">{summary?.this_week ?? 0}</div>
        </Card>
        <Card className="p-4 border-purple-200">
          <div className="text-sm text-gray-500">This Month</div>
          <div className="text-2xl font-semibold text-purple-700">{summary?.this_month ?? 0}</div>
        </Card>
        <Card className="p-4 border-orange-200">
          <div className="text-sm text-gray-500">Average Performance</div>
          <div className="text-2xl font-semibold text-orange-700">{avgStars} ⭐</div>
        </Card>
      </div>
    );
  }

  function PerformanceBreakdown() {
    const total = Number(perfBreakdown.excellent || 0) + Number(perfBreakdown.average || 0) + Number(perfBreakdown.in_process || perfBreakdown.inprocess || 0);
    const exPct = total ? Math.round((Number(perfBreakdown.excellent || 0) / total) * 100) : 0;
    const avPct = total ? Math.round((Number(perfBreakdown.average || 0) / total) * 100) : 0;
    const inPct = total ? Math.round((Number(perfBreakdown.in_process || perfBreakdown.inprocess || 0) / total) * 100) : 0;
    return (
      <Card className="p-4">
        <div className="text-gray-700 font-medium mb-2">Performance Breakdown</div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm"><span className="text-green-600">Excellent</span><span>{exPct}%</span></div>
            <div className="h-2 bg-gray-200 rounded">
              <div className="h-2 bg-green-500 rounded" style={{ width: `${exPct}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm"><span className="text-yellow-600">Average</span><span>{avPct}%</span></div>
            <div className="h-2 bg-gray-200 rounded">
              <div className="h-2 bg-yellow-500 rounded" style={{ width: `${avPct}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm"><span className="text-blue-600">In Process</span><span>{inPct}%</span></div>
            <div className="h-2 bg-gray-200 rounded">
              <div className="h-2 bg-blue-500 rounded" style={{ width: `${inPct}%` }} />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  function FiltersBar() {
    return (
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder="Search Student (name or roll)"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
          />
          <Dropdown
            value={filters.teacher_id}
            onChange={(e) => setFilters((f) => ({ ...f, teacher_id: e.target.value || '', page: 1 }))}
            options={[
              { value: '', label: 'All Teachers' },
              ...teacherOptions.map((t) => ({
                value: t?.id,
                label: String(t?.user?.full_name || t?.name || t?.email || t?.employee_id || 'Unknown Teacher'),
              })),
            ]}
          />
          <Dropdown
            value={filters.program_id}
            onChange={(e) => setFilters((f) => ({ ...f, program_id: e.target.value || '', level_id: '', page: 1 }))}
            options={[
              { value: '', label: 'All Programs' },
              ...programOptions.map((p) => ({ value: p?.id, label: String(p?.name || p?.title || 'Unnamed Program') })),
            ]}
          />
          <Dropdown
            value={filters.level_id}
            onChange={(e) => setFilters((f) => ({ ...f, level_id: e.target.value || '', page: 1 }))}
            options={[
              { value: '', label: 'All Levels' },
              ...levelOptions.map((l) => ({
                value: l?.id,
                label: String(`${l?.level_number ?? ''} ${l?.level_name ?? l?.name ?? ''}`.trim() || 'Level'),
              })),
            ]}
          />
          <Dropdown
            value={filters.performance}
            onChange={(e) => setFilters((f) => ({ ...f, performance: e.target.value || '', page: 1 }))}
            options={[
              { value: '', label: 'All Performance' },
              { value: 'Excellent', label: 'Excellent' },
              { value: 'Average', label: 'Average' },
              { value: 'In Process of Learning', label: 'In Process of Learning' },
            ]}
          />
          <Input
            type="date"
            value={filters.date_from}
            onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value, page: 1 }))}
          />
          <Input
            type="date"
            value={filters.date_to}
            onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value, page: 1 }))}
          />
        </div>
        <div className="mt-3 flex gap-2">
          <Button onClick={() => fetchEvaluations(filters)} variant="secondary">Refresh</Button>
          <Button onClick={onClearFilters} variant="outline">Clear All Filters</Button>
          <Button onClick={onExport} variant="primary">Export to CSV</Button>
        </div>
      </Card>
    );
  }

  function EvaluationCard({ item }) {
    const s = item?.student || {};
    const p = item?.program || {};
    const l = item?.level || {};
    const t = item?.teacher || {};
    const pct = item?.achievement_percentage ?? percentage(item?.milestones_achieved_count, item?.total_milestones);
    const perf = item?.performance_category || item?.performance || '';
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <img src={toPublicAssetUrl(s?.photo_url)} alt={s?.full_name || 'Student'} className="w-16 h-16 rounded-full object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-gray-900">{s?.full_name}</div>
              <Badge className={`border ${perfColor(perf)}`}>{String(perf)}</Badge>
            </div>
            <div className="text-sm text-gray-600">{s?.grade ? `Grade ${s.grade} • ` : ''}Roll: {s?.roll_number}</div>
            <div className="text-sm text-gray-700">{p?.name} • {l?.level_name || `Level ${l?.level_number ?? ''}`}</div>
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded">
                <div className="h-2 bg-blue-600 rounded" style={{ width: `${pct || 0}%` }} />
              </div>
              <div className="text-xs text-gray-500 mt-1">{item?.milestones_achieved_count}/{item?.total_milestones} milestones ({pct || 0}%)</div>
            </div>
            <div className="text-sm text-gray-600 mt-1">by {t?.full_name} • {formatDateTime(item?.evaluated_at)}</div>
            <div className="text-sm text-gray-600 mt-1">📷 {item?.photo_count ?? item?.photos_count ?? 0} photos</div>
          </div>
          <div>
            <Button onClick={() => router.push(`/evaluations/${item?.id}`)} variant="primary">View Details</Button>
          </div>
        </div>
      </Card>
    );
  }

  function ListSection() {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Card key={idx} className="p-4">
              <div className="animate-pulse flex gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-2 bg-gray-200 rounded w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <EmptyState
          title="Failed to load evaluations"
          message={error}
          actionLabel="Retry"
          onAction={() => fetchEvaluations(filters)}
        />
      );
    }

    if (!evaluations?.length) {
      return (
        <EmptyState
          title="No evaluations match your filters"
          message="Try adjusting filters or clearing them to see more results."
          actionLabel="Clear Filters"
          onAction={onClearFilters}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 gap-3">
        {evaluations.map((ev) => (
          <EvaluationCard key={ev.id} item={ev} />
        ))}
      </div>
    );
  }

  function PaginationBar() {
    const page = pagination?.page || filters.page || 1;
    const totalPages = pagination?.total_pages || 1;
    return (
      <div className="flex items-center justify-center gap-3 mt-4">
        <Button
          disabled={page <= 1}
          onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, page - 1) }))}
          variant="outline"
        >
          {'< Previous'}
        </Button>
        <div className="text-sm text-gray-700">Page {page} of {totalPages}</div>
        <Button
          disabled={page >= totalPages}
          onClick={() => setFilters((f) => ({ ...f, page: Math.min(totalPages, page + 1) }))}
          variant="outline"
        >
          {'Next >'}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Evaluations Management</h1>
      </div>

      {/* <SummaryCards />
      <PerformanceBreakdown /> */}
      <FiltersBar />

      <div>
        <div className="text-gray-700 font-medium mb-2">Evaluations List ({pagination?.total_items ?? evaluations?.length ?? 0})</div>
        <ListSection />
        <PaginationBar />
      </div>
    </div>
  );
}