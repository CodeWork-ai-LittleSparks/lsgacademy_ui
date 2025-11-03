"use client";
import React from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

export default function Breadcrumb({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-zinc-600">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const content = (
          <div className="inline-flex items-center gap-2">
            {idx === 0 ? <Home className="h-4 w-4" /> : null}
            <span className={isLast ? "font-medium text-zinc-900" : "hover:text-zinc-900"}>{item.label}</span>
          </div>
        );
        return (
          <div key={`${item.label}-${idx}`} className="inline-flex items-center gap-2">
            {isLast ? content : <Link href={item.href || "#"}>{content}</Link>}
            {!isLast && <ChevronRight className="h-4 w-4 text-zinc-400" />}
          </div>
        );
      })}
    </nav>
  );
}
