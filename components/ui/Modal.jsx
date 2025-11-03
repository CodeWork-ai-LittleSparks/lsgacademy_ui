"use client";
import { createPortal } from "react-dom";

export default function Modal({ children, onClose }) {
  if (typeof window === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>,
    document.body
  );
}