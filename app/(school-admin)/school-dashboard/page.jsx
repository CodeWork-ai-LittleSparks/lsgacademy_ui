"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dashboardService, { getSchoolAdminDashboard } from "@/lib/api/services/dashboardService";
import DateRangeSelector from "@/components/dashboard/DateRangeSelector";
import SummaryCard from "@/components/dashboard/SummaryCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import RecentEvaluations from "@/components/dashboard/RecentEvaluations";
import Loading from "@/components/common/Loading";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ROUTES } from "@/lib/constants/config";
import { MapPin, Users, UserCog, BookOpen, CheckCircle, Plus, FileText, Star, CalendarDays, Lightbulb, User } from "lucide-react";

function defaultDateRange() { return { from: null, to: null }; }

export default function SchoolAdminDashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState(defaultDateRange());
  const [lastUpdated, setLastUpdated] = useState(null);
  const [responseMs, setResponseMs] = useState(null);

  const loadDashboard = useCallback(async (opts = {}) => {
    setError(null);
    if (opts.overlay !== true) setLoading(true);
    try {
      const from = dateRange?.from || null;
      const to = dateRange?.to || null;
      const res = await getSchoolAdminDashboard(from, to);
      setDashboardData(res.data);
      setMetadata(res.metadata || null);
      setLastUpdated(res?.metadata?.generated_at ? new Date(res.metadata.generated_at).toISOString() : new Date().toISOString());
      setResponseMs(res?.metadata?.response_time_ms ?? res?.durationMs ?? null);
    } catch (err) {
      console.error('School dashboard load failed:', err);
      setError(err?.message || 'Unable to load dashboard. Check connection.');
    } finally {
      setLoading(false);
    }
  }, [dateRange.from, dateRange.to]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // Keep URL query in sync with date range
  useEffect(() => {
    const params = new URLSearchParams();
    if (dateRange.from) params.set('from', dateRange.from);
    if (dateRange.to) params.set('to', dateRange.to);
    const qs = params.toString();
    router.replace(qs ? `/school-dashboard?${qs}` : `/school-dashboard`);
  }, [dateRange.from, dateRange.to, router]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const id = setInterval(() => { loadDashboard({ overlay: true }); }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [loadDashboard]);

  const school = dashboardData?.school_info || {};
  const summary = dashboardData?.summary || {};
  const perfDist = dashboardData?.performance_distribution || {};
  const programProgress = Array.isArray(dashboardData?.program_progress) ? dashboardData.program_progress : [];
  const teacherSummary = Array.isArray(dashboardData?.teacher_summary) ? dashboardData.teacher_summary : [];
  const studentsAttention = Array.isArray(dashboardData?.students_needing_attention) ? dashboardData.students_needing_attention : [];
  const recentEvaluations = Array.isArray(dashboardData?.recent_evaluations) ? dashboardData.recent_evaluations : [];

  const studentsByGrade = summary?.students_by_grade || {};
  const allGrades = useMemo(() => Array.from({ length: 12 }, (_, i) => String(i + 1)), []);


  if (loading && !dashboardData) return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-[90vh] grid place-items-center bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50/30">
      <div className="flex flex-col items-center gap-4">
        <Loading />
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 via-amber-50/20 to-orange-50/20">
      <div className="max-w-full mx-auto space-y-6 sm:space-y-8 p-4 sm:p-4 lg:p-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl shadow-lg">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">{school.school_name || 'Your School'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DateRangeSelector
              from={dateRange?.from || ''}
              to={dateRange?.to || ''}
              onChange={(dr) => setDateRange({ from: dr.from, to: dr.to })}
              compact={true}
            />
          </div>
        </div>
        {error ? (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error} <button className="ml-2 text-indigo-600" onClick={() => loadDashboard({ overlay: true })}>Retry</button></div>
        ) : null}
      </div>

      {/* Summary Cards */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full" />
          Overview Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
          <button onClick={() => router.push(ROUTES.SCHOOL_ADMIN_STUDENTS)} className="text-left"><SummaryCard title="Students" value={school.total_students ?? 0} Icon={Users} colorClass="text-blue-600" bgClass="bg-blue-50" /></button>
          <button onClick={() => router.push(ROUTES.SCHOOL_ADMIN_TEACHERS)} className="text-left"><SummaryCard title="Teachers" value={school.total_teachers ?? 0} Icon={UserCog} colorClass="text-green-600" bgClass="bg-green-50" /></button>
          <button onClick={() => router.push(ROUTES.SCHOOL_ADMIN_PROGRAMS)} className="text-left"><SummaryCard title="Programs" value={school.programs_enrolled ?? 0} Icon={BookOpen} colorClass="text-purple-600" bgClass="bg-purple-50" /></button>
          <button onClick={() => router.push(ROUTES.SCHOOL_ADMIN_EVALUATIONS)} className="text-left"><SummaryCard title="This Week" value={summary.evaluations_this_week ?? 0} Icon={CheckCircle} colorClass="text-orange-600" bgClass="bg-orange-50" /></button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer" onClick={() => router.push(`${ROUTES.SCHOOL_ADMIN_STUDENTS}/new`)}><Plus className="w-4 h-4 mr-2" />Add Student</Button>
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer" onClick={() => router.push(`${ROUTES.SCHOOL_ADMIN_TEACHERS}/new`)}><Plus className="w-4 h-4 mr-2" />Add Teacher</Button>
          <Button variant="outline" onClick={() => router.push(ROUTES.SCHOOL_ADMIN_REPORTS)} className="cursor-pointer"><FileText className="w-4 h-4 mr-2" />View Reports</Button>
        </div>
      </Card>

      {/* Students Needing Attention */}
      <Card className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full" />
            Students Needing Attention ({studentsAttention.length})
          </h2>
          {studentsAttention.length > 5 ? (
            <button className="text-sm text-indigo-600 hover:underline cursor-pointer" onClick={() => router.push(ROUTES.SCHOOL_ADMIN_STUDENTS)}>View All</button>
          ) : null}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {studentsAttention.slice(0, 5).map((s, i) => (
            <div key={i} className="rounded-md border border-gray-200 bg-white p-4 hover:border-indigo-200 hover:shadow-sm transition">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <User className="w-4 h-4 text-indigo-600" aria-hidden />
                {s.student_name} • Grade {s.grade}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                <BookOpen className="w-4 h-4 text-gray-500" aria-hidden />
                <span>{s.program}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CalendarDays className="w-4 h-4 text-gray-500" aria-hidden />
                <span>{s.last_evaluation}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Lightbulb className="w-4 h-4 text-gray-500" aria-hidden />
                <span>Reason: {s.reason}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer" onClick={() => router.push(ROUTES.SCHOOL_ADMIN_PROGRAMS)}>Enroll in Program</Button>
                <Button size="sm" variant="outline" className="cursor-pointer" onClick={() => router.push(ROUTES.SCHOOL_ADMIN_STUDENTS)}>View Details</Button>
              </div>
            </div>
          ))}
          {studentsAttention.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
              <CheckCircle className="w-4 h-4" aria-hidden />
              <span>All students on track</span>
            </div>
          ) : null}
        </div>
      </Card>

      {/* Students by Grade */}
      <Card className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full" />
          Students by Grade
        </h2>
        <div className="flex flex-wrap gap-2">
          {allGrades.map((g) => {
            const count = Number(studentsByGrade[g] || 0);
            const active = count > 0;
            return (
              <button key={g} onClick={() => router.push(`${ROUTES.SCHOOL_ADMIN_STUDENTS}?grade=${g}`)}
                className={`px-3 py-1 rounded-full text-sm border cursor-pointer ${active ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                aria-label={`Grade ${g}: ${count} student${count !== 1 ? 's' : ''}`}
              >Grade {g} ({count})</button>
            );
          })}
        </div>
        {Object.keys(studentsByGrade).length === 0 ? <p className="text-sm text-gray-600 mt-2">No students enrolled</p> : null}
      </Card>

      {/* Charts and Program Progress */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full" />
          Performance Insights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        <PerformanceChart distribution={perfDist} />
        <Card className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-800">Program Progress</h2>
            {programProgress.length > 3 ? (
              <button className="text-sm text-indigo-600 hover:underline cursor-pointer" onClick={() => router.push(ROUTES.SCHOOL_ADMIN_PROGRAMS)}>View All Programs</button>
            ) : null}
          </div>
          <div className="space-y-3">
            {programProgress.slice(0, 3).map((p, i) => (
              <button key={i} className="w-full text-left cursor-pointer" onClick={() => router.push(ROUTES.SCHOOL_ADMIN_PROGRAMS)}>
                <div className="rounded-md border border-gray-200 p-4">
                  <div className="font-semibold text-gray-900">{p.program}</div>
                  <div className="text-sm text-gray-600">{p.enrolled_students} student{p.enrolled_students !== 1 ? 's' : ''} enrolled</div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-100 rounded">
                      <div className="h-2 rounded bg-indigo-600" style={{ width: `${Math.min(Math.max(p.avg_completion ?? 0, 0), 100)}%` }} />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{(p.avg_completion ?? 0).toFixed(1)}% completion</div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-700 mt-1">
                    <span>Avg Performance:</span>
                    {Array.from({ length: 5 }, (_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < Math.round(p.avg_performance ?? 0) ? 'text-yellow-500' : 'text-gray-300'}`} aria-hidden />
                    ))}
                  </div>
                </div>
              </button>
            ))}
            {programProgress.length === 0 ? <p className="text-sm text-gray-600">No programs enrolled</p> : null}
          </div>
        </Card>
        </div>
      </div>

      {/* Teacher Performance Summary */}
      <Card className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full" />
          Teacher Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {teacherSummary.sort((a, b) => (b.evaluations_this_week ?? 0) - (a.evaluations_this_week ?? 0)).map((t, i) => {
            const score = Number(t.avg_performance ?? 0);
            const color = score >= 4 ? 'border-green-200 bg-green-50' : score >= 3 ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50';
            return (
              <button key={i} className="w-full text-left cursor-pointer" onClick={() => router.push(ROUTES.SCHOOL_ADMIN_TEACHERS)}>
                <div className={`rounded-md border p-4 ${color}`}>
                  <div className="flex items-center gap-2">
                    <UserCog className="w-5 h-5 text-gray-600" aria-hidden />
                    <div className="font-semibold text-gray-900">{t.teacher_name}</div>
                  </div>
                  <div className="text-sm text-gray-700 mt-1">{t.students_count} students • {t.evaluations_this_week} evals this week</div>
                  <div className="flex items-center gap-1 text-sm text-gray-700 mt-1">
                    <span>Avg:</span>
                    {Array.from({ length: 5 }, (_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < Math.round(score) ? 'text-yellow-500' : 'text-gray-300'}`} aria-hidden />
                    ))}
                    <span className="ml-1 font-medium">{score.toFixed(1)}</span>
                  </div>
                </div>
              </button>
            );
          })}
          {teacherSummary.length === 0 ? <p className="text-sm text-gray-600">No teachers assigned</p> : null}
        </div>
      </Card>

      {/* Recent Evaluations */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full" />
          Recent Activity
        </h2>
        <RecentEvaluations items={recentEvaluations.slice(0, 5)} />
        <div className="flex justify-end">
          <button className="text-sm text-indigo-600 hover:underline cursor-pointer" onClick={() => router.push(ROUTES.SCHOOL_ADMIN_EVALUATIONS)}>View All Evaluations</button>
        </div>
      </div>

      </div>
    </div>
  );
}
