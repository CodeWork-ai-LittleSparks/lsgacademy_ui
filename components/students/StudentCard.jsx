"use client";
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { toPublicAssetUrl } from '@/lib/utils/urlUtils';

function getInitials(name) {
  if (!name) return 'S';
  const parts = String(name).trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : '';
  return (first + last).toUpperCase();
}

function perfStars(category) {
  const map = { excellent: 5, good: 4, average: 3, learning: 2, in_process: 2, none: 0 };
  const count = map[String(category || '').toLowerCase()] ?? 0;
  if (count <= 0) return 'No Evaluations';
  return '⭐'.repeat(count);
}

export default function StudentCard({ student, onView, onEdit, onDelete }) {
  const {
    id,
    full_name,
    roll_number,
    grade,
    photo_url,
    enrollments_count,
    latest_performance,
    is_active,
  } = student || {};

  const avatarUrl = photo_url ? toPublicAssetUrl(photo_url) : null;
  const name = full_name || 'Student';

  return (
    <div className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        className="p-4 w-full flex flex-col items-center text-center gap-2"
        onClick={() => onView?.(student)}
        aria-label={`Open ${name} details`}
      >
        <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={`${name} photo`} width={144} height={144} className="object-cover w-36 h-36" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-500">
              {getInitials(name)}
            </div>
          )}
        </div>
        <div className="w-full px-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-900 truncate" title={name}>{name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{is_active ? 'Active' : 'Inactive'}</span>
          </div>
          <div className="text-sm text-gray-700">Roll: {roll_number || '-'}</div>
          <div className="text-sm text-gray-700">Grade {grade ?? '-'}</div>
          <div className="text-sm text-gray-700">{Number(enrollments_count || 0)} Program{Number(enrollments_count || 0) !== 1 ? 's' : ''}</div>
          <div className="text-sm text-gray-700">{perfStars(latest_performance)} {latest_performance ? String(latest_performance).charAt(0).toUpperCase() + String(latest_performance).slice(1) : ''}</div>
        </div>
      </button>
      <div className="p-3 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => onView?.(student)}>View Details</Button>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => onEdit?.(student)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => onDelete?.(student)}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

