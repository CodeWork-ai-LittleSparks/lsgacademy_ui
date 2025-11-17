"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Dropdown from "@/components/ui/Dropdown";
import Input from "@/components/ui/Input";
import { getProgramById, getEligibleStudents, enrollStudents } from "@/lib/api/services/programService";
import { getTeachers } from "@/lib/api/services/teacherService";
import {
  ArrowLeft,
  Search,
  User,
  Calendar,
  Users,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserPlus,
  Check,
  X
} from "lucide-react";

export default function EnrollStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params?.id;

  const [program, setProgram] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [progRes, teacherRes, studentRes] = await Promise.all([
          getProgramById(programId),
          getTeachers({ status: "active", limit: 50 }),
          getEligibleStudents(programId, { page: 1, limit: 100 }),
        ]);
        if (!mounted) return;
        if (progRes?.success) setProgram(progRes.data);
        if (teacherRes?.success) setTeachers(teacherRes.data?.teachers || []);
        if (studentRes?.success) setCandidates(studentRes.data?.eligible_students || []);
      } catch (e) {
        if (mounted) setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [programId]);

  const filteredCandidates = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter((c) => String(c?.full_name || "").toLowerCase().includes(q) || String(c?.roll_number || "").toLowerCase().includes(q));
  }, [search, candidates]);

  const toggleStudent = (id) => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onSubmit = async () => {
    setError(null);
    if (!selectedTeacher) { setError("Please select a teacher"); return; }
    if (!enrollmentDate) { setError("Please select an enrollment date"); return; }
    if (selectedStudentIds.size === 0) { setError("Please select at least one student"); return; }
    setSubmitting(true);
    const res = await enrollStudents(programId, {
      student_ids: Array.from(selectedStudentIds),
      teacher_id: selectedTeacher,
      enrollment_date: enrollmentDate,
    });
    setSubmitting(false);
    if (res?.success) {
      if (typeof window !== "undefined") window.alert(res.message || "Students enrolled successfully");
      router.push(`/Programs/${programId}`);
    } else {
      setError(res?.error || "Enrollment failed");
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 text-[#6F00FF] animate-spin mb-4" strokeWidth={2.5} />
          <p className="text-sm font-semibold text-gray-600">Loading enrollment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-[#FFF1F1]/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/Programs/${programId}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 hover:bg-white text-gray-900 font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Program
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Enroll Students</h1>
            <p className="text-sm text-gray-600 font-medium mt-0.5">
              {program?.name || "Program"}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {/* Enrollment Details */}
      <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200">
          <div className="p-2 bg-gradient-to-br from-[#E9B3FB] to-[#6F00FF]/30 rounded-xl">
            <UserPlus className="w-5 h-5 text-[#6F00FF]" strokeWidth={2.5} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Enrollment Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Teacher Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
              <User className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              Assign Teacher *
            </label>
            <select 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all bg-white" 
              value={selectedTeacher} 
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option value="">Select a teacher</option>
              {teachers.map((t) => {
                const label = t?.user?.full_name || t?.full_name || t?.user?.name || `Teacher`;
                return (
                  <option key={t?.id} value={t?.id}>{label}</option>
                );
              })}
            </select>
          </div>

          {/* Enrollment Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
              <Calendar className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              Enrollment Date *
            </label>
            <Input 
              type="date" 
              value={enrollmentDate} 
              onChange={(e) => setEnrollmentDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all"
            />
          </div>

          {/* Search Students */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
              <Search className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              Search Students
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2.5} />
              <Input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search by name or roll number..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium placeholder:text-gray-500 transition-all"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Student Selection */}
      <Card className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
              <Users className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Eligible Students</h2>
              <p className="text-sm text-gray-600 font-medium">
                {filteredCandidates.length} student{filteredCandidates.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#E9B3FB] text-[#3B0270] rounded-xl font-bold">
            <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
            Selected: {selectedStudentIds.size}
          </div>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-inner mb-4">
              <Users className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-base font-bold text-gray-900 mb-1">No eligible students found</p>
            <p className="text-sm text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCandidates.map((s) => {
              const isSelected = selectedStudentIds.has(s?.id);
              return (
                <label 
                  key={s?.id} 
                  className={`group relative flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'bg-gradient-to-br from-[#FFF1F1] to-[#E9B3FB]/30 border-[#6F00FF] shadow-md' 
                      : 'bg-white border-gray-200 hover:border-[#6F00FF] hover:shadow-sm'
                  }`}
                >
                  {/* Checkbox */}
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={isSelected} 
                      onChange={() => toggleStudent(s?.id)}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 cursor-pointer transition-all"
                    />
                  </div>

                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <div className="p-1.5 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex-shrink-0">
                        <GraduationCap className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{s?.full_name}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-xs text-gray-600 font-semibold">
                            Roll: {s?.roll_number || "-"}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600 font-semibold">
                            Grade: {s?.grade || "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="p-1 bg-[#6F00FF] rounded-full">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
        <button
          onClick={() => router.push(`/Programs/${programId}`)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 hover:bg-white text-gray-900 font-bold transition-all"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting || selectedStudentIds.size === 0}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
              Enrolling...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" strokeWidth={2.5} />
              Enroll Selected ({selectedStudentIds.size})
            </>
          )}
        </button>
      </div>
    </div>
  );
}
