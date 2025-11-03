"use client"
import React from 'react';
import OverviewCards from './_components/OverviewCards';
import PerformanceDistribution from './_components/PerformanceDistribution';
import ProgramEnrollment from './_components/ProgramEnrollment';
import ActivityFeed from './_components/ActivityFeed';
import useDashboardData from '../../../hooks/useDashboardData';

const getDefaultDateRange = () => {
  const today = new Date();
  const to = today.toISOString().slice(0, 10);
  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() - 7);
  const from = fromDate.toISOString().slice(0, 10);
  return { from, to };
};

export default function SuperAdminDashboardPage() {
  const { from, to } = getDefaultDateRange();
  const { data, loading, error } = useDashboardData({ dateFrom: from, dateTo: to });

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor and manage all schools, programs, and student performance</p>
      </div>

      {/* Loading/Error State */}
      {loading && <div className="text-center py-12 text-lg text-gray-500">Loading dashboard...</div>}
      {error && <div className="text-center py-12 text-red-500">{error}</div>}

      {/* Overview Stats Cards */}
      {!loading && !error && (
        <OverviewCards summary={data?.summary} trends={data?.trends} />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Distribution */}
        {!loading && !error && (
          <PerformanceDistribution performance={data?.performance_distribution} totalStudents={data?.summary?.total_students} />
        )}
        {/* Program Enrollment */}
        <ProgramEnrollment />
      </div>

      {/* Recent Activity */}
      <ActivityFeed />
    </div>
  );
}
