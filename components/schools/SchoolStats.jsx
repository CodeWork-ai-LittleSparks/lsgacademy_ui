import { GraduationCap, Users, BookOpen, ClipboardList, TrendingUp } from 'lucide-react';

const colorClasses = {
  indigo: { 
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100', 
    icon: 'text-indigo-600',
    border: 'border-indigo-200',
    hover: 'hover:from-indigo-100 hover:to-indigo-200'
  },
  purple: { 
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100', 
    icon: 'text-purple-600',
    border: 'border-purple-200',
    hover: 'hover:from-purple-100 hover:to-purple-200'
  },
  green: { 
    bg: 'bg-gradient-to-br from-green-50 to-green-100', 
    icon: 'text-green-600',
    border: 'border-green-200',
    hover: 'hover:from-green-100 hover:to-green-200'
  },
  orange: { 
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100', 
    icon: 'text-orange-600',
    border: 'border-orange-200',
    hover: 'hover:from-orange-100 hover:to-orange-200'
  },
  sky: { 
    bg: 'bg-gradient-to-br from-sky-50 to-sky-100', 
    icon: 'text-sky-600',
    border: 'border-sky-200',
    hover: 'hover:from-sky-100 hover:to-sky-200'
  },
};

const StatCard = ({ icon: Icon, label, value, color = 'indigo' }) => {
  const cls = colorClasses[color] || colorClasses.indigo;
  
  return (
    <div className={`group relative overflow-hidden rounded-2xl border-2 ${cls.border} bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03] cursor-pointer`}>
      {/* Decorative Background Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${cls.bg} rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
      
      {/* Top Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${cls.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative z-10 flex items-start justify-between">
        {/* Icon Badge */}
        <div className={`flex-shrink-0 p-3 sm:p-4 rounded-2xl ${cls.bg} ${cls.hover} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
          <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${cls.icon}`} strokeWidth={2.5} />
        </div>

        {/* Trend Indicator */}
        <div className={`p-2 rounded-xl ${cls.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
          <TrendingUp className={`w-4 h-4 ${cls.icon}`} strokeWidth={2.5} />
        </div>
      </div>

      {/* Stats Content */}
      <div className="relative z-10 mt-4 space-y-1">
        <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">
          {label}
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            {value?.toLocaleString() ?? 0}
          </div>
          {/* Growth Badge (Optional - could be dynamic) */}
          <div className={`px-2 py-0.5 rounded-lg text-xs font-bold ${cls.bg} ${cls.icon} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
            +12%
          </div>
        </div>
        
        {/* Additional Context */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-2 pt-2 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Total Active</span>
        </div>
      </div>

      {/* Bottom Corner Decoration */}
      <div className={`absolute bottom-0 right-0 w-20 h-20 ${cls.bg} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
    </div>
  );
};

export default function SchoolStats({ statistics }) {
  const { total_students, total_teachers, total_programs, active_enrollments } = statistics || {};
  
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <StatCard icon={GraduationCap} label="Students" value={total_students} color="purple" />
      <StatCard icon={Users} label="Teachers" value={total_teachers} color="green" />
      <StatCard icon={BookOpen} label="Programs" value={total_programs} color="orange" />
      <StatCard icon={ClipboardList} label="Enrollments" value={active_enrollments} color="sky" />
    </section>
  );
}
