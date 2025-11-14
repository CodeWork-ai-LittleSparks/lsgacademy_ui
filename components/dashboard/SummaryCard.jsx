"use client";
import { cn } from '@/lib/utils';
import Card from '@/components/ui/Card';

export default function SummaryCard({ title, value, subtitle, Icon, colorClass = 'text-indigo-600', bgClass = 'bg-indigo-50' }) {
  return (
    <Card className="group relative overflow-hidden shadow-md hover:shadow-xl rounded-2xl border border-gray-200 hover:border-purple-300 p-5 sm:p-6 bg-white transition-all duration-300 hover:scale-[1.02]">
      {/* Decorative Background Effect */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      
      <div className="relative z-10 flex items-start gap-4">
        {/* Icon Container */}
        <div className={cn('flex-shrink-0 p-3.5 sm:p-4 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110', bgClass)} aria-hidden>
          {Icon && <Icon className={cn('w-6 h-6 sm:w-7 sm:h-7', colorClass)} strokeWidth={2.5} />}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 pt-1">
          <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
            {title}
          </div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-1">
            {Number(value ?? 0).toLocaleString()}
          </div>
          {subtitle && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className={cn("w-1 h-3 rounded-full", bgClass.replace('bg-', 'bg-'))} />
              <div className="text-xs font-medium text-gray-600">{subtitle}</div>
            </div>
          )}
        </div>
      </div>

      {/* Hover Border Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className={cn("absolute inset-0 rounded-2xl opacity-10", bgClass)} />
      </div>
    </Card>
  );
}
