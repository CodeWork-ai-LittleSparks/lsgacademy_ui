"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen = true, onClose, title, children, size = 'lg' }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open to prevent background scrollbar
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || '';
    };
  }, [isOpen]);

  const widthMap = {
    sm: 'w-full max-w-md',
    md: 'w-full max-w-lg',
    lg: 'w-full max-w-4xl',
    xl: 'w-full max-w-6xl',
    content: 'w-auto max-w-[90vw]',
  };

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Modal'}
      onClick={() => onClose?.()}
    >
      <div
        className={`bg-white rounded-lg shadow-lg ${widthMap[size] || widthMap.lg} max-h-[calc(100vh-2rem)] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between border-b px-4 py-3">
            {title ? (
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">{title}</h2>
            ) : (
              <span className="sr-only">Dialog</span>
            )}
            {onClose && (
              <button
                type="button"
                aria-label="Close"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => onClose?.()}
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
