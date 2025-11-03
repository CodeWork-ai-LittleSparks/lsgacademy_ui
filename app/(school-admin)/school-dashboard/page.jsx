"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { ROLES } from "@/lib/constants";

import SchoolMetrics from "./_components/SchoolMetrics";
import QuickActions from "./_components/QuickActions";
import RecentActivity from "./_components/RecentActivity";

import { useMemo } from "react";

export default function SchoolAdminDashboardPage() {
  const today = useMemo(() => new Date(), []);

  const week = useMemo(() => {
    const d = new Date(today);
    const day = d.getDay(); // 0-6, Sun-Sat
    const diffToMonday = (day + 6) % 7; // convert to Monday-based
    d.setDate(d.getDate() - diffToMonday);
    const days = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(d);
      date.setDate(d.getDate() + i);
      return date;
    });
    return days;
  }, [today]);

  const sessions = useMemo(
    () => ({
      // Mock sessions across the week
      1: [
        { time: "09:00", name: "Mathematics", color: "#14B8A6" },
        { time: "11:00", name: "English", color: "#3B82F6" },
      ],
      2: [
        { time: "10:00", name: "Science Lab", color: "#F59E0B" },
        { time: "14:00", name: "History", color: "#3B82F6" },
      ],
      3: [
        { time: "08:30", name: "Physical Education", color: "#22C55E" },
        { time: "13:00", name: "Arts", color: "#F59E0B" },
      ],
      4: [
        { time: "09:30", name: "Computer Science", color: "#6366F1" },
      ],
      5: [
        { time: "10:00", name: "Chemistry", color: "#EF4444" },
        { time: "12:00", name: "Biology", color: "#22C55E" },
      ],
    }),
    []
  );

  const teacherStatus = [
    { name: "Clara Johnson", program: "Mathematics", status: "present" },
    { name: "David Lee", program: "Science", status: "leave" },
    { name: "Priya Singh", program: "English", status: "present" },
    { name: "Ahmed Hassan", program: "History", status: "absent" },
    { name: "Sofia Alvarez", program: "Arts", status: "present" },
  ];

  const students = [
    { name: "Arjun Mehta", grade: "A", programs: 4, attendance: 96, progress: 88 },
    { name: "Lina Park", grade: "A-", programs: 3, attendance: 93, progress: 82 },
    { name: "Ethan Brown", grade: "B+", programs: 3, attendance: 91, progress: 79 },
    { name: "Fatima Noor", grade: "A", programs: 5, attendance: 97, progress: 92 },
    { name: "Mateo Diaz", grade: "B", programs: 2, attendance: 88, progress: 74 },
  ];

  const statusDot = (status) => {
    switch (status) {
      case "present":
        return "bg-green-500";
      case "leave":
        return "bg-yellow-400";
      case "absent":
        return "bg-red-500";
      default:
        return "bg-zinc-300";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Sidebar and Header */}
      <Sidebar role={ROLES.SCHOOL_ADMIN} />
      <Header />

      {/* Main content */}
      <main className="ml-64 pt-16 p-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Dashboard", href: "/school-dashboard" }]} />

        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">School Dashboard</h1>
            <p className="text-lg text-gray-600">Green Valley Public School</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm"
            />
            <span className="text-zinc-500">to</span>
            <input
              type="date"
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm"
            />
            <button className="rounded-md bg-[#14B8A6] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90">
              Apply
            </button>
          </div>
        </div>

        {/* Metrics */}
        <SchoolMetrics />

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Schedule */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Weekly Schedule</h3>
                <span className="text-sm text-zinc-500">
                  Week of {week[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-3">
                {week.map((date, idx) => {
                  const isToday = date.toDateString() === today.toDateString();
                  const key = date.getDay();
                  const daySessions = sessions[key] || [];
                  return (
                    <div key={idx} className={`rounded-lg border p-3 ${isToday ? "border-[#14B8A6]" : "border-zinc-200"}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${isToday ? "text-[#14B8A6]" : "text-zinc-700"}`}>
                          {date.toLocaleDateString(undefined, { weekday: "short" })}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <div className="mt-2 space-y-2">
                        {daySessions.length === 0 && (
                          <div className="text-xs text-zinc-400">No sessions</div>
                        )}
                        {daySessions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => alert(`${s.name} at ${s.time}`)}
                            className="w-full text-left"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                              <span className="text-xs text-zinc-700">{s.time}</span>
                            </div>
                            <div className="mt-1 text-sm">{s.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <RecentActivity />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <QuickActions />
            </div>

            {/* Teacher Status */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Teacher Status</h3>
                <span className="text-sm text-zinc-500">Today</span>
              </div>
              <div className="mt-4 space-y-4">
                {teacherStatus.map((t) => (
                  <div key={t.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${statusDot(t.status)}`} />
                      <div>
                        <p className="font-medium">{t.name}</p>
                        <p className="text-sm text-zinc-500">{t.program}</p>
                      </div>
                    </div>
                    <span className="text-sm capitalize text-zinc-600">{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Student Performance Overview */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Student Performance Overview</h3>
            <a href="/students" className="text-sm font-medium text-[#14B8A6] hover:underline">
              View All Students
            </a>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-zinc-500">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Grade</th>
                  <th className="py-2 pr-4">Programs</th>
                  <th className="py-2 pr-4">Attendance</th>
                  <th className="py-2 pr-4">Progress</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i} className="border-t border-zinc-100">
                    <td className="py-3 pr-4 font-medium">{s.name}</td>
                    <td className="py-3 pr-4">{s.grade}</td>
                    <td className="py-3 pr-4">{s.programs}</td>
                    <td className="py-3 pr-4">{s.attendance}%</td>
                    <td className="py-3 pr-4">
                      <div className="h-2 w-40 rounded bg-zinc-200">
                        <div
                          className="h-2 rounded bg-[#14B8A6]"
                          style={{ width: `${s.progress}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
