"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import ProgramForm from '@/components/programs/ProgramForm';
import { createProgram } from '@/lib/api/services/programService';

export default function NewProgramPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (payload, thumbnailFile) => {
    const res = await createProgram(payload, thumbnailFile);
    if (res.success) {
      const created = res.data?.program || res.data;
      router.push(`/programs/${created.id}`);
    }
    return res;
  };

  return (
    <div className="p-4 space-y-4">
      <Button variant="outline" onClick={() => router.back()}>{'< Back to Programs'}</Button>
      <h1 className="text-xl font-semibold text-gray-900">Create New Program</h1>
      {error ? <div className="rounded border border-red-200 bg-red-50 text-red-700 p-3">{error}</div> : null}
      <ProgramForm isEditing={false} onSubmit={handleSubmit} onCancel={() => router.push('/programs')} />
    </div>
  );
}
