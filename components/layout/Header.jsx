"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, User, Search, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/authContext";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth() || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [q, setQ] = useState("");
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const { data: notificationsData, refetch: refetchNotifs } = useQuery({
    queryKey: ["notifications", { page: 1, limit: 10, unread_only: false }],
    queryFn: async () => {
      try {
        const res = await apiClient.get("/notifications", { params: { page: 1, limit: 10 } });
        return res; // { success, data: { notifications, pagination } }
      } catch (e) {
        return { success: false, data: { notifications: [], pagination: { unread_count: 0 } } };
      }
    },
    refetchInterval: 30000,
  });
  const notifications = notificationsData?.data?.notifications || [];
  const unreadNotificationsCount = notificationsData?.data?.pagination?.unread_count || 0;

  const openLogoutModal = () => {
    setMenuOpen(false);
    setLogoutOpen(true);
  };

  const confirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      // Modal can close once logout succeeds; navigation will occur
      setLogoutOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
      // Keep modal open if logout failed
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user initials for avatar
  const getUserInitials = (email) => {
    if (!email) return "";
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto max-w-full h-16 px-4 sm:px-6">
        <div className="flex h-full items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <button
              aria-label="Go to Dashboard"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 rounded-xl px-2 py-1 text-gray-800 hover:text-purple-700 transition-colors"
            >           
            </button>
          </div>

          {/* Right: Search + Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/70 px-4 py-2 shadow-sm transition-colors focus-within:border-purple-300 focus-within:bg-white">
              <Search className="h-4 w-4 text-gray-400" aria-hidden />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                aria-label="Search"
                className="w-40 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none focus:w-56 transition-all"
              />
            </div>

            {/* Chat */}
            <button
              aria-label="Open Chat"
              className="relative inline-flex items-center justify-center rounded-xl p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                aria-label="Open Notifications"
                onClick={() => setNotifOpen((v) => !v)}
                className="relative inline-flex items-center justify-center rounded-xl p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 origin-top-right rounded-2xl border border-gray-200 bg-white shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                  <div className="px-4 py-2 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    <p className="text-xs text-gray-500">{unreadNotificationsCount} unread</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={async () => {
                          if (!notification.is_read) {
                            try { await apiClient.put(`/notifications/${notification.id}/read`); } catch {}
                          }
                          if (notification.type === "new_message" && notification.related_data?.conversation_id) {
                            router.push(`/messages?conversation=${notification.related_data.conversation_id}`);
                          } else if (notification.type === "announcement_received" && notification.related_data?.announcement_id) {
                            const role = user?.role;
                            const base = role === "school_admin" ? "/school-announcements" : "/announcements";
                            router.push(`${base}/${notification.related_data.announcement_id}`);
                          }
                          setNotifOpen(false);
                          refetchNotifs();
                        }}
                        className={cn("flex items-start gap-3 p-3 cursor-pointer", !notification.is_read && "bg-blue-50")}
                      >
                        <div className={cn("h-2 w-2 rounded-full mt-2 flex-shrink-0", notification.is_read ? "bg-gray-300" : "bg-blue-500")} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-gray-600 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t">
                    <button
                      className="w-full text-sm text-blue-600 hover:underline"
                      onClick={async () => {
                        try { await apiClient.put(`/notifications/mark-all-read`); toast.success("All notifications marked as read"); } catch {}
                        refetchNotifs();
                      }}
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="inline-flex items-center gap-3 rounded-xl px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white shadow-sm">
                  {getUserInitials(user?.full_name || user?.email)}
                </div>
                <span className="hidden sm:inline font-medium truncate max-w-[160px]">
                  {user?.full_name || user?.email?.split("@")[0] || ""}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-2xl border border-gray-200 bg-white shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                  <div className="p-2">
                    {/* User Info */}
                    <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                        {getUserInitials(user?.email)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.full_name || user?.email?.split("@")[0] || ""}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => {
                          router.push("/profile");
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      >
                        <User className="h-4 w-4 text-gray-400" />
                        Profile
                      </button>
                      <button
                        onClick={openLogoutModal}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4" />
                        {loggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal isOpen={logoutOpen} onClose={loggingOut ? undefined : () => setLogoutOpen(false)} title="Confirm Logout" size="content">
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Are you sure you want to log out of your account?
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setLogoutOpen(false)} disabled={loggingOut}>Cancel</Button>
            <Button variant="danger" onClick={confirmLogout} disabled={loggingOut}>
              {loggingOut ? "Logging out..." : "Log Out"}
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
}

