"use client";
import { School, GraduationCap, ClipboardCheck, TrendingUp, Sparkles } from 'lucide-react';

export default function ProgramStats({ statistics }) {
  const { enrolled_schools = 0, total_students = 0, total_evaluations = 0 } = statistics || {};
  
  const cards = [
    { 
      label: 'Schools Enrolled', 
      value: enrolled_schools,
      icon: School,
      color: 'purple',
      gradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      border: 'border-purple-200',
      hoverGradient: 'hover:from-purple-100 hover:to-purple-200'
    },
    { 
      label: 'Total Students', 
      value: total_students,
      icon: GraduationCap,
      color: 'blue',
      gradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      border: 'border-blue-200',
      hoverGradient: 'hover:from-blue-100 hover:to-blue-200'
    },
    { 
      label: 'Evaluations', 
      value: total_evaluations,
      icon: ClipboardCheck,
      color: 'green',
      gradient: 'from-green-50 to-green-100',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      border: 'border-green-200',
      hoverGradient: 'hover:from-green-100 hover:to-green-200'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div 
            key={c.label} 
            className={`group relative overflow-hidden rounded-2xl border-2 ${c.border} bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03] cursor-pointer`}
          >
            {/* Decorative Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${c.gradient} rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
            
            {/* Top Accent Line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative z-10 flex items-start justify-between">
              {/* Icon Badge */}
              <div className={`flex-shrink-0 p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${c.gradient} ${c.hoverGradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${c.iconColor}`} strokeWidth={2.5} />
              </div>

              {/* Trend Indicator */}
              <div className={`p-2 rounded-xl bg-gradient-to-br ${c.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                <TrendingUp className={`w-4 h-4 ${c.iconColor}`} strokeWidth={2.5} />
              </div>
            </div>

            {/* Stats Content */}
            <div className="relative z-10 mt-4 space-y-1">
              <div className="flex items-baseline gap-2">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                  {c.value.toLocaleString()}
                </div>
                {/* Growth Badge (Optional - could be dynamic) */}
                {/* <div className={`px-2 py-0.5 rounded-lg text-xs font-bold bg-gradient-to-r ${c.gradient} ${c.iconColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  +12%
                </div> */}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {c.label}
              </div>
              
              {/* Additional Context */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-2 pt-2 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-3 h-3" strokeWidth={2.5} />
                <span>Active Total</span>
              </div>
            </div>

            {/* Bottom Corner Decoration */}
            <div className={`absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-br ${c.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
          </div>
        );
      })}
    </div>
  );
}
