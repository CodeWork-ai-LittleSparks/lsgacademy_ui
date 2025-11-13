"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { GraduationCap, LayoutGrid, Building2, BookOpen, Settings, Users, Calendar, ChevronRight, Menu, BarChart3, ClipboardList, ChevronLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

const superAdminMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Schools", href: "/schools", icon: Building2 },
  { label: "Programs", href: "/programs", icon: BookOpen },
  { label: "Curriculum", href: "/curriculum", icon: BookOpen },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const schoolAdminMenu = [
  { label: "Dashboard", href: "/school-dashboard", icon: LayoutGrid },
  { label: "Teachers", href: "/teachers", icon: Users },
  { label: "Students", href: "/students", icon: Users },
  { label: "Programs", href: "/Programs", icon: Calendar },
  { label: "Evaluations", href: "/evaluations", icon: ClipboardList },
  { label: "Reports", href: "/school-reports", icon: BarChart3 },
  { label: "Settings", href: "/school-settings", icon: Settings },
];

export default function Sidebar({ role = "super-admin" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const { minimized, setMinimized } = useSidebar();

  const items = role === "school-admin" ? schoolAdminMenu : superAdminMenu;

  return (
    <>
      {/* Mobile toggle */}
      <button
        aria-label="Toggle sidebar"
        onClick={() => setOpen((v) => !v)}
        className="fixed top-4 left-4 z-50 inline-flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm shadow-lg px-3 py-3 md:hidden transition-all duration-200 hover:scale-105 active:scale-95"
        style={{ backgroundColor: '#FFF1F1' }}
      >
        <Menu className="h-5 w-5" style={{ color: '#5B00D1' }} />
      </button>

      <aside
        className={`${open ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-0 z-40 h-screen shadow-2xl transition-all duration-300 ease-in-out md:translate-x-0 ${
          minimized ? 'w-[60px]' : 'w-[210px]'
        }`}
        style={{ 
          background: 'linear-gradient(180deg, #5B00D1 0%, #5B00D1 100%)',
        }}
      >
        {/* Header with Logo only */}
        <div className="flex h-20 items-center px-6 border-b border-white/20 relative pt-10">
          {/* Desktop minimize/expand toggle */}
          <button
            onClick={() => setMinimized(!minimized)}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 items-center justify-center w-6 h-6 rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 z-10"
            style={{ backgroundColor: '#FFF1F1' }}
            aria-label={minimized ? "Expand sidebar" : "Minimize sidebar"}
          >
            {minimized ? (
              <PanelLeftOpen className="h-3 w-3" style={{ color: '#5B00D1' }} />
            ) : (
              <PanelLeftClose className="h-3 w-3" style={{ color: '#5B00D1' }} />
            )}
          </button>

          {/* Centered logo */}
          <div className="flex w-full items-center justify-center mt-5">
            <Image
              src="/images/logo.png"
              alt="LSG Academy"
              width={minimized ? 36 : 120}
              height={minimized ? 36 : 60}
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-20 px-4 space-y-2">
          {items.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link key={href} href={href} className="block group">
                <div
                  className={`
                    flex items-center rounded-xl px-4 py-3.5 transition-all duration-200 transform relative
                    ${active 
                      ? 'bg-white shadow-lg scale-105 translate-x-1' 
                      : 'hover:bg-white/10 hover:scale-105 hover:translate-x-1 active:scale-95'
                    }
                    ${minimized ? 'justify-center' : 'gap-4'}
                  `}
                >
                  <div 
                    className={`
                      flex items-center justify-center rounded-lg transition-all duration-200
                      ${active 
                        ? 'shadow-md' 
                        : 'group-hover:scale-110'
                      }
                      ${minimized ? 'w-8 h-8' : 'w-10 h-10'}
                    `}
                    style={{ 
                      backgroundColor: active ? '#FCE7CF' : 'rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    <Icon 
                      className={`${minimized ? 'h-4 w-4' : 'h-5 w-5'} transition-all duration-200`}
                      style={{ 
                        color: active ? '#5B00D1' : 'white'
                      }} 
                    />
                  </div>
                  
                  {!minimized && (
                    <>
                      <div className="flex-1">
                        <span 
                          className={`
                            font-semibold text-base transition-colors duration-200
                            ${active ? 'text-gray-800' : 'text-white group-hover:text-white'}
                          `}
                        >
                          {label}
                        </span>
                      </div>
                      <ChevronRight 
                        className={`
                          h-4 w-4 transition-all duration-200 transform
                          ${active 
                            ? 'opacity-100 translate-x-1' 
                            : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                          }
                        `}
                        style={{ 
                          color: active ? '#5B00D1' : 'white'
                        }}
                      />
                    </>
                  )}

                  {/* Tooltip for minimized state */}
                  {minimized && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {label}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-2" style={{ backgroundColor: '#C7A7FF' }} />
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}