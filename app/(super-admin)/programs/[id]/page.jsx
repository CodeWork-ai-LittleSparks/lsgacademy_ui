"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import ProgramStats from '@/components/programs/ProgramStats';
import DeleteProgramModal from '@/components/programs/DeleteProgramModal';
import { getProgramById, deleteProgram } from '@/lib/api/services/programService';
import { toPublicAssetUrl } from '@/lib/utils/urlUtils';

export default function ProgramDetailPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params?.id;

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    getProgramById(programId)
      .then((res) => {
        if (!isMounted) return;
        if (res.success) {
          setProgram(res.data);
        } else {
          setError(res.error || 'Failed to load program');
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
  }, [programId]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await deleteProgram(deleteTarget.id);
      if (res.success) {
        setDeleteTarget(null);
        router.push('/programs');
      } else {
        setError(res.error || 'Failed to delete program');
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="aspect-video bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 space-y-3">
        <div className="rounded border border-red-200 bg-red-50 text-red-700 p-3">{error}</div>
        <Button variant="primary" onClick={() => router.push('/programs')}>Back to Programs</Button>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="p-4 space-y-3">
        <div className="rounded border border-yellow-200 bg-yellow-50 text-yellow-800 p-3">Program not found</div>
        <Button variant="primary" onClick={() => router.push('/programs')}>Back to Programs</Button>
      </div>
    );
  }

  const categoryName = program?.category?.name || '';
  const categoryColor = program?.category?.color || '#e5e7eb';
  const createdAt = program?.created_at ? new Date(program.created_at) : null;
  const updatedAt = program?.updated_at ? new Date(program.updated_at) : null;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>{'< Back to Programs'}</Button>
        <div className="flex items-center gap-2">
          <Button variant="primary" onClick={() => router.push(`/programs/${program.id}/edit`)}>Edit</Button>
          <Button variant="danger" onClick={() => setDeleteTarget(program)}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={toPublicAssetUrl(program.thumbnail_url || '')} alt={`${program.name} thumbnail`} className="w-full aspect-video object-cover rounded-lg border" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            {program.name}
            <span className={`text-xs px-2 py-0.5 rounded-full ${program.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {program.is_active ? 'Active' : 'Inactive'}
            </span>
          </h1>
          {categoryName ? (
            <div className="inline-flex items-center gap-2 text-sm text-gray-700">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: categoryColor }} />
              {categoryName}
            </div>
          ) : null}
          <div className="text-sm text-gray-700">Ages {program.age_from} to {program.age_to} • {program.total_levels} Levels</div>
          {createdAt ? (
            <div className="text-xs text-gray-500">Created: {createdAt.toLocaleDateString()} • Updated: {updatedAt?.toLocaleDateString?.() || '-'}</div>
          ) : null}
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{program.description}</p>
      </div>

      {/* Statistics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Program Statistics</h2>
        <ProgramStats statistics={{
          enrolled_schools: program.enrolled_schools,
          total_students: program.total_students,
          total_evaluations: program.total_evaluations,
        }} />
      </div>

      {/* Details List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Program Details</h2>
        <ul className="text-gray-700 space-y-1">
          <li>Total Levels: {program.total_levels}</li>
          <li>Age Range: {program.age_from} to {program.age_to} years</li>
          {program.duration_per_level_weeks ? (
            <li>Duration per Level: {program.duration_per_level_weeks} weeks</li>
          ) : null}
          <li>Category: {categoryName || '-'}</li>
          <li>Status: {program.is_active ? 'Active' : 'Inactive'}</li>
        </ul>
      </div>

      <DeleteProgramModal program={deleteTarget} isOpen={!!deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
