"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, BookOpen } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          <div className="h-14 sm:h-16 rounded-lg bg-gray-100 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-video bg-gray-100 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
              <div className="h-4 bg-gray-100 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-3">
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-4 text-sm">{error}</div>
          <Button variant="primary" onClick={() => router.push('/programs')}>Back to Programs</Button>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-3">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800 p-4 text-sm">Program not found</div>
          <Button variant="primary" onClick={() => router.push('/programs')}>Back to Programs</Button>
        </div>
      </div>
    );
  }

  const categoryName = program?.category?.name || '';
  const categoryColor = program?.category?.color || '#e5e7eb';
  const createdAt = program?.created_at ? new Date(program.created_at) : null;
  const updatedAt = program?.updated_at ? new Date(program.updated_at) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Sticky Header */}
      <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={() => router.push('/programs')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors font-semibold group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Back to Programs</span>
              <span className="sm:hidden">Back</span>
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="primary" onClick={() => router.push(`/programs/${program.id}/edit`)}>Edit</Button>
              <Button variant="danger" onClick={() => setDeleteTarget(program)}>Delete</Button>
            </div>
          </div>
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-200">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-purple-700" />
            </div>
            <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                {program.name}
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${program.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {program.is_active ? 'Active' : 'Inactive'}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">View program details and statistics</p>
              <div className="flex items-center gap-3 pt-1">
                <div className="px-2.5 py-1 bg-purple-100 rounded-full border border-purple-200">
                  <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">View</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={toPublicAssetUrl(program.thumbnail_url || '')} alt={`${program.name} thumbnail`} className="block w-full max-w-xl aspect-video object-cover rounded-lg border mx-auto" />
          </div>
          <div className="space-y-2">
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
      </main>
    </div>
  );
}
