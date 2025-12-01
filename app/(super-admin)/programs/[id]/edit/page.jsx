"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, BookOpen, Sparkles } from 'lucide-react';
import ProgramForm from '@/components/programs/ProgramForm';
import { getProgramById, updateProgram } from '@/lib/api/services/programService';

export default function EditProgramPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params?.id;
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    getProgramById(programId)
      .then((res) => {
        if (!isMounted) return;
        if (res.success) {
          setProgram(res.data);
        } else {
          setError(res.error || 'Failed to load program');
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
  }, [programId]);

  const handleSubmit = async (payload, thumbnailFile) => {
    // Compute changed fields only
    const updates = {};
    const compare = (key, current, original) => {
      if (typeof current === 'number') {
        if (Number(current) !== Number(original)) updates[key] = current;
      } else if (typeof current === 'boolean') {
        if (!!current !== !!original) updates[key] = current;
      } else {
        if (String(current ?? '') !== String(original ?? '')) updates[key] = current;
      }
    };
    compare('name', payload.name, program.name);
    compare('category_id', payload.category_id, program?.category?.id);
    compare('description', payload.description, program.description);

    const res = await updateProgram(programId, updates, thumbnailFile);
    if (res.success) {
      router.push(`/programs/${programId}`);
    }
    return res;
  };

  const onCancel = () => router.push(`/programs/${programId}`);

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
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Edit Program</h1>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">Update program details and settings</p>
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
                  onClick={() => router.push('/programs')}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700 font-semibold transition-all duration-200 hover:scale-105 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                  <span className="hidden sm:inline">Back</span>
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 sm:p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Edit Program</h1>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">Update program details and settings</p>
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

  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/20">
        <div className="sticky top-16 z-10 backdrop-blur-sm bg-white/80">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  onClick={() => router.push('/programs')}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700 font-semibold transition-all duration-200 hover:scale-105 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                  <span className="hidden sm:inline">Back</span>
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 sm:p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Edit Program</h1>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">Update program details and settings</p>
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
          <div className="rounded border border-yellow-200 bg-yellow-50 text-yellow-800 p-4">
            Program not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/20">
      {/* Sticky Header mirroring Add Program */}
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
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Edit Program</h1>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">Update program details and settings</p>
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
        <ProgramForm initialData={program} isEditing={true} onSubmit={handleSubmit} onCancel={onCancel} />
      </div>
    </div>
  );
}

