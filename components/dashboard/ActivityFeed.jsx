"use client";
import Card from '@/components/ui/Card';
import { Clock, CheckCircle, FileText, Activity as ActivityIcon, UserCheck } from 'lucide-react';

function timeAgo(ts) {
  const now = Date.now();
  const then = new Date(ts).getTime();
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

function iconFor(type) {
  switch (type) {
    case 'evaluation':
      return CheckCircle;
    case 'report':
      return FileText;
    case 'user':
      return UserCheck;
    default:
      return ActivityIcon;
  }
}

export default function ActivityFeed({ items = [], onViewAll }) {
  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header Section with Gradient Background */}
      <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white rounded-xl shadow-sm">
            <ActivityIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" strokeWidth={2} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight">
            Recent Activity
          </h2>
        </div>
        <button
          onClick={onViewAll}
          className="text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-purple-50"
        >
          View All
        </button>
      </div>

      {/* Activity Items with Enhanced Spacing */}
      <div className="p-4 sm:p-6 space-y-3">
        {items.slice(0, 10).map((a, i) => {
          const Icon = iconFor(a.type);
          return (
            <div
              key={i}
              className="group relative flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:from-purple-50 hover:to-blue-50 border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
            >
              {/* Icon with Colored Background */}
              <div className="flex-shrink-0 mt-1">
                <div className={`p-2.5 sm:p-3 rounded-xl shadow-sm transition-all duration-300 group-hover:scale-110 ${
                  a.type === 'evaluation' 
                    ? 'bg-green-100 text-green-600' 
                    : a.type === 'report' 
                    ? 'bg-blue-100 text-blue-600' 
                    : a.type === 'user' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                  {a.description}
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
                  <span className="font-medium">{timeAgo(a.timestamp)}</span>
                </div>
              </div>

              {/* Subtle Accent Line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-blue-400 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          );
        })}

        {/* Empty State with Better Design */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
            <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl mb-4 shadow-inner">
              <ActivityIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-base sm:text-lg font-semibold text-gray-600 mb-1">
              No recent activity
            </p>
            <p className="text-xs sm:text-sm text-gray-500 text-center max-w-xs">
              When actions occur, they'll appear here for quick access
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
