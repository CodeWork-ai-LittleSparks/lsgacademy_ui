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
import RecentEvaluations from '@/components/dashboard/RecentEvaluations';
import DateRangeSelector from '@/components/dashboard/DateRangeSelector';
import Loading from '@/components/common/Loading';
import { Building2, Users, GraduationCap, BookOpen, ClipboardList, Sparkles } from 'lucide-react';

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

  if (loading && !dashboardData) return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-[90vh] grid place-items-center bg-gradient-to-br from-gray-50 via-amber-50/30 to-orange-50/30">
      <div className="flex flex-col items-center gap-4">
        <Loading />
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 via-amber-50/20 to-orange-50/20">
      <div className="max-w-[1920px] mx-auto space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl shadow-lg">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                  Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">
                  Welcome back, {user?.full_name || 'Admin'}
                </p>
              </div>
            </div>
          </div>

          {/* Date Range Selector */}
          <DateRangeSelector
            from={dateRange.from}
            to={dateRange.to}
            lastUpdated={lastUpdated}
            onChange={(dr) => setDateRange({ from: dr.from, to: dr.to })}
            onRefresh={() => loadDashboard({ force: true, overlay: true })}
          />

          {/* Error Message */}
          {error && (
            <div className="flex items-center justify-between p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <p className="text-sm font-semibold text-red-800">{error}</p>
              </div>
              <button 
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                onClick={() => loadDashboard({ force: true })}
              >
                Retry
              </button>
            </div>
          )}

          {/* Date Range Info */}
          {metadata?.date_range && (
            <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-xl shadow-sm">
              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />
              <p className="text-sm font-semibold text-gray-700">
                Showing data from{' '}
                <span className="font-bold text-orange-700">{metadata.date_range.from}</span>
                {' '}to{' '}
                <span className="font-bold text-orange-700">{metadata.date_range.to}</span>
              </p>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full" />
            Overview Statistics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
            <SummaryCard title="Total Schools" subtitle="All Schools" value={dashboardData?.summary?.total_schools ?? 0} Icon={Building2} colorClass="text-blue-600" bgClass="bg-blue-50" />
            <SummaryCard title="Active Schools" subtitle="Currently Active" value={dashboardData?.summary?.active_schools ?? 0} Icon={Building2} colorClass="text-teal-600" bgClass="bg-teal-50" />
            <SummaryCard title="Total Programs" subtitle="Available Programs" value={dashboardData?.summary?.total_programs ?? 0} Icon={BookOpen} colorClass="text-orange-600" bgClass="bg-orange-50" />
            <SummaryCard title="Total Teachers" subtitle="All Teachers" value={dashboardData?.summary?.total_teachers ?? 0} Icon={Users} colorClass="text-green-600" bgClass="bg-green-50" />
            <SummaryCard title="Total Students" subtitle="All Students" value={dashboardData?.summary?.total_students ?? 0} Icon={GraduationCap} colorClass="text-purple-600" bgClass="bg-purple-50" />
            <SummaryCard title="Total Evaluations" subtitle="All Time" value={dashboardData?.summary?.total_evaluations ?? 0} Icon={ClipboardList} colorClass="text-sky-600" bgClass="bg-sky-50" />
            <SummaryCard title="Evaluations This Week" subtitle="Last 7 Days" value={dashboardData?.summary?.evaluations_this_week ?? 0} Icon={ClipboardList} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
          </div>
        </div>

        {/* Analytics Cards */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full" />
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <AnalyticsCard title="New Students This Month" value={dashboardData?.trends?.new_students_this_month ?? 0} trend={dashboardData?.trends?.growth_percentage ?? null} description="Month over month growth" />
            <AnalyticsCard title="New Evaluations This Month" value={dashboardData?.trends?.new_evaluations_this_month ?? 0} trend={null} description="Total added this month" />
            <AnalyticsCard title="Growth Percentage" value={(dashboardData?.trends?.growth_percentage ?? 0).toFixed(1)} suffix="%" trend={dashboardData?.trends?.growth_percentage ?? null} description="Overall platform growth" />
          </div>
        </div>

        {/* Charts */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full" />
            Performance Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            <PerformanceChart distribution={dashboardData?.performance_distribution} />
            {Array.isArray(dashboardData?.trends?.daily_evaluations) && dashboardData.trends.daily_evaluations.length > 0 && (
              <TrendChart data={dashboardData.trends.daily_evaluations} />
            )}
          </div>
        </div>

        {/* Tables */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-amber-600 to-orange-600 rounded-full" />
            Top Performers
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            <SchoolsTable data={dashboardData?.top_schools || []} />
            <ProgramsTable data={dashboardData?.program_stats || []} />
          </div>
        </div>

        {/* Recent Evaluations */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full" />
            Recent Activity
          </h2>
          <RecentEvaluations items={dashboardData?.recent_evaluations || []} />
        </div>
      </div>
    </div>
  );
}
