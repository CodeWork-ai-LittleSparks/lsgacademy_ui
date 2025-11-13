"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import AddTeacher from "../../_components/AddTeacher";
import { getTeacherById } from "@/lib/api/services/teacherService";

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params?.id;
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
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
    })();
  }, [teacherId]);

  if (loading) return <div className="p-6"><div className="h-16 rounded bg-gray-100 animate-pulse" /></div>;
  if (error) return <div className="p-6"><div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div></div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push(`/teachers/${teacherId}`)}>{"<"} Back</Button>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Edit Teacher</h1>
        <div />
      </div>
      <AddTeacher teacher={teacher} isEditing onCancel={() => router.push(`/teachers/${teacherId}`)} onSaved={() => router.push(`/teachers/${teacherId}`)} />
    </div>
  );
}