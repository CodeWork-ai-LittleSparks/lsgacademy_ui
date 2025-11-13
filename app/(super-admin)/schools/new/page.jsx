"use client";
import { useRouter } from 'next/navigation';
import SchoolForm from '@/components/schools/SchoolForm';

export default function NewSchoolPage() {
  const router = useRouter();
  const onCancel = () => router.push('/schools');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onCancel} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">&lt; Back to Schools</button>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Add New School</h1>
        <div />
      </div>
      <SchoolForm isEditing={false} onCancel={onCancel} onSubmit={() => {}} />
    </div>
  );
}

