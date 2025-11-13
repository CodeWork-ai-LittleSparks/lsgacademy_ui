"use client";
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getProgramLevels, getLevelDetails } from '@/lib/api/services/curriculumService';
import { 
  ArrowLeft, 
  Target, 
  Users, 
  TrendingUp, 
  Edit, 
  BookOpen, 
  Layers,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function ProgramLevelsPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params?.programId;

  const [program, setProgram] = useState(null);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    getProgramLevels(programId)
      .then(async (res) => {
        if (!isMounted) return;
        if (res.success) {
          const { program: p, levels: lvls } = res.data || {};
          setProgram(p || null);
          const sorted = Array.isArray(lvls) ? [...lvls].sort((a, b) => (Number(a.level_number) - Number(b.level_number))) : [];
          setLevels(sorted);
        } else {
          setError(res.error || 'Failed to load levels');
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
  }, [programId]);

  const quickStats = useMemo(() => {
    const totalMilestones = levels.reduce((acc, l) => acc + (Number(l.milestones_count) || 0), 0);
    const totalStudents = levels.reduce((acc, l) => acc + (Number(l.students_count) || 0), 0);
    const rates = levels
      .map((l) => (typeof l.completed_percentage === 'number' ? l.completed_percentage : null))
      .filter((v) => typeof v === 'number');
    const avgCompletion = rates.length ? (rates.reduce((a, b) => a + b, 0) / rates.length) : null;
    return { totalMilestones, totalStudents, avgCompletion };
  }, [levels]);

  const rateColor = (rate) => {
    if (rate == null) return { bg: 'bg-gray-200', text: 'text-gray-600', border: 'border-gray-300' };
    if (rate >= 75) return { bg: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'text-green-700', border: 'border-green-300' };
    if (rate >= 50) return { bg: 'bg-gradient-to-r from-yellow-500 to-amber-500', text: 'text-yellow-700', border: 'border-yellow-300' };
    return { bg: 'bg-gradient-to-r from-red-500 to-pink-500', text: 'text-red-700', border: 'border-red-300' };
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="h-8 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl p-6 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-start gap-3 p-5 rounded-xl border-2 border-red-200 bg-red-50">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-300 hover:bg-gray-50 font-semibold transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
            <BookOpen className="w-6 h-6 text-purple-600" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Program Curriculum
            </h1>
            <p className="text-sm text-gray-600 font-medium mt-0.5">
              {levels.length} levels • Manage content for each level
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="group relative overflow-hidden rounded-2xl border-2 border-purple-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Target className="h-5 w-5 text-purple-600" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Milestones</span>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">{quickStats.totalMilestones}</p>
            <p className="text-sm text-gray-600 font-medium mt-1">Across all levels</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Students</span>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">{quickStats.totalStudents}</p>
            <p className="text-sm text-gray-600 font-medium mt-1">Enrolled in program</p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border-2 border-green-200 bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" strokeWidth={2.5} />
              </div>
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Avg Completion</span>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">
              {quickStats.avgCompletion != null ? `${quickStats.avgCompletion.toFixed(1)}%` : '—'}
            </p>
            <p className="text-sm text-gray-600 font-medium mt-1">Overall progress</p>
          </div>
        </div>
      </div>

      {/* Levels Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-sm">
            <Layers className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            Curriculum Levels
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {levels.map((lvl, index) => {
            const rate = typeof lvl.completed_percentage === 'number' ? lvl.completed_percentage : null;
            const colors = rateColor(rate);
            
            return (
              <Card key={lvl.id} className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-purple-300 bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300">
                {/* Top Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      {/* Level Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-base shadow-sm ${
                          index === 0 
                            ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white' 
                            : 'bg-gradient-to-br from-purple-100 to-blue-100 text-purple-600'
                        }`}>
                          {lvl.level_number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                            {lvl.level_name}
                          </h2>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold text-xs">
                          <Target className="w-3.5 h-3.5" strokeWidth={2.5} />
                          <span>{lvl.milestones_count}</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold text-xs">
                          <Users className="w-3.5 h-3.5" strokeWidth={2.5} />
                          <span>{lvl.students_count}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-gray-600 uppercase tracking-wide">Completion Progress</span>
                          <span className={colors.text}>
                            {rate != null ? `${rate.toFixed(1)}%` : 'N/A'}
                          </span>
                        </div>
                        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full ${colors.bg} transition-all duration-500 ease-out shadow-sm`}
                            style={{ width: `${Math.min(100, Math.max(0, rate || 0))}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                          {rate != null ? (
                            <>
                              {rate >= 75 ? (
                                <CheckCircle className="w-3.5 h-3.5 text-green-600" strokeWidth={2.5} />
                              ) : (
                                <Sparkles className="w-3.5 h-3.5 text-purple-600" strokeWidth={2.5} />
                              )}
                              <span>{rate >= 75 ? 'Excellent progress' : 'In progress'}</span>
                            </>
                          ) : (
                            <span>Completion data unavailable</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <Button 
                      variant="primary" 
                      onClick={() => router.push(`/curriculum/${programId}/${lvl.id}`)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 ml-4"
                    >
                      <Edit className="w-4 h-4" strokeWidth={2.5} />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                  </div>
                </div>

                {/* Chevron Indicator */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight className="w-6 h-6 text-purple-600 animate-pulse" strokeWidth={2.5} />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
