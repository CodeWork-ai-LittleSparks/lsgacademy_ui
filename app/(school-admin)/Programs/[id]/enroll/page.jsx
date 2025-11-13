"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import { getProgramById, getEligibleStudents, enrollStudents } from "@/lib/api/services/programService";
import { getTeachers } from "@/lib/api/services/teacherService";

export default function EnrollStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params?.id;

  const [program, setProgram] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [progRes, teacherRes, studentRes] = await Promise.all([
          getProgramById(programId),
          getTeachers({ status: "active", limit: 50 }),
          getEligibleStudents(programId, { page: 1, limit: 100 }),
        ]);
        if (!mounted) return;
        if (progRes?.success) setProgram(progRes.data);
        if (teacherRes?.success) setTeachers(teacherRes.data?.teachers || []);
        if (studentRes?.success) setCandidates(studentRes.data?.eligible_students || []);
      } catch (e) {
        if (mounted) setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [programId]);

  const filteredCandidates = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((c) => String(c?.full_name || "").toLowerCase().includes(q) || String(c?.roll_number || "").toLowerCase().includes(q));
  }, [search, candidates]);

  const toggleStudent = (id) => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onSubmit = async () => {
    setError(null);
    if (!selectedTeacher) { setError("Please select a teacher"); return; }
    if (!enrollmentDate) { setError("Please select an enrollment date"); return; }
    if (selectedStudentIds.size === 0) { setError("Please select at least one student"); return; }
    setSubmitting(true);
    const res = await enrollStudents(programId, {
      student_ids: Array.from(selectedStudentIds),
      teacher_id: selectedTeacher,
      enrollment_date: enrollmentDate,
    });
    setSubmitting(false);
    if (res?.success) {
      if (typeof window !== "undefined") window.alert(res.message || "Students enrolled successfully");
      router.push(`/Programs/${programId}`);
    } else {
      setError(res?.error || "Enrollment failed");
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push(`/Programs/${programId}`)}>{"< Back to Program"}</Button>
        <div className="text-sm text-gray-600">{program?.name ? `Enroll Students in ${program.name}` : "Enroll Students"}</div>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 text-red-700 p-3">{error}</div>
      )}

      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
            <select className="border rounded px-2 py-2 w-full" value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
              <option value="">Select a teacher</option>
              {teachers.map((t) => {
                const label = t?.user?.full_name || t?.full_name || t?.user?.name || `Teacher`;
                return (
                  <option key={t?.id} value={t?.id}>{label}</option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
            <Input type="date" value={enrollmentDate} onChange={(e) => setEnrollmentDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Students</label>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or roll number" />
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Eligible Students</h2>
          <div className="text-sm text-gray-600">Selected: {selectedStudentIds.size}</div>
        </div>
        {filteredCandidates.length === 0 ? (
          <div className="text-sm text-gray-600">No eligible students found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredCandidates.map((s) => (
              <label key={s?.id} className="flex items-center gap-2 p-2 border rounded">
                <input type="checkbox" checked={selectedStudentIds.has(s?.id)} onChange={() => toggleStudent(s?.id)} />
                <div className="text-sm">
                  <div className="font-medium">{s?.full_name}</div>
                  <div className="text-gray-600">Roll: {s?.roll_number || "-"} • Grade: {s?.grade || "-"}</div>
                </div>
              </label>
            ))}
          </div>
        )}
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={() => router.push(`/Programs/${programId}`)}>Cancel</Button>
        <Button variant="primary" onClick={onSubmit} disabled={submitting}>{submitting ? "Enrolling..." : "Enroll Selected"}</Button>
      </div>
    </div>
  );
}