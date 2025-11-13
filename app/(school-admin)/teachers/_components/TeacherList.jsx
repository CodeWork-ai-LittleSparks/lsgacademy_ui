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
    return [{ value: "", label: "All Programs" }, ...programs.map((p) => ({ value: p.id, label: p.name }))];
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
        <Button size="sm" variant="outline" onClick={() => router.push(`/teachers/${row.id}`)}>View</Button>
        <Button size="sm" variant="secondary" onClick={() => router.push(`/teachers/${row.id}/edit`)}>Edit</Button>
      </div>
    ) },
  ]), [router]);

  const cards = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {teachers.map((t) => (
        <Card key={t.id} className="bg-white border-gray-200 shadow-sm hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">{t.full_name}</div>
              <div className="text-sm text-gray-700">{t.email}</div>
              <div className="text-sm text-gray-700">{t.phone}</div>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${t.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{t.is_active ? "Active" : "Inactive"}</span>
          </div>
          <div className="text-xs text-gray-600 mt-2">Programs: {Array.isArray(t.programs) ? t.programs.length : t.programs_count ?? 0}</div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={() => router.push(`/teachers/${t.id}`)}>View</Button>
            <Button size="sm" onClick={() => router.push(`/teachers/${t.id}/edit`)}>Edit</Button>
          </div>
        </Card>
      ))}
      {teachers.length === 0 && !loading && (
        <div className="text-sm text-gray-700">No teachers found</div>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email" className="w-64" />
        <Dropdown value={programId} onChange={(e) => setProgramId(e.target.value)} options={programOptions} />
        <Dropdown value={status} onChange={(e) => setStatus(e.target.value)} options={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]} />
        <div className="ml-auto flex gap-2">
          <Button variant={view === "table" ? "primary" : "secondary"} onClick={() => setView("table")}>Table</Button>
          <Button variant={view === "cards" ? "primary" : "secondary"} onClick={() => setView("cards")}>Cards</Button>
        </div>
      </div>

      {error ? (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      {view === "table" ? (
        <Card className="bg-white border-gray-200 shadow-sm">
          <DataTable
            columns={columns}
            data={teachers}
            loading={loading}
            initialPageSize={pageSize}
            toolbarActions={[{ label: "Refresh", onClick: () => loadData() }]}
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