"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSchoolById } from '@/lib/api/services/schoolService';
import SchoolForm from '@/components/schools/SchoolForm';

export default function EditSchoolPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true); setError('');
      const res = await getSchoolById(id);
      if (res.success) setSchool(res.data);
      else setError(res.error || 'School not found');
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const onCancel = () => {
    if (dirty && !confirm('You have unsaved changes. Leave anyway?')) return;
    router.push(`/schools/${id}`);
  };

  if (loading) return <div className="p-6"><div className="h-10 rounded-lg bg-gray-100 animate-pulse" /></div>;
  if (error) return <div className="p-6"><div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">&lt; Back to School</button>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Edit School</h1>
        <div />
      </div>
      <SchoolForm initialData={school} isEditing onCancel={onCancel} onSubmit={() => {}} onDirtyChange={setDirty} />
    </div>
  );
}

