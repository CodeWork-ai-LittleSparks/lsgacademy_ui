"use client";

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      title: "Teacher check-in",
      detail: "Ms. Clara Johnson checked in at 8:05 AM",
      time: "10 min ago",
      type: "checkin",
    },
    {
      id: 2,
      title: "New enrollment",
      detail: "Student Samir Khan enrolled in Mathematics Program",
      time: "30 min ago",
      type: "enrollment",
    },
    {
      id: 3,
      title: "Attendance update",
      detail: "Grade 7 reported 92% attendance for today",
      time: "1 hr ago",
      type: "attendance",
    },
    {
      id: 4,
      title: "Program session",
      detail: "Science Lab session started (Room 204)",
      time: "2 hr ago",
      type: "program",
    },
  ];

  const typeColor = (type) => {
    switch (type) {
      case "checkin":
        return "bg-[#14B8A6]";
      case "enrollment":
        return "bg-blue-500";
      case "attendance":
        return "bg-green-500";
      case "program":
        return "bg-amber-500";
      default:
        return "bg-zinc-300";
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <span className="text-sm text-zinc-500">Today</span>
      </div>

      <div className="mt-4 space-y-4">
        {activities.map((item) => (
          <div key={item.id} className="flex items-start gap-4">
            <div className={`h-2 w-2 rounded-full mt-2 ${typeColor(item.type)}`} />
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-zinc-600">{item.detail}</p>
            </div>
            <span className="text-xs text-zinc-500 whitespace-nowrap">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}