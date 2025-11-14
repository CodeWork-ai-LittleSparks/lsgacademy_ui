"use client";
import Card from '@/components/ui/Card';
import { TrendingUp, BarChart3 } from 'lucide-react';

function LineChart({ data, width = 600, height = 280, color = '#7c3aed' }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[280px] text-sm font-medium text-gray-500">
        No trend data available
      </div>
    );
  }
  
  const padding = 40;
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;
  const maxY = Math.max(...data.map((d) => d.count), 1);
  const minY = Math.min(...data.map((d) => d.count), 0);
  const rangeY = maxY - minY || 1;
  
  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * usableW;
    const y = padding + usableH - ((d.count - minY) / rangeY) * usableH;
    return `${x},${y}`;
  }).join(' ');

  // Create gradient area under line
  const areaPoints = `${padding},${padding + usableH} ` + points + ` ${padding + usableW},${padding + usableH}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Daily evaluations trend" className="drop-shadow-sm">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      
      {/* Background Grid */}
      <g className="opacity-20">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + ratio * usableH;
          return (
            <line key={i} x1={padding} y1={y} x2={padding + usableW} y2={y} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" />
          );
        })}
      </g>
      
      {/* Area under line */}
      <polygon points={areaPoints} fill="url(#areaGradient)" />
      
      {/* Main line */}
      <polyline points={points} fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Data points */}
      {data.map((d, i) => {
        const x = padding + (i / Math.max(data.length - 1, 1)) * usableW;
        const y = padding + usableH - ((d.count - minY) / rangeY) * usableH;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill="white" stroke="url(#lineGradient)" strokeWidth="3" className="transition-all duration-200 hover:r-7" />
            <title>{`${d.date}: ${d.count} evaluations`}</title>
          </g>
        );
      })}
      
      {/* Y-axis labels */}
      <text x={padding - 10} y={padding} textAnchor="end" className="text-xs fill-gray-600 font-semibold">{maxY}</text>
      <text x={padding - 10} y={padding + usableH} textAnchor="end" className="text-xs fill-gray-600 font-semibold">{minY}</text>
    </svg>
  );
}

export default function TrendChart({ title = 'Evaluation Trends (Last 7 Days)', data }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-purple-200 p-5 sm:p-6 bg-white shadow-md hover:shadow-xl transition-all duration-300">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" strokeWidth={2.5} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            {title}
          </h3>
        </div>

        {/* Chart */}
        <div className="overflow-x-auto">
          <div className="min-w-[480px]">
            <LineChart data={data} />
          </div>
        </div>
      </div>
    </Card>
  );
}
