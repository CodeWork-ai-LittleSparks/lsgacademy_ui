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
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  User,
  GraduationCap,
  Calendar,
  Camera,
  TrendingUp,
  Award,
  Star,
  Eye,
  BookOpen,
  Layers,
  AlertCircle,
  Loader2
} from 'lucide-react';

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
  const avg = (e * 5 + a * 3 + i * 2) / total;
  return Math.round(avg * 10) / 10;
}

function perfColor(perf) {
  const p = String(perf || '').toLowerCase();
  if (p.includes('excellent')) return 'bg-green-100 text-green-700 border-green-300';
  if (p.includes('average')) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  return 'bg-blue-100 text-blue-700 border-blue-300';
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
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      fetchEvaluations(filters);
    }, 500);
    return () => clearTimeout(searchDebounceRef.current);
  }, [filters.search]);

  useEffect(() => {
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
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl p-5 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <ClipboardCheck className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
            </div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Total Evaluations</div>
          </div>
          <div className="text-3xl font-bold text-blue-700">{summary?.total_evaluations ?? summary?.total ?? pagination?.total ?? 0}</div>
        </Card>
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl p-5 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-xl">
              <TrendingUp className="w-5 h-5 text-green-600" strokeWidth={2.5} />
            </div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">This Week</div>
          </div>
          <div className="text-3xl font-bold text-green-700">{summary?.this_week ?? 0}</div>
        </Card>
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl p-5 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Calendar className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
            </div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">This Month</div>
          </div>
          <div className="text-3xl font-bold text-purple-700">{summary?.this_month ?? 0}</div>
        </Card>
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl p-5 hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-[#E9B3FB] to-[#6F00FF]/30 rounded-xl">
              <Award className="w-5 h-5 text-[#6F00FF]" strokeWidth={2.5} />
            </div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wide">Avg Performance</div>
          </div>
          <div className="text-3xl font-bold text-[#6F00FF] flex items-center gap-2">
            {avgStars} <Star className="w-6 h-6 fill-[#6F00FF]" strokeWidth={2.5} />
          </div>
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
      <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
            <TrendingUp className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Performance Breakdown</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-green-600">Excellent</span>
              <span className="font-bold text-gray-900">{exPct}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500" style={{ width: `${exPct}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-yellow-600">Average</span>
              <span className="font-bold text-gray-900">{avPct}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-500" style={{ width: `${avPct}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-blue-600">In Process</span>
              <span className="font-bold text-gray-900">{inPct}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${inPct}%` }} />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  function FiltersBar() {
    return (
      <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200">
          <Filter className="w-5 h-5 text-[#6F00FF]" strokeWidth={2.5} />
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2.5} />
            <Input
              placeholder="Search Student (name or roll)..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
              className="pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium placeholder:text-gray-500 transition-all"
            />
          </div>
          
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
            className="px-4 py-3 border border-gray-300 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all bg-white"
          />
          
          <Dropdown
            value={filters.program_id}
            onChange={(e) => setFilters((f) => ({ ...f, program_id: e.target.value || '', level_id: '', page: 1 }))}
            options={[
              { value: '', label: 'All Programs' },
              ...programOptions.map((p) => ({ value: p?.id, label: String(p?.name || p?.title || 'Unnamed Program') })),
            ]}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all bg-white"
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
            className="px-4 py-3 border border-gray-300 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all bg-white"
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
            className="px-4 py-3 border border-gray-300 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all bg-white"
          />
          
          <Input
            type="date"
            value={filters.date_from}
            onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value, page: 1 }))}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all"
          />
          
          <Input
            type="date"
            value={filters.date_to}
            onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value, page: 1 }))}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all"
          />
        </div>
        
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => fetchEvaluations(filters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#6F00FF] text-[#6F00FF] hover:bg-[#FFF1F1] font-semibold transition-all"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
            Refresh
          </button>
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold transition-all"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            Clear Filters
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} />
            Export CSV
          </button>
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
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-xl rounded-2xl p-5 transition-all duration-300 hover:border-[#6F00FF]">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="relative flex-shrink-0">
            <img 
              src={toPublicAssetUrl(s?.photo_url)} 
              alt={s?.full_name || 'Student'} 
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E9B3FB] shadow-md" 
            />
            <div className="absolute -bottom-2 -right-2 p-1.5 bg-gradient-to-br from-[#6F00FF] to-[#3B0270] rounded-lg shadow-md">
              <GraduationCap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="font-bold text-gray-900 text-lg">{s?.full_name}</h3>
              <Badge className={`border font-bold ${perfColor(perf)}`}>{String(perf)}</Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 font-medium mb-3">
              {s?.grade && <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" strokeWidth={2.5} />Grade {s.grade}</span>}
              <span>•</span>
              <span>Roll: {s?.roll_number}</span>
            </div>
            
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700">
              <BookOpen className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              {p?.name}
              <span>•</span>
              <Layers className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              {l?.level_name || `Level ${l?.level_number ?? ''}`}
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                <span>Milestones Progress</span>
                <span>{pct || 0}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-3 bg-gradient-to-r from-[#6F00FF] to-[#3B0270] rounded-full transition-all duration-500" 
                  style={{ width: `${pct || 0}%` }} 
                />
              </div>
              <div className="text-xs text-gray-600 mt-1 font-medium">
                {item?.milestones_achieved_count}/{item?.total_milestones} completed
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 font-medium">
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#6F00FF]" strokeWidth={2.5} />
                by {t?.full_name}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#6F00FF]" strokeWidth={2.5} />
                {formatDateTime(item?.evaluated_at)}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-[#6F00FF]" strokeWidth={2.5} />
                {item?.photo_count ?? item?.photos_count ?? 0} photos
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => router.push(`/evaluations/${item?.id}`)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Eye className="w-4 h-4" strokeWidth={2.5} />
              View Details
            </button>
          </div>
        </div>
      </Card>
    );
  }

  function ListSection() {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 text-[#6F00FF] animate-spin mb-4" strokeWidth={2.5} />
          <p className="text-sm font-semibold text-gray-600">Loading evaluations...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-start gap-3 p-6 rounded-2xl border border-red-200 bg-red-50">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <div>
            <p className="text-base font-bold text-red-900 mb-1">Failed to load evaluations</p>
            <p className="text-sm font-semibold text-red-700 mb-3">{error}</p>
            <button
              onClick={() => fetchEvaluations(filters)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (!evaluations?.length) {
      return (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-2xl">
          <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-inner mb-4">
            <ClipboardCheck className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No evaluations found</h3>
          <p className="text-sm text-gray-600 mb-6 text-center max-w-md">
            Try adjusting your filters or clearing them to see more results
          </p>
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold shadow-md hover:shadow-lg transition-all"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            Clear Filters
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
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
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, page - 1) }))}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          Previous
        </button>
        <div className="px-4 py-2 bg-[#E9B3FB] text-[#3B0270] rounded-xl font-bold text-sm">
          Page {page} of {totalPages}
        </div>
        <button
          disabled={page >= totalPages}
          onClick={() => setFilters((f) => ({ ...f, page: Math.min(totalPages, page + 1) }))}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-[#FFF1F1]/20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-[#E9B3FB] to-[#6F00FF]/30 rounded-xl shadow-sm">
          <ClipboardCheck className="w-6 h-6 text-[#6F00FF]" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Evaluations Management</h1>
          <p className="text-sm text-gray-600 font-medium mt-0.5">Track and manage student evaluations</p>
        </div>
      </div>

      {/* <SummaryCards />
      <PerformanceBreakdown /> */}
      
      <FiltersBar />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Evaluations List</h2>
          <div className="px-3 py-1.5 bg-[#E9B3FB] text-[#3B0270] rounded-lg font-bold text-sm">
            {pagination?.total_items ?? evaluations?.length ?? 0} total
          </div>
        </div>
        <ListSection />
        <PaginationBar />
      </div>
    </div>
  );
}
