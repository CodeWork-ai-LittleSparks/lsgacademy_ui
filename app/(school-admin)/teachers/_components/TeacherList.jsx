"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import DataTable from "@/components/common/DataTable";
import { getTeachers } from "@/lib/api/services/teacherService";
import { getPrograms } from "@/lib/api/services/programService";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Eye, 
  Edit, 
  RefreshCw,
  AlertCircle,
  Users
} from "lucide-react";

export default function TeacherList() {
  const router = useRouter();
  const [view, setView] = useState("table"); // 'table' | 'cards'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [programs, setPrograms] = useState([]);

  // Filters
  const [search, setSearch] = useState("");
  const [programId, setProgramId] = useState("");
  const [status, setStatus] = useState("all"); // active|inactive|all
  const [pageSize, setPageSize] = useState(10); // default limit=10

  const loadData = async (opts = {}) => {
    setLoading(true); setError("");
    try {
      const effectiveLimit = Number(opts.limit ?? pageSize) || 10;
      const [tRes, pRes] = await Promise.all([
        getTeachers({ limit: effectiveLimit, page: 1, search: search || undefined, program_id: programId || undefined, status: status === "all" ? undefined : status, sort_by: 'name', sort_order: 'asc' }),
        getPrograms({ limit: 50, page: 1 }),
      ]);
      const tList = tRes.success ? (tRes.data?.teachers || tRes.data || []) : [];
      const pList = pRes.success ? (pRes.data?.programs || []) : [];
      setTeachers(tList);
      setPrograms(pList);
      if (!tRes.success) setError(tRes.error || "Failed to load teachers");
    } catch (err) {
      setError(err?.message || "Unable to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [search, programId, status]);

  const programOptions = useMemo(() => {
    return [{ value: "", label: "All Programs" }, ...programs.map((p) => ({ value: p.id || p.program_id, label: p.name }))];
  }, [programs]);

  const columns = useMemo(() => ([
    { id: "full_name", header: "Name", accessorFn: (r) => r?.user?.full_name, type: "text", sortable: true, filterable: true },
    { id: "email", header: "Email", accessorFn: (r) => r?.user?.email, type: "text", sortable: true, filterable: true },
    { id: "phone", header: "Phone", accessorFn: (r) => r?.user?.phone, type: "text", sortable: true, filterable: true },
    { id: "programs", header: "Programs", accessorFn: (r) => r?.programs_count ?? (Array.isArray(r?.programs) ? r.programs.length : 0), type: "number", sortable: true },
    { id: "is_active", header: "Active", accessorFn: (r) => !!r?.user?.is_active, type: "boolean", sortable: true, filterable: true },
    { id: "joined_at", header: "Joined", accessorFn: (r) => r?.joined_at ? new Date(r.joined_at).toLocaleDateString() : "—", type: "date", sortable: true },
    { id: "actions", header: "", type: "actions", cell: (_v, row) => (
      <div className="flex gap-2 justify-end">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => router.push(`/teachers/${row.id}`)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[#6F00FF] hover:bg-[#FFF1F1] font-semibold text-xs transition-all"
        >
          <Eye className="w-3.5 h-3.5" strokeWidth={2.5} />
          View
        </Button>
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={() => router.push(`/teachers/${row.id}/edit`)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E9B3FB] text-[#3B0270] hover:bg-[#6F00FF] hover:text-white font-semibold text-xs transition-all"
        >
          <Edit className="w-3.5 h-3.5" strokeWidth={2.5} />
          Edit
        </Button>
      </div>
    ) },
  ]), [router]);

  const cards = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {teachers.map((t) => (
        <Card key={t.id} className="bg-white shadow-md hover:shadow-xl hover:border-[#6F00FF] transition-all duration-200 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#E9B3FB] to-[#6F00FF]/30 rounded-xl shadow-sm">
                <User className="w-5 h-5 text-[#3B0270]" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-base">{t.full_name || t?.user?.full_name}</div>
                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-bold mt-1 ${
                  (t.is_active ?? t?.user?.is_active) 
                    ? "bg-green-100 text-green-700 border border-green-300" 
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${(t.is_active ?? t?.user?.is_active) ? 'bg-green-500' : 'bg-gray-500'}`} />
                  {(t.is_active ?? t?.user?.is_active) ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              <span className="font-medium truncate">{t.email || t?.user?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              <span className="font-medium">{t.phone || t?.user?.phone || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              <span className="font-bold text-gray-900">
                {Array.isArray(t.programs) ? t.programs.length : t.programs_count ?? 0} Programs
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => router.push(`/teachers/${t.id}`)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[#6F00FF] hover:bg-[#FFF1F1] font-semibold transition-all"
            >
              <Eye className="w-4 h-4" strokeWidth={2.5} />
              View
            </Button>
            <Button 
              size="sm" 
              onClick={() => router.push(`/teachers/${t.id}/edit`)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-semibold transition-all"
            >
              <Edit className="w-4 h-4" strokeWidth={2.5} />
              Edit
            </Button>
          </div>
        </Card>
      ))}
      {teachers.length === 0 && !loading && (
        <div className="col-span-full flex flex-col items-center justify-center py-12">
          <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-inner mb-3">
            <Users className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
          </div>
          <p className="text-base font-bold text-gray-900 mb-1">No teachers found</p>
          <p className="text-sm text-gray-600">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Filters Section */}
      <Card className="bg-white shadow-lg rounded-2xl p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
              <Search className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2.5} />
              <Input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search by name or email..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium placeholder:text-gray-500 transition-all"
              />
            </div>
          </div>

          {/* Program Filter */}
          <div className="lg:w-56">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
              <BookOpen className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              Program
            </label>
            <Dropdown 
              value={programId} 
              onChange={(e) => setProgramId(e.target.value)} 
              options={programOptions}
              className="w-full px-4 py-3 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all bg-white"
            />
          </div>

          {/* Status Filter */}
          <div className="lg:w-40">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">
              <Filter className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              Status
            </label>
            <Dropdown 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              options={[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              className="w-full px-4 py-3 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all bg-white"
            />
          </div>

          {/* View Toggle */}
          <div className="lg:w-auto">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wide mb-2 opacity-0 pointer-events-none">
              View
            </label>
            <div className="flex gap-2">
              <Button 
                variant={view === "table" ? "primary" : "secondary"} 
                onClick={() => setView("table")}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
                  view === "table" 
                    ? 'bg-gradient-to-r from-[#6F00FF] to-[#3B0270] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <List className="w-4 h-4" strokeWidth={2.5} />
                Table
              </Button>
              <Button 
                variant={view === "cards" ? "primary" : "secondary"} 
                onClick={() => setView("cards")}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
                  view === "cards" 
                    ? 'bg-gradient-to-r from-[#6F00FF] to-[#3B0270] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-4 h-4" strokeWidth={2.5} />
                Cards
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-red-200 bg-red-50 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {/* Data Display */}
      {view === "table" ? (
        <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <DataTable
            columns={columns}
            data={teachers}
            loading={loading}
            initialPageSize={pageSize}
            toolbarActions={[{ 
              label: "Refresh", 
              onClick: () => loadData(),
              icon: RefreshCw
            }]}
            enableExport={true}
            onRowClick={(row) => router.push(`/teachers/${row.id}`)}
            onPageSizeChange={(n) => { setPageSize(n); loadData({ limit: n }); }}
          />
        </Card>
      ) : (
        cards
      )}
    </div>
  );
}
