"use client";

import { useRouter } from "next/navigation";
import { UserPlus, GraduationCap, ClipboardList, Send } from "lucide-react";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      label: "Add Teacher",
      icon: UserPlus,
      color: "#14B8A6",
      onClick: () => router.push("/teachers"),
    },
    {
      label: "Add Student",
      icon: GraduationCap,
      color: "#3B82F6",
      onClick: () => router.push("/students"),
    },
    {
      label: "Create Evaluation",
      icon: ClipboardList,
      color: "#F59E0B",
      onClick: () => router.push("/evaluations"),
    },
    {
      label: "Send Notification",
      icon: Send,
      color: "#22C55E",
      onClick: () => alert("Notification sent to all teachers."),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {actions.map(({ label, icon: Icon, color, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm text-left hover:border-zinc-300 transition"
        >
          <div className="flex items-center gap-4">
            <div
              className="h-12 w-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}1A` }}
            >
              <Icon className="h-6 w-6" style={{ color }} />
            </div>
            <div>
              <p className="font-medium">{label}</p>
              <p className="text-sm text-zinc-500">Quick action</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}