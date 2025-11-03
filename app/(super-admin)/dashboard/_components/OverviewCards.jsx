import React from 'react';
import { School, Users, BookOpen, ClipboardCheck, TrendingUp } from 'lucide-react';

export default function OverviewCards({ summary, trends }) {
  // summary: { total_schools, active_schools, total_programs, total_teachers, total_students, total_evaluations, evaluations_this_week }
  // trends: { new_students_this_month, new_evaluations_this_month, growth_percentage }
  const stats = [
    {
      title: 'Total Schools',
      value: summary?.total_schools ?? '-',
      change: `${summary?.active_schools ?? '-'} active`,
      icon: School,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Students',
      value: summary?.total_students ?? '-',
      change: `+${trends?.new_students_this_month ?? 0} this month`,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Teachers',
      value: summary?.total_teachers ?? '-',
      change: '',
      icon: BookOpen,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Evaluations This Week',
      value: summary?.evaluations_this_week ?? '-',
      change: `+${trends?.new_evaluations_this_month ?? 0} this month`,
      icon: ClipboardCheck,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className={`h-4 w-4 ${stat.textColor}`} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              {stat.change && <p className={`text-sm ${stat.textColor} font-medium`}>{stat.change}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}