"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, User, Search, MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/auth/authContext";
import Modal from "@/components/ui/Modal";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth() || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [q, setQ] = useState("");
  const menuRef = useRef(null);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    setConfirmLogoutOpen(true);
  };

  const confirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      // Logout function in context handles redirect
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
      setConfirmLogoutOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get user initials for avatar
  const getUserInitials = (email) => {
    if (!email) return "G";
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Left side - Logo/Brand space */}
        <div className="flex-1">
          {/* Logo or brand can go here */}
        </div>

        {/* Right side - Search and Icons */}
        <div className="flex items-center gap-3">
          {/* Compact Search Bar */}
          <div className="hidden items-center gap-2 rounded-full border border-gray-200 bg-gray-50/50 px-6 py-2 shadow-sm transition-all duration-200 focus-within:border-primary-300 focus-within:bg-white focus-within:shadow-md md:flex">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="w-50 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none focus:w-56 transition-all duration-200"
            />
          </div>

          {/* Chat Icon */}
          <button className="relative inline-flex items-center justify-center p-2 text-gray-600 transition-all duration-200 hover:text-gray-800">
            <MessageCircle className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="relative inline-flex items-center justify-center p-2 text-gray-600 transition-all duration-200 hover:text-gray-800">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white shadow-sm">
              3
            </span>
          </button>

          {/* User Profile Menu */}
          <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex items-center gap-3 px-2 py-2 text-sm text-gray-700 transition-all duration-200 hover:text-gray-900 focus:outline-none"
          >
            {/* Profile Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-semibold text-white shadow-sm">
              {getUserInitials(user?.email)}
            </div>
            <span className="hidden font-medium sm:inline">{user?.name || user?.email?.split("@")[0] || "Guest"}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 origin-top-right animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
              <div className="rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-1">
                  {/* User Info Section */}
                  <div className="px-3 py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-semibold text-white">
                        {getUserInitials(user?.email)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.name || user?.email?.split("@")[0] || "Guest"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || "guest@example.com"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        router.push("/profile");
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-900"
                    >
                      <User className="h-4 w-4 text-gray-400" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-red-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="h-4 w-4" />
                      {loggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
      {confirmLogoutOpen && (
        <Modal onClose={() => setConfirmLogoutOpen(false)}>
          <div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl border border-gray-200">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Are you sure you want to logout?</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">You will be redirected to the login page.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmLogoutOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                disabled={loggingOut}
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </header>
  );
}

