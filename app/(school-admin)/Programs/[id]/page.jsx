"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgramStats from "@/components/programs/ProgramStats";
import { getProgramById } from "@/lib/api/services/programService";
import { toPublicAssetUrl } from "@/lib/utils/urlUtils";
import {
  ArrowLeft,
  UserPlus,
  BookOpen,
  Calendar,
  Layers,
  Users,
  Building2,
  ClipboardCheck,
  Info,
  Tag,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon
} from "lucide-react";

export default function SchoolProgramDetailPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params?.id;

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getProgramById(programId)
      .then((res) => {
        if (!mounted) return;
        if (res?.success) setProgram(res.data);
        else setError(res?.error || "Failed to load program");
      })
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [programId]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 text-[#6F00FF] animate-spin mb-4" strokeWidth={2.5} />
          <p className="text-sm font-semibold text-gray-600">Loading program details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-start gap-3 p-6 rounded-2xl border border-red-200 bg-red-50">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <div>
            <p className="text-base font-bold text-red-900 mb-1">Error Loading Program</p>
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/Programs")}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold shadow-md hover:shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Back to Programs
        </button>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-start gap-3 p-6 rounded-2xl border border-yellow-200 bg-yellow-50">
          <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <div>
            <p className="text-base font-bold text-yellow-900 mb-1">Program Not Found</p>
            <p className="text-sm font-semibold text-yellow-700">The requested program could not be found</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/Programs")}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold shadow-md hover:shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Back to Programs
        </button>
      </div>
    );
  }

  const categoryName = program?.category?.name || "";
  const categoryColor = program?.category?.color || "#6F00FF";
  const createdAt = program?.created_at ? new Date(program.created_at) : null;
  const updatedAt = program?.updated_at ? new Date(program.updated_at) : null;

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-[#FFF1F1]/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => router.push("/Programs")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 hover:bg-white text-gray-900 font-semibold transition-all"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Back to Programs
        </button>
        <button
          onClick={() => router.push(`/Programs/${program.id}/enroll`)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold shadow-md hover:shadow-lg transition-all"
        >
          <UserPlus className="w-4 h-4" strokeWidth={2.5} />
          Enroll Students
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thumbnail */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-[#E9B3FB] to-[#FFF1F1]">
            {program.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={toPublicAssetUrl(program.thumbnail_url)} 
                alt={`${program.name} thumbnail`} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-400 mb-2" strokeWidth={1.5} />
                <span className="text-sm font-semibold text-gray-400">No Image</span>
              </div>
            )}
          </div>
        </Card>

        {/* Program Info */}
        <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6">
          <div className="space-y-4">
            {/* Title & Status */}
            <div>
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-[#E9B3FB] to-[#6F00FF]/30 rounded-xl flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-[#6F00FF]" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{program.name}</h1>
                  <div className="flex items-center gap-2">
                    {program.is_active ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-green-100 text-green-700 border border-green-300">
                        <CheckCircle2 className="w-3 h-3" strokeWidth={3} />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
                        <XCircle className="w-3 h-3" strokeWidth={3} />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Category */}
              {categoryName && (
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
                  <span 
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold rounded-lg"
                    style={{ 
                      backgroundColor: categoryColor + "20", 
                      color: categoryColor,
                      border: `1px solid ${categoryColor}40`
                    }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColor }} />
                    {categoryName}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
                <Calendar className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
                <div>
                  <p className="text-xs font-bold text-blue-900">Age Range</p>
                  <p className="text-sm font-bold text-gray-900">{program.age_from}-{program.age_to} years</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
                <Layers className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                <div>
                  <p className="text-xs font-bold text-purple-900">Levels</p>
                  <p className="text-sm font-bold text-gray-900">{program.total_levels}</p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            {createdAt && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                  <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span>Created: {createdAt.toLocaleDateString()}</span>
                  {updatedAt && (
                    <>
                      <span>•</span>
                      <span>Updated: {updatedAt.toLocaleDateString()}</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Description */}
      <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
          <div className="p-1.5 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg">
            <Info className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Description</h2>
        </div>
        <p className="text-gray-700 font-medium whitespace-pre-line leading-relaxed">
          {program.description || "No description available"}
        </p>
      </Card>

      {/* Statistics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
            <ClipboardCheck className="w-5 h-5 text-green-600" strokeWidth={2.5} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Program Statistics</h2>
        </div>
        <ProgramStats statistics={{
          enrolled_schools: program.enrolled_schools,
          total_students: program.total_students,
          total_evaluations: program.total_evaluations,
        }} />
      </div>

      {/* Details */}
      <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200">
          <div className="p-1.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Program Details</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#FFF1F1] to-white border border-[#E9B3FB] rounded-xl">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Layers className="w-5 h-5 text-[#6F00FF]" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Total Levels</p>
              <p className="text-lg font-bold text-gray-900">{program.total_levels}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#FFF1F1] to-white border border-[#E9B3FB] rounded-xl">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Calendar className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Age Range</p>
              <p className="text-lg font-bold text-gray-900">{program.age_from} - {program.age_to} years</p>
            </div>
          </div>

          {program.duration_per_level_weeks && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#FFF1F1] to-white border border-[#E9B3FB] rounded-xl">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Clock className="w-5 h-5 text-orange-600" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Duration per Level</p>
                <p className="text-lg font-bold text-gray-900">{program.duration_per_level_weeks} weeks</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#FFF1F1] to-white border border-[#E9B3FB] rounded-xl">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Tag className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Category</p>
              <p className="text-lg font-bold text-gray-900">{categoryName || "Uncategorized"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#FFF1F1] to-white border border-[#E9B3FB] rounded-xl">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              {program.is_active ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" strokeWidth={2.5} />
              ) : (
                <XCircle className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Status</p>
              <p className={`text-lg font-bold ${program.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                {program.is_active ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
