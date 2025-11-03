"use client";

import { Users, GraduationCap, BookOpen, CheckCircle } from "lucide-react";

const formatNumber = (n) => new Intl.NumberFormat().format(n);

export default function SchoolMetrics() {
  const metrics = [
    {
      title: "Total Teachers",
      value: 28,
      icon: Users,
      color: "#14B8A6", // teal
      bg: "bg-[#14B8A6]/10",
      text: "text-[#14B8A6]",
    },
    {
      title: "Total Students",
      value: 450,
      icon: GraduationCap,
      color: "#3B82F6", // blue-500
      bg: "bg-blue-500/10",
      text: "text-blue-500",
    },
    {
      title: "Active Programs",
      value: 12,
      icon: BookOpen,
      color: "#F59E0B", // amber-500
      bg: "bg-amber-500/10",
      text: "text-amber-500",
    },
  ];

  const attendancePercent = 87;
  const attendanceRingStyle = {
    backgroundImage: `conic-gradient(#22c55e ${attendancePercent * 3.6}deg, #e5e7eb 0deg)`,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map(({ title, value, icon: Icon, bg, text }) => (
        <div key={title} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">{title}</p>
              <p className="mt-2 text-3xl font-bold">{formatNumber(value)}</p>
            </div>
            <div className={`h-12 w-12 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`${text} h-6 w-6`} />
            </div>
          </div>
        </div>
      ))}

      {/* Today's Attendance card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">Today's Attendance</p>
            <p className="mt-2 text-3xl font-bold">{attendancePercent}%</p>
          </div>
          <div className="relative h-16 w-16">
            <div
              className="absolute inset-0 rounded-full"
              style={attendanceRingStyle}
            />
            <div className="absolute inset-2 rounded-full bg-white border border-zinc-200 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm text-zinc-500">Present students today</div>
      </div>
    </div>
  );
}