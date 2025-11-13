"use client";
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import dashboardService from '@/lib/api/services/dashboardService';
import SummaryCard from '@/components/dashboard/SummaryCard';
import AnalyticsCard from '@/components/dashboard/AnalyticsCard';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import TrendChart from '@/components/dashboard/TrendChart';
import SchoolsTable from '@/components/dashboard/SchoolsTable';
import ProgramsTable from '@/components/dashboard/ProgramsTable';
// import ActivityFeed from '@/components/dashboard/ActivityFeed';
import RecentEvaluations from '@/components/dashboard/RecentEvaluations';
import DateRangeSelector from '@/components/dashboard/DateRangeSelector';
import Loading from '@/components/common/Loading';
import { Building2, Users, GraduationCap, BookOpen, ClipboardList } from 'lucide-react';

function defaultDateRange() {
  const to = new Date();
  const from = new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { from: fmt(from), to: fmt(to) };
}

export default function SuperAdminDashboardPage() {
  const { user } = useAuth();
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
      const res = await dashboardService.getDashboardData(dateRange.from, dateRange.to, { force: opts.force });
      setDashboardData(res.data);
      setMetadata(res.metadata || null);
      setLastUpdated(res?.metadata?.generated_at ? new Date(res.metadata.generated_at).toISOString() : new Date().toISOString());
      setResponseMs(res?.metadata?.response_time_ms ?? res?.durationMs ?? null);
    } catch (err) {
      console.error('Dashboard load failed:', err);
      setError(err?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [dateRange.from, dateRange.to]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const id = setInterval(() => { loadDashboard({ overlay: true }); }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [loadDashboard]);

  // No-op helpers removed; trends are driven from provided JSON

  if (loading && !dashboardData) return (
    <div className="p-6 min-h-[90vh] grid place-items-center">
      <Loading />
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <div className="flex items-center justify-between">
          <DateRangeSelector
            from={dateRange.from}
            to={dateRange.to}
            lastUpdated={lastUpdated}
            onChange={(dr) => setDateRange({ from: dr.from, to: dr.to })}
            onRefresh={() => loadDashboard({ force: true, overlay: true })}
          />
          {error ? (
            <div className="text-sm text-red-600">{error} <button className="ml-2 text-indigo-600" onClick={() => loadDashboard({ force: true })}>Retry</button></div>
          ) : null}
        </div>
        {metadata?.date_range ? (
          <p className="text-sm text-gray-600 font-medium">Showing data for <span className="font-medium">{metadata.date_range.from}</span> to <span className="font-medium">{metadata.date_range.to}</span></p>
        ) : null}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4 sm:gap-6">
        <SummaryCard title="Total Schools" subtitle="All Schools" value={dashboardData?.summary?.total_schools ?? 0} Icon={Building2} colorClass="text-blue-600" bgClass="bg-blue-50" />
        <SummaryCard title="Active Schools" subtitle="Currently Active" value={dashboardData?.summary?.active_schools ?? 0} Icon={Building2} colorClass="text-teal-600" bgClass="bg-teal-50" />
        <SummaryCard title="Total Programs" subtitle="Available Programs" value={dashboardData?.summary?.total_programs ?? 0} Icon={BookOpen} colorClass="text-orange-600" bgClass="bg-orange-50" />
        <SummaryCard title="Total Teachers" subtitle="All Teachers" value={dashboardData?.summary?.total_teachers ?? 0} Icon={Users} colorClass="text-green-600" bgClass="bg-green-50" />
        <SummaryCard title="Total Students" subtitle="All Students" value={dashboardData?.summary?.total_students ?? 0} Icon={GraduationCap} colorClass="text-purple-600" bgClass="bg-purple-50" />
        <SummaryCard title="Total Evaluations" subtitle="All Time" value={dashboardData?.summary?.total_evaluations ?? 0} Icon={ClipboardList} colorClass="text-sky-600" bgClass="bg-sky-50" />
        <SummaryCard title="Evaluations This Week" subtitle="Last 7 Days" value={dashboardData?.summary?.evaluations_this_week ?? 0} Icon={ClipboardList} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnalyticsCard title="New Students This Month" value={dashboardData?.trends?.new_students_this_month ?? 0} trend={dashboardData?.trends?.growth_percentage ?? null} description="Month over month" />
        <AnalyticsCard title="New Evaluations This Month" value={dashboardData?.trends?.new_evaluations_this_month ?? 0} trend={null} description="Total added this month" />
        <AnalyticsCard title="Growth Percentage" value={(dashboardData?.trends?.growth_percentage ?? 0).toFixed(1)} suffix="%" trend={dashboardData?.trends?.growth_percentage ?? null} description="Overall growth" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <PerformanceChart distribution={dashboardData?.performance_distribution} />
        {Array.isArray(dashboardData?.trends?.daily_evaluations) && dashboardData.trends.daily_evaluations.length > 0 ? (
          <TrendChart data={dashboardData.trends.daily_evaluations} />
        ) : null}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SchoolsTable data={dashboardData?.top_schools || []} />
        <ProgramsTable data={dashboardData?.program_stats || []} />
      </div>

      {/* Recent Evaluations */}
      <RecentEvaluations items={dashboardData?.recent_evaluations || []} />

      {/* Footer metadata */}
      <div className="text-xs text-gray-500 flex items-center justify-between">
        <span>Last updated: {lastUpdated}</span>
        {responseMs != null ? <span>Response time: {Number(responseMs).toFixed(2)}ms</span> : null}
      </div>
    </div>
  );
}
