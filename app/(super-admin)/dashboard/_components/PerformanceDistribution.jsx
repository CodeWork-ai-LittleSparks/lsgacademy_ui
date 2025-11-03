import React from 'react';
import { TrendingUp, Users } from 'lucide-react';

export default function PerformanceDistribution({ performance, totalStudents }) {
  // performance: { excellent, average, in_process }
  const total = (performance?.excellent ?? 0) + (performance?.average ?? 0) + (performance?.in_process ?? 0);
  const performanceData = [
    {
      level: 'Excellent',
      count: performance?.excellent ?? 0,
      color: 'bg-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    {
      level: 'Average',
      count: performance?.average ?? 0,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      level: 'In Process',
      count: performance?.in_process ?? 0,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700'
    }
  ].map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
  }));

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Performance Distribution</h3>
          <div className="flex items-center gap-2 mt-1">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{totalStudents ?? '-'} Total Students</span>
          </div>
        </div>
        <TrendingUp className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {performanceData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{item.level}</span>
              <span className="text-sm text-gray-600">
                {item.percentage}% • {item.count} students
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`${item.color} h-3 rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            
            <div className={`${item.bgColor} ${item.textColor} px-3 py-2 rounded-lg text-xs font-medium`}>
              {item.count} students performing at {item.level.toLowerCase()} level
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Overall Performance</span>
          <span className="font-semibold text-gray-900">
            {performanceData.length > 0 ? `${performanceData[0].percentage}% Excellent` : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}