"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { toPublicAssetUrl } from "@/lib/utils/urlUtils";
import { deleteStudent, getStudentById } from "@/lib/api/services/studentService";

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletePrompt, setDeletePrompt] = useState({ open: false, blocked: false, reason: "" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getStudentById(id);
      if (!cancelled) {
        if (res?.success) setStudent(res.data);
        else setError(res?.error || 'Failed to load student');
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const ageText = (dobStr) => {
    if (!dobStr) return '';
    const dob = new Date(dobStr);
    if (Number.isNaN(dob.getTime())) return '';
    const diff = Date.now() - dob.getTime();
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    return `${years} years`;
  };

  const handleDelete = () => {
    const active = (student?.enrollments || []).length > 0;
    if (active) {
      setDeletePrompt({ open: true, blocked: true, reason: `Student has ${student.enrollments.length} active enrollments. Un-enroll first.` });
    } else {
      setDeletePrompt({ open: true, blocked: false, reason: '' });
    }
  };

  const confirmDelete = async () => {
    if (deletePrompt.blocked) { setDeletePrompt({ open: false, blocked: false, reason: '' }); return; }
    const res = await deleteStudent(student.id);
    if (res?.success) {
      router.push('/students');
    } else {
      setError(res?.error || 'Failed to delete student');
      setDeletePrompt({ open: false, blocked: false, reason: '' });
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>;
  if (!student) return null;

  const avatarUrl = student.photo_url ? toPublicAssetUrl(student.photo_url) : null;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/students')}>{`< Back`}</Button>
          <h1 className="text-xl font-semibold">{student.full_name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${student.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{student.is_active ? 'Active' : 'Inactive'}</span>
          <Button variant="primary" onClick={() => router.push(`/students/${student.id}/edit`)}>Edit</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      {/* Profile */}
      <div className="flex flex-col md:flex-row items-start gap-4 bg-white border rounded p-4">
        <div className="w-48 h-48 rounded-lg overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {avatarUrl ? (
            <img src={avatarUrl} alt="Student photo" className="w-48 h-48 object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl text-gray-500">No Photo</div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-700">Roll Number: {student.roll_number} • Grade {student.grade}</div>
          <div className="text-sm text-gray-700">Age: {ageText(student.date_of_birth)} • {String(student.gender || '').toUpperCase()}</div>
          <div className="text-sm text-gray-700">Joined: {student.created_at ? new Date(student.created_at).toLocaleDateString() : '—'}</div>
          <div className="text-sm text-gray-700">School: {student.school?.name || '—'}{student.school?.location ? ` • ${student.school.location}` : ''}</div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="bg-white border rounded p-4 text-center">
          <div className="text-sm text-gray-600">Evaluations</div>
          <div className="text-xl font-semibold">{student.statistics?.total_evaluations ?? 0}</div>
        </div>
        <div className="bg-white border rounded p-4 text-center">
          <div className="text-sm text-gray-600">Programs</div>
          <div className="text-xl font-semibold">{student.statistics?.programs_enrolled ?? (student.enrollments?.length ?? 0)}</div>
        </div>
        <div className="bg-white border rounded p-4 text-center">
          <div className="text-sm text-gray-600">Avg Progress</div>
          <div className="text-xl font-semibold">{typeof student.statistics?.average_progress === 'number' ? `${Math.round(student.statistics.average_progress)}%` : '—'}</div>
        </div>
        <div className="bg-white border rounded p-4 text-center">
          <div className="text-sm text-gray-600">School</div>
          <div className="text-xl font-semibold">{student.school?.name || '—'}</div>
        </div>
      </div>

      {/* Parent Information */}
      <div className="bg-white border rounded p-4 mt-4">
        <h2 className="font-semibold mb-2">Parent Information</h2>
        <div className="text-sm text-gray-700">Name: {student.parent_name || '—'}</div>
        <div className="text-sm text-gray-700">Phone: {student.parent_phone || '—'}</div>
        <div className="text-sm text-gray-700">Email: {student.parent_email || '—'}</div>
        <div className="text-sm text-gray-700">Address: {student.address || '—'}</div>
      </div>

      {/* Enrollments */}
      <div className="bg-white border rounded p-4 mt-4">
        <h2 className="font-semibold mb-3">Program Enrollments ({student.enrollments?.length ?? 0})</h2>
        <div className="space-y-3">
          {(student.enrollments || []).map((en) => (
            <div key={en.id} className="border rounded p-3">
              <div className="font-medium">{en.program?.name} • {en.program?.category}</div>
              <div className="text-sm text-gray-700">Teacher: {en.teacher?.full_name || '—'}</div>
              <div className="text-sm text-gray-700">Current Level: Level {en.current_level?.level_number} - {en.current_level?.level_name}</div>
              <div className="text-sm text-gray-700">Progress: {typeof en.progress_percentage === 'number' ? Math.round(en.progress_percentage) : 0}%</div>
              <div className="text-sm text-gray-700">Performance: {en.performance_category || '—'}</div>
              <div className="text-sm text-gray-700">Enrolled: {en.enrolled_at ? new Date(en.enrolled_at).toLocaleDateString() : '—'}</div>
              <div className="flex gap-2 mt-2">
                <Button variant="outline">View Progress</Button>
                <Button variant="secondary">New Evaluation</Button>
              </div>
            </div>
          ))}
          {(student.enrollments || []).length === 0 && (
            <div className="text-sm text-gray-700">Not enrolled in any programs</div>
          )}
        </div>
      </div>

      {/* Evaluation History */}
      <div className="bg-white border rounded p-4 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Recent Evaluations ({student.recent_evaluations?.length ?? 0})</h2>
          <Button variant="outline">View All</Button>
        </div>
        <div className="space-y-3 mt-2">
          {(student.recent_evaluations || []).slice(0, 5).map((ev) => (
            <div key={ev.id} className="border rounded p-3">
              <div className="font-medium">{ev.program} Level {ev.level} • {ev.performance}</div>
              <div className="text-sm text-gray-700">{ev.evaluated_at ? new Date(ev.evaluated_at).toLocaleDateString() : '—'}</div>
              <Button variant="outline" className="mt-2">View Details</Button>
            </div>
          ))}
          {(student.recent_evaluations || []).length === 0 && (
            <div className="text-sm text-gray-700">No evaluations yet</div>
          )}
        </div>
      </div>

      {deletePrompt.open && (
        <Modal>
          <div className="bg-white rounded-lg p-5 w-[345px]">
            <h3 className="text-lg font-semibold mb-2">{deletePrompt.blocked ? 'Cannot delete student' : `Delete ${student.full_name}?`}</h3>
            <p className="text-sm text-gray-700 mb-4">{deletePrompt.blocked ? deletePrompt.reason : 'This action cannot be undone.'}</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeletePrompt({ open: false, blocked: false, reason: '' })}>Cancel</Button>
              {!deletePrompt.blocked && <Button variant="danger" onClick={confirmDelete}>Delete</Button>}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
