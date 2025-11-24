"use client";
import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import { getPrograms } from "@/lib/api/services/programService";
import { 
  BookOpen, 
  User, 
  X, 
  Check, 
  AlertCircle, 
  Loader2,
  Link as LinkIcon
} from "lucide-react";

export default function AssignProgramModal({ teacher, isOpen, onClose, onAssign }) {
  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true); setError("");
      try {
        const res = await getPrograms({ limit: 50, page: 1 });
        const list = res.success ? (res.data?.programs || []) : [];
        setPrograms(list);
      } catch (err) {
        setError(err?.message || "Failed to load programs");
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen]);

  if (!isOpen) return null;

  const options = [{ value: "", label: "Select a program" }, ...programs.map((p) => ({ value: p.id || p.program_id, label: p.name }))];

  return (
    <Modal>
      <Card className="bg-white w-full max-w-lg shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="relative overflow-hidden p-6 bg-gradient-to-r from-[#FFF1F1] to-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E9B3FB] to-[#6F00FF] rounded-full blur-3xl opacity-20" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#E9B3FB] to-[#6F00FF]/30 rounded-xl shadow-sm">
                <LinkIcon className="w-5 h-5 text-[#3B0270]" strokeWidth={2.5} />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                Assign Program
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-white/80 rounded-xl transition-all hover:scale-110"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Teacher Info */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#FFF1F1] to-[#E9B3FB]/30 rounded-xl">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <User className="w-5 h-5 text-[#6F00FF]" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Teacher</p>
              <p className="text-sm font-bold text-gray-900">{teacher?.full_name || teacher?.user?.full_name || 'Unknown'}</p>
            </div>
          </div>

          {/* Program Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
              <BookOpen className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              Select Program *
            </label>
            {loading ? (
              <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" strokeWidth={2.5} />
                <span className="text-sm font-semibold text-blue-700">Loading programs...</span>
              </div>
            ) : (
              <Dropdown 
                value={programId} 
                onChange={(e) => setProgramId(e.target.value)} 
                options={options}
                className="w-full px-4 py-3 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all bg-white"
              />
            )}
            <p className="text-xs text-gray-600 mt-2 font-medium">
              {programs.length} program{programs.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-red-200 bg-red-50 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">Assignment Info</p>
                <p className="text-xs text-blue-700 font-medium">
                  This will assign the selected program to the teacher. The teacher will be able to access and manage this program.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 bg-gray-50">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-white text-gray-900 font-bold transition-all"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            Cancel
          </Button>
          <Button 
            variant="primary" 
            disabled={!programId || loading} 
            onClick={() => onAssign(programId)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" strokeWidth={2.5} />
            Assign Program
          </Button>
        </div>
      </Card>
    </Modal>
  );
}
