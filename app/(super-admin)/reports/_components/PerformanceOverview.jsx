'use client';

import React from 'react';
import { Users, ClipboardCheck, Calendar, Clock, TrendingUp } from 'lucide-react';
import { reportsData } from '@/lib/mockData';

export default function PerformanceOverview() {
  const { overview, performanceDistribution } = reportsData;

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      orange: "bg-orange-50 text-orange-600 border-orange-200"
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    );
  };

  const PerformanceBar = ({ label, count, percentage, color }) => {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded ${color}`}></div>
          <span className="font-medium text-gray-900">{label}</span>
        </div>
        <div className="text-right">
          <div className="font-bold text-gray-900">{count} students</div>
          <div className="text-sm text-gray-600">({percentage}%)</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md">
          Performance Overview
        </button>
        <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          Level Progression
        </button>
        <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          Teacher Activity
        </button>
        <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          Custom Reports
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Students"
          value={overview.totalStudents.toLocaleString()}
          color="blue"
        />
        <StatCard
          icon={ClipboardCheck}
          title="Total Evaluations"
          value={overview.totalEvaluations.toLocaleString()}
          color="green"
        />
        <StatCard
          icon={Calendar}
          title="Evaluation Period"
          value={`${overview.evaluationPeriod} days`}
          color="purple"
        />
        <StatCard
          icon={Clock}
          title="Avg Time per Evaluation"
          value={`${overview.avgTimePerEvaluation} days`}
          color="orange"
        />
      </div>

      {/* Performance Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Overall Performance Distribution</h3>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-gray-900">
              {overview.totalStudents.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">Students</span>
          </div>
        </div>

        <div className="space-y-4">
          <PerformanceBar
            label="Excellent"
            count={performanceDistribution.excellent.count}
            percentage={performanceDistribution.excellent.percentage}
            color="bg-green-500"
          />
          <PerformanceBar
            label="Average"
            count={performanceDistribution.average.count}
            percentage={performanceDistribution.average.percentage}
            color="bg-yellow-500"
          />
          <PerformanceBar
            label="In Process"
            count={performanceDistribution.inProcess.count}
            percentage={performanceDistribution.inProcess.percentage}
            color="bg-orange-500"
          />
        </div>

        {/* Visual Progress Bars */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-20 text-sm font-medium text-gray-600">Excellent</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ width: `${performanceDistribution.excellent.percentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {performanceDistribution.excellent.percentage}%
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="w-20 text-sm font-medium text-gray-600">Average</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${performanceDistribution.average.percentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {performanceDistribution.average.percentage}%
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="w-20 text-sm font-medium text-gray-600">In Process</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full" 
                style={{ width: `${performanceDistribution.inProcess.percentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {performanceDistribution.inProcess.percentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}