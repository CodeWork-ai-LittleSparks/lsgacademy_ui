"use client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import AddTeacher from "../_components/AddTeacher";

export default function NewTeacherPage() {
  const router = useRouter();
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/teachers")}>{"<"} Back</Button>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Add New Teacher</h1>
        <div />
      </div>
      <AddTeacher onCancel={() => router.push("/teachers")} onSaved={(id) => router.push(`/teachers/${id}`)} />
    </div>
  );
}