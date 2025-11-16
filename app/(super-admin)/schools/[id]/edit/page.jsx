"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, School, Sparkles } from 'lucide-react';
import { getSchoolById } from '@/lib/api/services/schoolService';
import SchoolForm from '@/components/schools/SchoolForm';

export default function EditSchoolPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true); setError('');
      const res = await getSchoolById(id);
      if (res.success) setSchool(res.data);
      else setError(res.error || 'School not found');
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const onCancel = () => {
    if (dirty && !confirm('You have unsaved changes. Leave anyway?')) return;
    router.push(`/schools/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/20">
        <div className="sticky top-16 z-10 backdrop-blur-sm bg-white/80">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between gap-4">
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
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Edit School</h1>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">Update school details and admin account</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-xl">
                <Sparkles className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Edit</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="aspect-video bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/20">
        <div className="sticky top-16 z-10 backdrop-blur-sm bg-white/80">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <button 
                  onClick={() => router.push('/schools')}
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
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Edit School</h1>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">Update school details and admin account</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-xl">
                <Sparkles className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Edit</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-4 flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/20">
      {/* Modern Header matching Add School */}
      <div className="sticky top-16 z-10 backdrop-blur-sm bg-white/80">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
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
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Edit School</h1>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">Update school details and admin account</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-xl">
              <Sparkles className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Edit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <SchoolForm initialData={school} isEditing onCancel={onCancel} onSubmit={() => {}} onDirtyChange={setDirty} />
      </div>
    </div>
  );
}

