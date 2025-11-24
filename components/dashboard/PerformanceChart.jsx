"use client";
import Card from '@/components/ui/Card';
import { TrendingUp, Users } from 'lucide-react';

// Simple SVG pie chart without external libs
function Pie({ data, colors, size = 180, thickness = 24 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = size / 2;
  const center = size / 2;
  const fullPie = !thickness || thickness <= 0;
  const inner = fullPie ? 0 : radius - thickness;

  let cumulative = 0;
  const arcs = data.map((d, i) => {
    const startAngle = (cumulative / total) * 2 * Math.PI;
    cumulative += d.value;
    const endAngle = (cumulative / total) * 2 * Math.PI;

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const sx = center + radius * Math.cos(startAngle);
    const sy = center + radius * Math.sin(startAngle);
    const ex = center + radius * Math.cos(endAngle);
    const ey = center + radius * Math.sin(endAngle);

    // If slice is zero, skip rendering
    if (!d.value) return null;

    // Handle 100% slice explicitly (start and end coincide)
    const fullSlice = Math.abs(endAngle - startAngle) >= 2 * Math.PI - 1e-6 || d.value === total;

    if (fullSlice) {
      if (fullPie) {
        return { type: 'circle', cx: center, cy: center, r: radius, color: colors[i], label: d.label, value: d.value };
      } else {
        // Donut full ring: draw two arcs to complete the circle and inner cutout
        const midAngle = startAngle + Math.PI;
        const mx = center + radius * Math.cos(midAngle);
        const my = center + radius * Math.sin(midAngle);
        const isx = center + inner * Math.cos(midAngle);
        const isy = center + inner * Math.sin(midAngle);
        const iex = center + inner * Math.cos(startAngle);
        const iey = center + inner * Math.sin(startAngle);
        const path = `M ${sx} ${sy} A ${radius} ${radius} 0 0 1 ${mx} ${my} A ${radius} ${radius} 0 0 1 ${ex} ${ey} L ${isx} ${isy} A ${inner} ${inner} 0 0 0 ${iex} ${iey} Z`;
        return { type: 'path', path, color: colors[i], label: d.label, value: d.value };
      }
    }

    if (fullPie) {
      const path = `M ${center} ${center} L ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} 1 ${ex} ${ey} Z`;
      return { type: 'path', path, color: colors[i], label: d.label, value: d.value };
    } else {
      const isx = center + inner * Math.cos(endAngle);
      const isy = center + inner * Math.sin(endAngle);
      const iex = center + inner * Math.cos(startAngle);
      const iey = center + inner * Math.sin(startAngle);
      const path = `M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} 1 ${ex} ${ey} L ${isx} ${isy} A ${inner} ${inner} 0 ${largeArc} 0 ${iex} ${iey} Z`;
      return { type: 'path', path, color: colors[i], label: d.label, value: d.value };
    }
  });

  return (
    <svg width={size} height={size} role="img" aria-label="Performance distribution" className="drop-shadow-lg">
      {arcs.map((arc, i) => {
        if (!arc) return null;
        return (
          <g key={i}>
            {arc.type === 'circle' ? (
              <circle
                cx={arc.cx}
                cy={arc.cy}
                r={arc.r}
                fill={arc.color}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              >
                <title>{`${arc.label}: ${arc.value}`}</title>
              </circle>
            ) : (
              <path 
                d={arc.path} 
                fill={arc.color}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              >
                <title>{`${arc.label}: ${arc.value}`}</title>
              </path>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function PerformanceChart({ distribution }) {
  const chartData = [
    { label: 'Excellent', value: distribution?.excellent ?? 0 },
    { label: 'Average', value: distribution?.average ?? 0 },
    { label: 'In Process', value: distribution?.in_process ?? 0 },
  ];
  const colors = ['#10b981', '#f59e0b', '#fb923c'];
  const total = chartData.reduce((s, d) => s + d.value, 0) || 0;

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-gray-200 p-5 sm:p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Subtle decorative background (toned down for professional look) */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl shadow-sm">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" strokeWidth={2.5} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Student Performance Distribution
          </h3>
        </div>

        {/* Chart and Legend Container */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8">
          {/* Round Pie Chart */}
          <div className="relative flex-shrink-0">
            <Pie data={chartData} colors={colors} size={184} thickness={0} />
          </div>

          {/* Legend with Enhanced Design */}
          <div className="w-full lg:w-auto space-y-3">
            {chartData.map((d, i) => {
              const percentage = total ? Math.round((d.value / total) * 100) : 0;
              return (
                <div 
                  key={i} 
                  className="group/item flex items-center gap-3 sm:gap-4 p-3 rounded-xl bg-white border border-gray-100 hover:border-orange-200 transition-all duration-200 hover:shadow-md"
                >
                  {/* Color Indicator */}
                  <div 
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg shadow-sm flex-shrink-0" 
                    style={{ backgroundColor: colors[i] }}
                    aria-hidden 
                  />
                  
                  {/* Label */}
                  <span className="text-sm sm:text-base font-semibold text-gray-800 min-w-[67px] sm:min-w-[82px]">
                    {d.label}
                  </span>
                  
                  {/* Value */}
                  <span className="text-base sm:text-lg font-bold text-gray-900 min-w-[30px] text-center">
                    {Number(d.value || 0).toLocaleString()}
                  </span>
                  
                  {/* Percentage Badge */}
                  <span className="ml-auto px-3 py-1 text-xs sm:text-sm font-bold text-orange-700 bg-orange-100 rounded-full">
                    {percentage}%
                  </span>
                </div>
              );
            })}
            {total === 0 && (
              <div className="flex items-center justify-center p-3 mt-4 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-sm sm:text-base font-medium text-gray-600">
                  No performance data available for the selected range
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
