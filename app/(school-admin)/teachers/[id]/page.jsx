"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getTeacherById, updateTeacher, assignProgram } from "@/lib/api/services/teacherService";
import AssignProgramModal from "../_components/AssignProgramModal";

export default function TeacherDetailPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params?.id;
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadTeacher = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await getTeacherById(teacherId);
      if (res.success) setTeacher(res.data);
      else setError(res.error || "Failed to load teacher");
    } catch (err) {
      setError(err?.message || "Unable to load teacher");
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => { loadTeacher(); }, [loadTeacher]);

  const toggleActive = async () => {
    if (!teacher) return;
    setSaving(true);
    const currentActive = !!(teacher?.user?.is_active ?? teacher?.is_active);
    const res = await updateTeacher(teacher.id, { is_active: !currentActive });
    setSaving(false);
    if (res.success) {
      setTeacher((t) => ({ ...t, user: { ...(t?.user || {}), is_active: !currentActive } }));
    }
  };

  const handleAssign = async (programId) => {
    if (!teacher) return;
    setSaving(true);
    const res = await assignProgram(teacher.id, programId);
    setSaving(false);
    setAssignOpen(false);
    if (res.success) {
      // Refresh to reflect assignment
      loadTeacher();
    }
  };

  if (loading) return <div className="p-6"><div className="h-16 rounded bg-gray-100 animate-pulse" /></div>;
  if (error) return <div className="p-6"><div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl md:text-2xl font-semibold text-gray-900">{teacher?.user?.full_name}</div>
          <div className="text-sm text-gray-700">{teacher?.user?.email} • {teacher?.user?.phone}</div>
          <div className="text-xs text-gray-600">Employee ID: {teacher?.employee_id} • School: {teacher?.school?.name} ({teacher?.school?.location})</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/teachers")}>{"<"} Back</Button>
          <Button onClick={() => router.push(`/teachers/${teacher.id}/edit`)}>Edit</Button>
          <Button variant={(teacher?.user?.is_active ?? teacher?.is_active) ? "danger" : "primary"} disabled={saving} onClick={toggleActive}>
            {(teacher?.user?.is_active ?? teacher?.is_active) ? "Deactivate" : "Activate"}
          </Button>
          <Button variant="secondary" onClick={() => setAssignOpen(true)}>Assign Program</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-white text-center">
          <div className="text-sm text-gray-600">Programs</div>
          <div className="text-xl font-semibold">{Array.isArray(teacher?.programs) ? teacher.programs.length : teacher?.programs_count ?? 0}</div>
        </Card>
        <Card className="bg-white text-center">
          <div className="text-sm text-gray-600">Students</div>
          <div className="text-xl font-semibold">{teacher?.statistics?.students_taught ?? 0}</div>
        </Card>
        <Card className="bg-white text-center">
          <div className="text-sm text-gray-600">Evaluations</div>
          <div className="text-xl font-semibold">{teacher?.statistics?.evaluations_completed ?? 0}</div>
        </Card>
        <Card className="bg-white text-center">
          <div className="text-sm text-gray-600">Status</div>
          <div className="text-xl font-semibold">{(teacher?.user?.is_active ?? teacher?.is_active) ? "Active" : "Inactive"}</div>
        </Card>
      </div>

      {/* Programs */}
      <Card className="bg-white">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Programs</h2>
          <Button variant="outline" onClick={() => setAssignOpen(true)}>Assign</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
          {(teacher?.programs || []).map((p) => (
            <Card key={p.id} className="bg-white">
              <div className="font-medium text-gray-900">{p.name}</div>
              <div className="text-sm text-gray-700">Category: {p.category ?? "—"}</div>
            </Card>
          ))}
          {(teacher?.programs || []).length === 0 && (
            <div className="text-sm text-gray-700">No programs assigned</div>
          )}
        </div>
      </Card>

      {/* Students (when available) */}
      <Card className="bg-white">
        <h2 className="font-semibold">Students</h2>
        <div className="space-y-2 mt-2">
          {(teacher?.students || []).map((s) => (
            <div key={s.id} className="flex items-center justify-between border rounded p-2">
              <div>
                <div className="font-medium">{s.full_name}</div>
                <div className="text-xs text-gray-600">Roll {s.roll_number}</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => router.push(`/students/${s.id}`)}>View</Button>
            </div>
          ))}
          {(teacher?.students || []).length === 0 && (
            <div className="text-sm text-gray-700">No students linked</div>
          )}
        </div>
      </Card>

      <AssignProgramModal teacher={teacher} isOpen={assignOpen} onClose={() => setAssignOpen(false)} onAssign={handleAssign} />
    </div>
  );
}