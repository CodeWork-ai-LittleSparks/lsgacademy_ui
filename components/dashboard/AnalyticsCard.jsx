"use client";
import Card from '@/components/ui/Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AnalyticsCard({ title, value, suffix = '', trend = null, description = '', progress = null }) {
  const showTrend = trend !== null && trend !== undefined;
  const isUp = (trend ?? 0) >= 0;
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;
  const trendColor = isUp ? 'text-green-600' : 'text-red-600';
  const trendBgColor = isUp ? 'bg-green-50' : 'bg-red-50';

  return (
    <Card className="group relative overflow-hidden shadow-md hover:shadow-xl rounded-2xl border border-gray-200 hover:border-amber-200 p-5 sm:p-6 bg-gradient-to-br from-white to-gray-50 hover:from-amber-50 hover:to-orange-50 transition-all duration-300 hover:scale-[1.02]">
      {/* Decorative Gradient Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
              {title}
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
              <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-600 ml-1">
                {suffix}
              </span>
            </div>
          </div>
          
          {/* Trend Badge */}
          {showTrend && (
            <div 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${trendBgColor} ${trendColor} transition-all duration-300 group-hover:scale-110 shadow-sm`}
              aria-label="Trend"
            >
              <TrendIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              <span className="text-xs sm:text-sm font-bold">
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <div className="flex items-start gap-2 mb-4">
            <div className="w-1 h-4 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              {description}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        {typeof progress === 'number' && (
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
              <span className="font-semibold text-gray-700">Target Progress</span>
              <span className="font-bold text-orange-600">
                {Math.min(Math.max(progress, 0), 100)}%
              </span>
            </div>
            <div className="relative h-2.5 sm:h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-orange-600 to-orange-700 rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 opacity-20" />
      </div>
    </Card>
  );
}
