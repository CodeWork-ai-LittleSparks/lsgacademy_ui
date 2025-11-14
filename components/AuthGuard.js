"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { USER_ROLES } from "@/lib/constants/config";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ["/login", "/forgot-password", "/reset-password"];
  const authRoutes = ["/login", "/forgot-password"];

  const superAdminRoutes = [
    "/dashboard",
    "/schools",
    "/programs",
    "/curriculum",
    "/reports",
    "/settings",
  ];

  const schoolAdminRoutes = [
    "/school-dashboard",
    "/teachers",
    "/students",
    "/evaluations",
    "/Programs",
    "/school-reports",
    "/school-settings",
  ];

  useEffect(() => {
    const token =
      Cookies.get("lsg_access_token") ||
      Cookies.get("authTokens");

    const rawUser = Cookies.get("lsg_user_data");
    let role = null;
    try {
      role = rawUser ? JSON.parse(decodeURIComponent(rawUser)).role : null;
    } catch {}

    const isPublic = publicRoutes.some((r) => pathname.startsWith(r));
    const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r));

    // If no token → login
    if (!token && !isPublic && pathname !== "/") {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }

    // Homepage redirect
    if (pathname === "/") {
      if (!token) router.replace("/login");
      else {
        router.replace(
          role === USER_ROLES.SCHOOL_ADMIN ? "/school-dashboard" : "/dashboard"
        );
      }
      return;
    }

    // Auth pages but already logged in
    if (token && isAuthRoute) {
      router.replace(
        role === USER_ROLES.SCHOOL_ADMIN ? "/school-dashboard" : "/dashboard"
      );
      return;
    }

    // Role-based restrictions
    if (role === "school-admin") {
      if (superAdminRoutes.some((r) => pathname.startsWith(r))) {
        if (pathname.startsWith("/programs")) {
          router.replace(pathname.replace("/programs", "/Programs"));
        } else {
          router.replace("/school-dashboard");
        }
        return;
      }
    }

    if (role === "super-admin") {
      if (schoolAdminRoutes.some((r) => pathname.startsWith(r))) {
        router.replace("/dashboard");
        return;
      }
    }
  }, [pathname, router]);

  return <>{children}</>;
}
