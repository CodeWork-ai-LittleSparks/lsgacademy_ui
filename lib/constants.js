export const ROLES = { SUPER_ADMIN: "super-admin", SCHOOL_ADMIN: "school-admin" };
export const DASHBOARD_ROUTES = { SUPER_ADMIN: "/dashboard", SCHOOL_ADMIN: "/school-dashboard" };

// Centralized sidebar navigation for both roles.
// Icons are provided as lucide-react icon names to keep this module UI-agnostic;
// UI components can map names to actual icon components.
export const SIDEBAR_MENU = {
  SUPER_ADMIN: [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutGrid" },
    { label: "Schools", href: "/schools", icon: "Building2" },
    { label: "Programs", href: "/programs", icon: "BookOpen" },
    { label: "Curriculum", href: "/curriculum", icon: "BookOpen" },
    { label: "Reports", href: "/reports", icon: "FileChart" },
    { label: "Settings", href: "/settings", icon: "Settings" },
  ],
  SCHOOL_ADMIN: [
    { label: "Dashboard", href: "/school-dashboard", icon: "LayoutGrid" },
    { label: "Teachers", href: "/teachers", icon: "Users" },
    { label: "Students", href: "/students", icon: "GraduationCap" },
    { label: "Schedule", href: "/schedule", icon: "Calendar" },
    { label: "Programs", href: "/programs", icon: "BookOpen" },
    { label: "Evaluations", href: "/evaluations", icon: "ClipboardList" },
    { label: "Reports", href: "/reports", icon: "FileChart" },
    { label: "Settings", href: "/settings", icon: "Settings" },
  ],
};

// Protected routes must align with the sidebar structure and middleware checks.
export const PROTECTED_ROUTES = {
  SUPER_ADMIN: [
    "/dashboard",
    "/schools",
    "/programs",
    "/curriculum",
    "/reports",
    "/settings",
  ],
  SCHOOL_ADMIN: [
    "/school-dashboard",
    "/teachers",
    "/students",
    "/schedule",
    "/programs",
    "/evaluations",
    "/reports",
    "/settings",
  ],
};