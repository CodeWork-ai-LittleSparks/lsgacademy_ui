"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSchoolById, deleteSchool } from '@/lib/api/services/schoolService';
import SchoolHeader from '@/components/schools/SchoolHeader';
import SchoolContact from '@/components/schools/SchoolContact';
import SchoolStats from '@/components/schools/SchoolStats';
import SchoolAdmin from '@/components/schools/SchoolAdmin';
import SchoolPrograms from '@/components/schools/SchoolPrograms';
import ActivityFeed from '@/components/schools/ActivityFeed';
import DeleteSchoolModal from '@/components/schools/DeleteSchoolModal';

export default function SchoolDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  const onEdit = () => router.push(`/schools/${id}/edit`);
  const onDelete = () => setDeleteTarget(school);
  const confirmDelete = async () => {
    if (!school) return;
    const res = await deleteSchool(school.id);
    setDeleteTarget(null);
    if (res.success) router.push('/schools');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          <div className="h-14 sm:h-16 rounded-lg bg-gray-100 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
          <div className="h-40 rounded-lg bg-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SchoolHeader school={school} onEdit={onEdit} onDelete={onDelete} onBack={() => router.push('/schools')} />
      <main className="max-w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <SchoolContact school={school} />

        {(() => {
          const stats = school ? {
            total_students: school.students_count,
            total_teachers: school.teachers_count,
            total_programs: school.programs_count,
            active_enrollments: school.evaluations_completed,
          } : null;
          return <SchoolStats statistics={stats} />;
        })()}

        <SchoolAdmin admin={school?.admin} />

        {/* Programs list not in payload; component renders nothing when absent */}
        <SchoolPrograms programs={school?.programs} />

        {/* Activity feed not in payload; component renders nothing when absent */}
        <ActivityFeed items={school?.recent_activity} />

        <DeleteSchoolModal school={deleteTarget} isOpen={!!deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
      </main>
    </div>
  );
}
