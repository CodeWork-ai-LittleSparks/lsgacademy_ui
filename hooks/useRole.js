"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/authContext";
import { STORAGE_KEYS, USER_ROLES } from "@/lib/constants/config";

export function useRole() {
  const auth = (() => {
    try { return useAuth(); } catch { return null; }
  })();

  const [role, setRole] = useState(auth?.user?.role || null);

  useEffect(() => {
    // Prefer role from auth context if available
    if (auth?.user?.role) {
      setRole(auth.user.role);
      return;
    }

    // Fallbacks: localStorage and cookie
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.role) {
            setRole(parsed.role);
            return;
          }
        }
        // Try cookie
        const match = document.cookie.match(/(?:^|; )lsg_user_data=([^;]*)/);
        if (match) {
          const cookieVal = decodeURIComponent(match[1]);
          const parsed = JSON.parse(cookieVal);
          if (parsed?.role) setRole(parsed.role);
        }
      }
    } catch {
      // ignore parsing errors
    }
  }, [auth?.user?.role]);

  const isSuperAdmin = role === USER_ROLES.SUPER_ADMIN || role === "super-admin";
  const isSchoolAdmin = role === USER_ROLES.SCHOOL_ADMIN || role === "school-admin";

  return { role, isSuperAdmin, isSchoolAdmin };
}