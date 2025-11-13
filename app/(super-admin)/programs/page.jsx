"use client";
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import DeleteProgramModal from '@/components/programs/DeleteProgramModal';
import DataTable from '@/components/common/DataTable';
import { getPrograms, deleteProgram, getCategories } from '@/lib/api/services/programService';

function ProgramsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(() => ({
    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 10),
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category_id') || '',
    is_active: searchParams.get('is_active') || 'all',
  }));
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [localSearch, setLocalSearch] = useState(() => filters.search || '');

  const updateURL = (nextFilters) => {
    const params = new URLSearchParams();
    params.set('page', String(nextFilters.page || 1));
    params.set('limit', String(nextFilters.limit || 10));
    if (nextFilters.search) params.set('search', nextFilters.search);
    if (nextFilters.category_id) params.set('category_id', nextFilters.category_id);
    if (nextFilters.is_active && nextFilters.is_active !== 'all') params.set('is_active', nextFilters.is_active);
    router.replace(`/programs?${params.toString()}`);
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    getPrograms(filters)
      .then((res) => {
        if (!isMounted) return;
        if (res.success) {
          const { programs: list = [] } = res.data || {};
          setPrograms(Array.isArray(list) ? list : []);
        } else {
          setError(res.error || 'Failed to load programs');
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.limit, filters.search, filters.category_id, filters.is_active]);

  // Load categories for filter dropdown
  useEffect(() => {
    let active = true;
    setLoadingCategories(true);
    getCategories({ noCache: false })
      .then((res) => {
        if (!active) return;
        if (res.success) {
          const list = Array.isArray(res.data) ? res.data : (res.data?.categories || []);
          setCategories(list);
        }
      })
      .finally(() => active && setLoadingCategories(false));
    return () => { active = false; };
  }, []);

  // Debounce server-side search param updates
  useEffect(() => {
    const t = setTimeout(() => {
      handleFilterChange({ search: localSearch || '' });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  const handleFilterChange = (next) => {
    setFilters((f) => ({ ...f, ...next, page: 1 }));
    updateURL({ ...filters, ...next, page: 1 });
  };

  const getId = (program) => program?.program_id || program?.id;
  const handleView = (program) => {
    const id = getId(program);
    if (!id) return;
    router.push(`/programs/${id}`);
  };
  const handleEdit = (program) => {
    const id = getId(program);
    if (!id) return;
    router.push(`/programs/${id}/edit`);
  };
  const handleDelete = (program) => setDeleteTarget(program);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const res = await deleteProgram(getId(deleteTarget));
      if (res.success) {
        setDeleteTarget(null);
        // Refresh list
        getPrograms(filters).then((r) => {
          const { programs: list = [] } = r.data || {};
          setPrograms(Array.isArray(list) ? list : []);
        });
      } else {
        setError(res.error || 'Failed to delete program');
      }
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo(() => ([
    { id: 'name', header: 'Name', type: 'text', sortable: true, accessorKey: 'name' },
    { id: 'category', header: 'Category', type: 'text', sortable: true, accessorFn: (row) => row?.category?.name || '' },
    { id: 'levels', header: 'Levels', type: 'number', sortable: true, accessorKey: 'total_levels', align: 'center' },
    { id: 'age', header: 'Age Range', type: 'text', sortable: false, accessorFn: (row) => `${row.age_from}-${row.age_to}` },
    { id: 'schools', header: 'Schools', type: 'number', sortable: true, accessorKey: 'enrolled_schools', align: 'center' },
    { id: 'students', header: 'Students', type: 'number', sortable: true, accessorKey: 'total_students', align: 'center' },
    { id: 'status', header: 'Status', type: 'text', sortable: true, accessorFn: (row) => (row.is_active ? 'Active' : 'Inactive'), align: 'center' },
    { id: 'actions', header: 'Actions', type: 'actions', cell: (v, row) => (
      <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
        <Button variant="outline" size="sm" onClick={() => handleView(row)}>View</Button>
        <Button variant="primary" size="sm" onClick={() => handleEdit(row)}>Edit</Button>
        <Button variant="danger" size="sm" onClick={() => handleDelete(row)}>Delete</Button>
      </div>
    ), align: 'right' },
  ]), []);

  const tableContent = (
    <DataTable
      key={`programs-${filters.limit}`}
      columns={columns}
      data={programs}
      loading={loading}
      emptyMessage={loading ? 'Loading...' : 'No programs found'}
      enableGlobalSearch={false}
      onRowClick={(row) => handleView(row)}
      toolbarActions={[{ label: '+ Add Program', variant: 'primary', onClick: () => router.push('/programs/new') }]}
      initialPageSize={Number(filters.limit) || 10}
      onPageSizeChange={(size) => handleFilterChange({ limit: Number(size) || 10 })}
    />
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Programs Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Search by program name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search program name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category_id || ''}
              onChange={(e) => handleFilterChange({ category_id: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All categories</option>
              {loadingCategories ? (
                <option value="" disabled>Loading...</option>
              ) : (
                categories.map((c) => (
                  <option key={c?.id ?? c?.category_id ?? String(c)} value={String(c?.id ?? c?.category_id ?? c)}>
                    {c?.name ?? c?.title ?? String(c?.id ?? c)}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.is_active || 'all'}
              onChange={(e) => handleFilterChange({ is_active: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Items per page control removed; controlled below the table */}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setLocalSearch('');
              handleFilterChange({ search: '', category_id: '', is_active: 'all', limit: 10 });
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded border border-red-200 bg-red-50 text-red-700 p-3">{error}</div>
      ) : null}

      {tableContent}

      {/* Pagination handled within DataTable */}

      <DeleteProgramModal program={deleteTarget} isOpen={!!deleteTarget} onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading programs...</div>}>
      <ProgramsPageContent />
    </Suspense>
  );
}
