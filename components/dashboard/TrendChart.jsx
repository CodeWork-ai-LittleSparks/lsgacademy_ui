"use client";
import Card from '@/components/ui/Card';

function LineChart({ data, width = 480, height = 200, color = '#6366F1' }) {
  if (!data || data.length === 0) return <div className="text-sm text-gray-500">No data</div>;
  const padding = 24;
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;
  const maxY = Math.max(...data.map((d) => d.count), 1);
  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * usableW;
    const y = padding + usableH - (d.count / maxY) * usableH;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} role="img" aria-label="Daily evaluations trend">
      <rect x={padding} y={padding} width={usableW} height={usableH} fill="#f9fafb" stroke="#e5e7eb" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
      {data.map((d, i) => {
        const x = padding + (i / Math.max(data.length - 1, 1)) * usableW;
        const y = padding + usableH - (d.count / maxY) * usableH;
        return (
          <circle key={i} cx={x} cy={y} r="3" fill={color}>
            <title>{`${d.date}: ${d.count}`}</title>
          </circle>
        );
      })}
    </svg>
  );
}

export default function TrendChart({ title = 'Evaluation Trends (Last 7 Days)', data }) {
  return (
    <Card className="rounded-lg border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <LineChart data={data} />
      </div>
    </Card>
  );
}

