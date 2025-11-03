'use client';

import React, { useState } from 'react';
import { FileText, BarChart3, TrendingUp, Users } from 'lucide-react';
import ReportFilters from './_components/ReportFilters';
import PerformanceOverview from './_components/PerformanceOverview';
import ProgramPerformance from './_components/ProgramPerformance';
import SchoolRankings from './_components/SchoolRankings';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Performance Overview', icon: BarChart3 },
    { id: 'programs', label: 'Program Performance', icon: FileText },
    { id: 'schools', label: 'School Rankings', icon: TrendingUp },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <PerformanceOverview />;
      case 'programs':
        return <ProgramPerformance />;
      case 'schools':
        return <SchoolRankings />;
      default:
        return <PerformanceOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-sm text-gray-600 mt-1">
                Comprehensive performance reports and analytics dashboard
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                1,200 Total Students
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar with Filters */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <ReportFilters />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6">
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-gray-50 rounded-lg p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
