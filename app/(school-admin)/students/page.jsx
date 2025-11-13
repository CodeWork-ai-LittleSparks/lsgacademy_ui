"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/common/DataTable";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { toPublicAssetUrl } from "@/lib/utils/urlUtils";
import { getStudents, deleteStudent } from "@/lib/api/services/studentService";

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const loadStudents = async (limitOverride) => {
    setLoading(true); setError(null);
    const limit = limitOverride ?? pageSize;
    const res = await getStudents({ page: 1, limit });
    if (res?.success) {
      const list = res.data?.students || res.data || [];
      setStudents(Array.isArray(list) ? list : []);
    } else {
      setError(res?.error || "Failed to load students");
    }
    setLoading(false);
  };

  useEffect(() => { loadStudents(); }, []);

  const handleView = (row) => router.push(`/students/${row.id}`);
  const handleEdit = (row) => router.push(`/students/${row.id}/edit`);
  const handleDelete = (row) => {
    const active = (row?.active_enrollments ?? 0) > 0;
    const enrolled = (row?.enrollments_count ?? row?.enrollment_count ?? 0) > 0;
    if (active || enrolled) {
      setDeleteTarget({ ...row, blockedReason: "Cannot delete a student with active enrollments." });
    } else {
      setDeleteTarget(row);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleteTarget.blockedReason) { setDeleteTarget(null); return; }
    setDeleting(true);
    const res = await deleteStudent(deleteTarget.id);
    setDeleting(false);
    if (res?.success) {
      setStudents((list) => list.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } else {
      alert(res?.error || "Delete failed");
    }
  };

  const columns = useMemo(() => ([
    {
      id: 'student', header: 'Student', type: 'text', sortable: true, filterable: true,
      accessorFn: (row) => row?.full_name || '',
      cell: (v, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={row?.photo_url ? toPublicAssetUrl(row.photo_url) : '/favicon.ico'} alt={row?.full_name || 'Student'} className="object-cover w-full h-full" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{row?.full_name || '-'}</div>
            <div className="text-xs text-gray-500">Roll #{row?.roll_number || '-'}</div>
          </div>
        </div>
      ),
    },
    { id: 'roll_number', header: 'Roll No.', type: 'text', sortable: true, filterable: true, accessorKey: 'roll_number', align: 'center' },
    { id: 'grade', header: 'Grade', type: 'number', sortable: true, filterable: true, accessorKey: 'grade', align: 'center' },
    { id: 'gender', header: 'Gender', type: 'text', sortable: true, filterable: true, accessorKey: 'gender', align: 'center' },
    { id: 'evaluation_count', header: 'Evaluations', type: 'number', sortable: true, filterable: true, accessorKey: 'evaluation_count', align: 'center' },
    { id: 'performance', header: 'Performance', type: 'text', sortable: true, filterable: true, accessorFn: (row) => row?.average_performance || row?.latest_performance || row?.performance || '', align: 'center' },
    { id: 'enrollments_count', header: 'Programs', type: 'number', sortable: true, filterable: true, accessorFn: (row) => row?.enrollments_count ?? row?.enrollment_count ?? 0, align: 'center' },
    { id: 'joined_at', header: 'Joined', type: 'date', sortable: true, filterable: true, accessorKey: 'joined_at', align: 'center', cell: (v) => v ? new Date(v).toLocaleDateString() : '-' },
    { id: 'is_active', header: 'Status', type: 'boolean', sortable: true, filterable: true, accessorKey: 'is_active', align: 'center', cell: (v) => v ? (<span className="text-green-600 font-medium">Active</span>) : (<span className="text-red-600 font-medium">Inactive</span>) },
    { id: 'actions', header: 'Actions', type: 'actions', align: 'right', cell: (v, row) => (
      <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
        <Button variant="outline" size="sm" onClick={() => handleView(row)}>View</Button>
        <Button variant="primary" size="sm" onClick={() => handleEdit(row)}>Edit</Button>
        <Button variant="danger" size="sm" onClick={() => handleDelete(row)}>Delete</Button>
      </div>
    ) },
  ]), []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
        <Button variant="primary" onClick={() => router.push('/students/new')}>+ Add Student</Button>
      </div>

      {error ? (
        <div className="rounded border border-red-200 bg-red-50 text-red-700 p-3">{error}</div>
      ) : null}

      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        emptyMessage={loading ? 'Loading...' : 'No students found'}
        enableGlobalSearch={true}
        onRowClick={(row) => handleView(row)}
        toolbarActions={[{ label: '+ Add Student', variant: 'primary', onClick: () => router.push('/students/new') }, { label: 'Import', variant: 'secondary', onClick: () => router.push('/students/import') }]}
        initialPageSize={pageSize}
        onPageSizeChange={(size) => { setPageSize(size); loadStudents(size); }}
        stickyHeader
      />

      {deleteTarget && (
        <Modal>
          <div className="bg-white rounded-lg p-5 w-[315px]">
            <h3 className="text-lg font-semibold mb-2">{deleteTarget.blockedReason ? 'Cannot delete student' : 'Delete student?'}</h3>
            {deleteTarget.blockedReason ? (
              <p className="text-sm text-gray-700 mb-4">{deleteTarget.blockedReason}</p>
            ) : (
              <p className="text-sm text-gray-700 mb-4">This action cannot be undone.</p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>{deleteTarget.blockedReason ? 'Close' : 'Cancel'}</Button>
              {!deleteTarget.blockedReason && (
                <Button variant="danger" onClick={confirmDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
