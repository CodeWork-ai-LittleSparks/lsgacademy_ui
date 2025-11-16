"use client";
import { useRouter } from 'next/navigation';
import { ChevronLeft, School, Sparkles } from 'lucide-react';
import SchoolForm from '@/components/schools/SchoolForm';

export default function NewSchoolPage() {
  const router = useRouter();
  const onCancel = () => router.push('/schools');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/20">
      {/* Modern Header */}
      <div className="sticky top-16 z-10 backdrop-blur-sm bg-white/80">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            {/* Back Button & Title */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={onCancel}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700 font-semibold transition-all duration-200 hover:scale-105 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                <span className="hidden sm:inline">Back</span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg">
                  <School className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                    Add New School
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                    Create a new school and set up admin account
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Badge */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-xl">
              <Sparkles className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">New</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <SchoolForm isEditing={false} onCancel={onCancel} onSubmit={() => {}} />
      </div>
    </div>
  );
}
