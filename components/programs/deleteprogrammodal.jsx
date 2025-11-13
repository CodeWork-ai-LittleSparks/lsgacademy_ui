"use client";
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { AlertTriangle, XCircle, X, Trash2, AlertCircle, School, ExternalLink } from 'lucide-react';

export default function DeleteProgramModal({ program, isOpen, onConfirm, onCancel, loading = false }) {
  if (!isOpen) return null;
  const enrolled = program?.enrolled_schools ?? 0;
  const cannotDelete = enrolled > 0;
  
  return (
    <Modal>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {cannotDelete ? (
          <>
            {/* Cannot Delete - Warning Header */}
            <div className="relative bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-5 border-b-2 border-orange-100">
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/80 transition-colors duration-200 group"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" strokeWidth={2.5} />
              </button>

              <div className="flex items-start gap-4 pr-8">
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg">
                  <AlertCircle className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Cannot Delete Program
                  </h2>
                  <p className="text-sm text-orange-600 font-semibold mt-1">
                    Active enrollments detected
                  </p>
                </div>
              </div>
            </div>

            {/* Cannot Delete - Content */}
            <div className="px-6 py-6 space-y-4">
              <div className="flex items-start gap-3 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl">
                <div className="flex-shrink-0 p-2 bg-orange-100 rounded-lg mt-0.5">
                  <School className="w-5 h-5 text-orange-600" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                    This program is currently used by{' '}
                    <span className="font-bold text-orange-700 px-2 py-0.5 bg-orange-100 rounded">
                      {enrolled} {enrolled === 1 ? 'school' : 'schools'}
                    </span>
                    {' '}with active enrollments.
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Please remove all enrollments before deleting this program.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
                <Button 
                  variant="secondary" 
                  onClick={onCancel}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200 hover:scale-105"
                >
                  Close
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onCancel}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-700 hover:text-orange-800 font-semibold transition-all duration-200 hover:scale-105"
                >
                  <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
                  View Enrolled Schools
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Delete Confirmation - Danger Header */}
            <div className="relative bg-gradient-to-r from-red-50 to-pink-50 px-6 py-5 border-b-2 border-red-100">
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/80 transition-colors duration-200 group"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" strokeWidth={2.5} />
              </button>

              <div className="flex items-start gap-4 pr-8">
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg">
                  <AlertTriangle className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Delete Program?
                  </h2>
                  <p className="text-sm text-red-600 font-semibold mt-1">
                    This action requires confirmation
                  </p>
                </div>
              </div>
            </div>

            {/* Delete Confirmation - Content */}
            <div className="px-6 py-6 space-y-4">
              <div className="space-y-3">
                <p className="text-base text-gray-700 leading-relaxed">
                  Are you sure you want to delete{' '}
                  <span className="font-bold text-gray-900 px-2 py-0.5 bg-gray-100 rounded">
                    {program?.name}
                  </span>
                  ?
                </p>

                {/* Warning Box */}
                <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <div className="flex-shrink-0 mt-0.5">
                    <XCircle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-700 leading-relaxed">
                      This action cannot be undone.
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      All program data and associated records will be permanently deleted.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
                <Button 
                  variant="secondary" 
                  onClick={onCancel} 
                  disabled={loading}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Cancel
                </Button>
                <Button 
                  variant="danger" 
                  onClick={onConfirm} 
                  disabled={loading}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                      <span>Delete Program</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
