"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import ProgramForm from '@/components/programs/ProgramForm';
import { getProgramById, updateProgram } from '@/lib/api/services/programService';

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params?.id;
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (payload, thumbnailFile) => {
    // Compute changed fields only
    const updates = {};
    const compare = (key, current, original) => {
      if (typeof current === 'number') {
        if (Number(current) !== Number(original)) updates[key] = current;
      } else if (typeof current === 'boolean') {
        if (!!current !== !!original) updates[key] = current;
      } else {
        if (String(current ?? '') !== String(original ?? '')) updates[key] = current;
      }
    };
    compare('name', payload.name, program.name);
    compare('category_id', payload.category_id, program?.category?.id);
    compare('description', payload.description, program.description);
    compare('total_levels', payload.total_levels, program.total_levels);
    compare('age_from', payload.age_from, program.age_from);
    compare('age_to', payload.age_to, program.age_to);
    compare('is_active', payload.is_active, program.is_active);

    const res = await updateProgram(programId, updates, thumbnailFile);
    if (res.success) {
      router.push(`/programs/${programId}`);
    }
    return res;
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="aspect-video bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
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

  return (
    <div className="p-4 space-y-4">
      <Button variant="outline" onClick={() => router.push(`/programs/${programId}`)}>{'< Back to Program'}</Button>
      <h1 className="text-xl font-semibold text-gray-900">Edit Program</h1>
      <ProgramForm initialData={program} isEditing={true} onSubmit={handleSubmit} onCancel={() => router.push(`/programs/${programId}`)} />
    </div>
  );
}

