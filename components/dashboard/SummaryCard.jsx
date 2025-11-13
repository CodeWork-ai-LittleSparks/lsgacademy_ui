"use client";
import { cn } from '@/lib/utils';
import Card from '@/components/ui/Card';

export default function SummaryCard({ title, value, subtitle, Icon, colorClass = 'text-indigo-600', bgClass = 'bg-indigo-50' }) {
  return (
    <Card className="shadow-sm hover:shadow-md rounded-lg border border-gray-200 p-6 bg-white">
      <div className="flex items-center gap-4">
        <div className={cn('p-3 rounded-lg', bgClass)} aria-hidden>
          {Icon ? <Icon className={cn('w-6 h-6', colorClass)} /> : null}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-700">{title}</div>
          <div className="text-3xl font-bold text-gray-900">{Number(value ?? 0).toLocaleString()}</div>
          {subtitle ? <div className="text-xs text-gray-500 mt-1">{subtitle}</div> : null}
        </div>
      </div>
    </Card>
  );
}

