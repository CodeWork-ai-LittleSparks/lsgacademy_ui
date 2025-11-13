"use client";
import { useEffect } from 'react';
import Card from '@/components/ui/Card';
import { AlertTriangle, X, Trash2, Info } from 'lucide-react';

export default function DeleteSchoolModal({ school, isOpen, onConfirm, onCancel }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onCancel?.(); }
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" 
      role="dialog" 
      aria-modal="true"
      onClick={onCancel}
    >
      <Card 
        className="w-full max-w-md rounded-2xl border-2 border-gray-200 bg-white shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="relative bg-gradient-to-r from-red-50 to-pink-50 px-6 py-5 border-b-2 border-red-100 rounded-t-2xl">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/80 transition-colors duration-200 group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" strokeWidth={2.5} />
          </button>

          <div className="flex items-start gap-4 pr-8">
            {/* Warning Icon */}
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg">
              <AlertTriangle className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>

            {/* Title */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                Delete School
              </h3>
              <p className="text-sm text-red-600 font-semibold mt-1">
                This action requires confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Main Message */}
          <div className="space-y-3">
            <p className="text-base text-gray-700 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-bold text-gray-900 px-2 py-0.5 bg-gray-100 rounded">
                {school?.name}
              </span>
              ?
            </p>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <div className="flex-shrink-0 mt-0.5">
                <Info className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-900 font-medium leading-relaxed">
                  This is a soft delete. The data will remain in the system, but the school will be marked as deleted and hidden from view.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
            <button 
              onClick={onCancel} 
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200 hover:scale-105 shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm?.(school)} 
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.5} />
              Delete School
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
