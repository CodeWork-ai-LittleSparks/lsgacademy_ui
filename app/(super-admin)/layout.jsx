"use client"
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function LayoutContent({ children }) {
  const { minimized } = useSidebar();
  
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <Sidebar role="super-admin" />
      <main 
        className={`pt-16 p-6 transition-all duration-300 ${
          minimized ? 'md:pl-[75px]' : 'md:pl-[225px]'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default function SuperAdminLayout({ children }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
