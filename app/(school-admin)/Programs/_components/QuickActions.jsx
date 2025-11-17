"use client";

import { useRouter } from "next/navigation";
import { UserPlus, GraduationCap, ClipboardList, Send, ArrowRight, Sparkles } from "lucide-react";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      label: "Add Teacher",
      description: "Onboard new teaching staff",
      icon: UserPlus,
      color: "#6F00FF",
      gradient: "from-purple-500 to-indigo-600",
      onClick: () => router.push("/teachers"),
    },
    {
      label: "Add Student",
      description: "Enroll new students",
      icon: GraduationCap,
      color: "#3B0270",
      gradient: "from-indigo-600 to-purple-700",
      onClick: () => router.push("/students"),
    },
    {
      label: "Create Evaluation",
      description: "Assess student performance",
      icon: ClipboardList,
      color: "#E9B3FB",
      gradient: "from-pink-400 to-purple-400",
      onClick: () => router.push("/evaluations"),
    },
    {
      label: "Send Notification",
      description: "Broadcast to all teachers",
      icon: Send,
      color: "#6F00FF",
      gradient: "from-purple-500 to-pink-500",
      onClick: () => alert("Notification sent to all teachers."),
    },
  ];

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 bg-gradient-to-br from-[#E9B3FB] to-[#6F00FF]/30 rounded-lg">
          <Sparkles className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
        </div>
        <h2 className="text-base font-bold text-gray-900">Quick Actions</h2>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map(({ label, description, icon: Icon, color, gradient, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-xl text-left transition-all duration-300 hover:scale-[1.02] hover:border-[#6F00FF] overflow-hidden"
          >
            {/* Gradient Background on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
            </div>

            {/* Content */}
            <div className="relative flex items-center gap-4">
              {/* Icon Container */}
              <div
                className="h-14 w-14 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon 
                  className="h-7 w-7 transition-transform duration-300 group-hover:rotate-12" 
                  style={{ color }} 
                  strokeWidth={2.5}
                />
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-gray-900 group-hover:text-[#6F00FF] transition-colors">
                    {label}
                  </p>
                  <ArrowRight 
                    className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" 
                    strokeWidth={2.5}
                  />
                </div>
                <p className="text-sm text-gray-600 font-medium">{description}</p>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 -mr-10 -mt-10">
              <div className={`w-full h-full bg-gradient-to-br ${gradient} blur-2xl`} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
