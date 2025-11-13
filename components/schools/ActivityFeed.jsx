import { Activity, Clock, Sparkles } from 'lucide-react';

function formatRelativeTime(iso) {
  try {
    const ts = new Date(iso).getTime();
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  } catch { return ''; }
}

function getActivityIcon(description) {
  const desc = (description || '').toLowerCase();
  if (desc.includes('added') || desc.includes('created')) return '🎉';
  if (desc.includes('updated') || desc.includes('edited')) return '✏️';
  if (desc.includes('deleted') || desc.includes('removed')) return '🗑️';
  if (desc.includes('completed') || desc.includes('finished')) return '✅';
  if (desc.includes('assigned')) return '👤';
  if (desc.includes('commented')) return '💬';
  return '📌';
}

export default function ActivityFeed({ items = [] }) {
  if (!items || items.length === 0) return null;
  
  return (
    <section className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-purple-200 bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300">
      {/* Decorative Background Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
              <Activity className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              Recent Activity
            </h3>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" strokeWidth={2.5} />
            <span className="text-xs font-bold text-purple-700">{items.length}</span>
          </div>
        </div>

        {/* Activity Timeline */}
        <ul className="space-y-3">
          {items.map((it, idx) => (
            <li 
              key={idx} 
              className="group/item relative flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 border border-gray-100 hover:border-purple-200 transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
            >
              {/* Timeline Connector Line */}
              {idx !== items.length - 1 && (
                <div className="absolute left-7 top-14 bottom-[-12px] w-0.5 bg-gradient-to-b from-gray-200 to-transparent" />
              )}
              
              {/* Activity Icon/Emoji */}
              <div className="flex-shrink-0 relative z-10">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 group-hover/item:border-purple-300 shadow-sm transition-all duration-200 group-hover/item:scale-110">
                  <span className="text-base sm:text-lg">{getActivityIcon(it.description)}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium group-hover/item:text-gray-900 transition-colors">
                  {it.description}
                </p>
                
                {/* Timestamp */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3 h-3 flex-shrink-0" strokeWidth={2} />
                  <span className="font-semibold">{formatRelativeTime(it.timestamp)}</span>
                </div>
              </div>

              {/* Hover Accent Line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-blue-400 rounded-l-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-200" />
            </li>
          ))}
        </ul>

        {/* View All Link (Optional) */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors duration-200 py-2">
            View All Activity
          </button>
        </div>
      </div>
    </section>
  );
}
