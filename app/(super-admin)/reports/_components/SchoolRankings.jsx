'use client';

import React from 'react';
import { Trophy, MapPin, Users, TrendingUp, Medal, Award } from 'lucide-react';
import { reportsData } from '@/lib/mockData';

export default function SchoolRankings() {
  const { schoolRankings } = reportsData;

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case 3:
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 50) return "text-green-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-orange-600";
  };

  const SchoolCard = ({ school, index }) => {
    const rank = index + 1;
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border ${getRankBadgeColor(rank)}`}>
              {getRankIcon(rank)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{school.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{school.location}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{school.excellentPercentage}%</div>
            <div className="text-sm text-gray-600">Excellence Rate</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{school.totalStudents}</div>
            <div className="text-xs text-gray-600">Total Students</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">#{rank}</div>
            <div className="text-xs text-gray-600">Rank</div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Excellent</span>
            <span className={`font-semibold ${getPerformanceColor(school.excellentPercentage)}`}>
              {school.excellentPercentage}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Average</span>
            <span className={`font-semibold ${getPerformanceColor(school.averagePercentage)}`}>
              {school.averagePercentage}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">In Process</span>
            <span className={`font-semibold ${getPerformanceColor(school.inProcessPercentage)}`}>
              {school.inProcessPercentage}%
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="flex h-2 rounded-full overflow-hidden">
              <div 
                className="bg-green-500" 
                style={{ width: `${school.excellentPercentage}%` }}
              ></div>
              <div 
                className="bg-yellow-500" 
                style={{ width: `${school.averagePercentage}%` }}
              ></div>
              <div 
                className="bg-orange-500" 
                style={{ width: `${school.inProcessPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TopPerformers = () => {
    const topThree = schoolRankings.slice(0, 3);
    
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 3 Performers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topThree.map((school, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full border-2 ${getRankBadgeColor(index + 1)}`}>
                  {getRankIcon(index + 1)}
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{school.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{school.location}</p>
              <div className="text-3xl font-bold text-gray-900 mb-1">{school.excellentPercentage}%</div>
              <div className="text-sm text-gray-600 mb-3">Excellence Rate</div>
              <div className="text-sm text-gray-900">{school.totalStudents} students</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Performance by School</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4" />
          <span>Ranked by Excellence Rate</span>
        </div>
      </div>

      <TopPerformers />

      {/* All Schools Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All School Rankings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {schoolRankings.map((school, index) => (
            <SchoolCard key={index} school={school} index={index} />
          ))}
        </div>
      </div>

      {/* Detailed Rankings Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed School Rankings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Excellent %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Process %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schoolRankings.map((school, index) => {
                const rank = index + 1;
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${getRankBadgeColor(rank)} mr-2`}>
                          {rank <= 3 ? getRankIcon(rank) : <span className="text-xs font-bold">#{rank}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{school.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {school.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        {school.totalStudents}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {school.excellentPercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {school.averagePercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {school.inProcessPercentage}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {schoolRankings.reduce((sum, school) => sum + school.totalStudents, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Trophy className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{schoolRankings[0]?.excellentPercentage}%</div>
              <div className="text-sm text-gray-600">Top School Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {Math.round(schoolRankings.reduce((sum, school) => sum + school.excellentPercentage, 0) / schoolRankings.length)}%
              </div>
              <div className="text-sm text-gray-600">Avg Excellence Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <MapPin className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{schoolRankings.length}</div>
              <div className="text-sm text-gray-600">Total Schools</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}