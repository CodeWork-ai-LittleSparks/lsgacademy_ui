"use client";
import { useState } from "react";
import { useAnnouncements } from "@/lib/hooks/useAnnouncements";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AnnouncementCard from "@/components/messaging/AnnouncementCard";
import { Megaphone, Plus, RefreshCw, Filter } from "lucide-react";

export default function AnnouncementsPage() {
  const router = useRouter();
  const [mode, setMode] = useState("sent");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [unread, setUnread] = useState(false);
  const [active, setActive] = useState(true);
  const { data, isLoading, refetch } = useAnnouncements({ mode: "sent", page: 1, limit: 20, priority: priority || undefined, active_only: active || undefined, search: debouncedSearch || undefined });
  const announcements = Array.isArray(data?.announcements)
    ? data.announcements
    : Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data?.items)
    ? data.data.items
    : Array.isArray(data)
    ? data
    : [];

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/20">
      <div className="max-w-full mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg">
                <Megaphone className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                  Announcements
                </h1>
                <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">
                  {mode === "received" ? "View announcements sent to you" : "Manage your sent announcements"}
                </p>
              </div>
            </div>
            <Button 
              onClick={() => router.push("/announcements/create")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} />
              <span>New Announcement</span>
            </Button>
          </div>

          {/* Info Bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl shadow-sm">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
            <p className="text-sm font-semibold text-gray-700">
              Viewing: <span className="font-bold text-blue-700">{mode === "received" ? "Received" : "Sent"} announcements</span>
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Filters:</span>
            </div>
            <div className="flex-1 min-w-64">
              <Input 
                placeholder="Search announcements..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <select 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)} 
              className="border-2 border-gray-300 rounded-xl px-3 py-2 text-sm font-medium hover:border-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="">All priorities</option>
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
            </select>
            <label className="text-sm flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={active} 
                onChange={(e) => setActive(e.target.checked)} 
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              /> 
              <span className="font-medium text-gray-700">Active Only</span>
            </label>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 font-semibold"
            >
              <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
              <span>Refresh</span>
            </Button>
          </div>

          {/* Announcements List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl animate-pulse border border-gray-200" />
              ))}
            </div>
          ) : announcements.length ? (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <AnnouncementCard 
                  key={announcement.id} 
                  announcement={announcement} 
                  mode={mode} 
                  onClick={() => router.push(`/announcements/${announcement.id}`)} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-white to-gray-50">
              <div className="p-5 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl mb-4 shadow-inner">
                <Megaphone className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" strokeWidth={1.5} />
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-600 mb-2">No announcements found</p>
              <p className="text-sm sm:text-base text-gray-500 text-center max-w-md mb-6">
                {mode === "sent" 
                  ? "Get started by creating your first announcement" 
                  : "No announcements have been sent to you yet"}
              </p>
              {mode === "sent" && (
                <Button 
                  onClick={() => router.push("/announcements/create")}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
                >
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                  <span>Create Your First Announcement</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}