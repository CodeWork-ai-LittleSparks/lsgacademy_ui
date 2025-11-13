"use client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import TeacherList from "./_components/TeacherList";

export default function TeachersPage() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Teachers</h1>
        <Button variant="primary" onClick={() => router.push("/teachers/new")}>Add Teacher</Button>
      </div>
      <TeacherList />
    </div>
  );
}
