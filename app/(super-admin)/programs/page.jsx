"use client";
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, RefreshCw, BookOpen, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import DeleteProgramModal from '@/components/programs/DeleteProgramModal';
import DataTable from '@/components/common/DataTable';
import ProgramFilters from '@/components/programs/ProgramFilters';
import ProgramCard from '@/components/programs/ProgramCard';
import { getPrograms, deleteProgram } from '@/lib/api/services/programService';

function ProgramsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(() => ({
    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 10),
    search: searchParams.get('search') || '',
    category_id: searchParams.get('category_id') || '',
    status: searchParams.get('status') || 'all',
  }));
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const updateURL = (nextFilters) => {
    const params = new URLSearchParams();
    params.set('page', String(nextFilters.page || 1));
    params.set('limit', String(nextFilters.limit || 10));
    if (nextFilters.search) params.set('search', nextFilters.search);
    if (nextFilters.category_id) params.set('category_id', nextFilters.category_id);
    if (nextFilters.status && nextFilters.status !== 'all') params.set('status', nextFilters.status);
    router.replace(`/programs?${params.toString()}`);
  };

  const loadPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPrograms(filters);
      if (res.success) {
        const { programs: list = [] } = res.data || {};
        setPrograms(Array.isArray(list) ? list : []);
      } else {
        setError(res.error || 'Failed to load programs');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.limit, filters.search, filters.category_id, filters.status]);

  const handleFilterChange = (next) => {
    setFilters((f) => ({ ...f, ...next, page: 1 }));
    updateURL({ ...filters, ...next, page: 1 });
  };

  const handleRefresh = () => {
    loadPrograms();
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
        loadPrograms();
      } else {
        setError(res.error || 'Failed to delete program');
      }
    } finally {
      setDeleting(false);
    }
  };

  const columns = useMemo(() => ([
    { 
      id: 'name', 
      header: 'Program Name', 
      type: 'text', 
      sortable: true, 
      accessorKey: 'name',
      cell: (v) => (<span className="font-semibold text-gray-900">{v}</span>)
    },
    { 
      id: 'category', 
      header: 'Category', 
      type: 'text', 
      sortable: true, 
      accessorFn: (row) => row?.category?.name || '-',
      cell: (v) => (
        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200 shadow-sm">
          {v}
        </span>
      )
    },
    { 
      id: 'levels', 
      header: 'Levels', 
      type: 'number', 
      sortable: true, 
      accessorKey: 'total_levels', 
      align: 'center',
      cell: (v) => (
        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-100 text-blue-700 shadow-sm">
          {v || 0}
        </span>
      )
    },
    { 
      id: 'age', 
      header: 'Age Range', 
      type: 'text', 
      sortable: false, 
      accessorFn: (row) => `${row.age_from || 0}-${row.age_to || 0}`,
      cell: (v) => (
        <span className="text-sm font-medium text-gray-700">{v} years</span>
      )
    },
    { 
      id: 'schools', 
      header: 'Schools', 
      type: 'number', 
      sortable: true, 
      accessorKey: 'enrolled_schools', 
      align: 'center',
      cell: (v) => (
        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-100 text-teal-700 shadow-sm">
          {v?.toLocaleString() || 0}
        </span>
      )
    },
    { 
      id: 'students', 
      header: 'Students', 
      type: 'number', 
      sortable: true, 
      accessorKey: 'total_students', 
      align: 'center',
      cell: (v) => (
        <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-100 text-indigo-700 shadow-sm">
          {v?.toLocaleString() || 0}
        </span>
      )
    },
    { 
      id: 'status', 
      header: 'Status', 
      type: 'text', 
      sortable: true, 
      accessorFn: (row) => (row.is_active ? 'Active' : 'Inactive'), 
      align: 'center',
      cell: (v, row) => (
        <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border-2 shadow-sm ${
          row.is_active 
            ? 'bg-green-100 text-green-700 border-green-200' 
            : 'bg-red-100 text-red-700 border-red-200'
        }`}>
          {v}
        </span>
      )
    },
  ]), []);

  const rowActions = (row) => [
    { id: 'view', label: 'View', variant: 'ghost', onClick: () => handleView(row) },
    { id: 'edit', label: 'Edit', variant: 'outline', onClick: () => handleEdit(row) },
    { id: 'delete', label: 'Delete', variant: 'danger', onClick: () => handleDelete(row) },
  ];

  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/20">
      {/* Modern Header with Gradient Background */}
      <div className="sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left Section - Title */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Programs Management
                </h1>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  Manage educational programs and curriculum
                </p>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button 
                variant="primary" 
                onClick={() => router.push('/programs/new')} 
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} />
                <span>Add Program</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-2 sm:px-6 lg:px-4 space-y-3">
        {/* Filters Bar */}
        <ProgramFilters filters={filters} onFilterChange={handleFilterChange} onRefresh={handleRefresh} />

        {/* Error Message */}
        {error ? (
          <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-4 sm:p-5 shadow-md">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-1 h-full bg-red-500 rounded-full" />
              <p className="text-sm sm:text-base text-red-700 font-semibold">{error}</p>
            </div>
          </div>
        ) : null}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className="h-56 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse shadow-sm border border-gray-200"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Empty State */}
            {programs.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-white to-gray-50">
                <div className="p-5 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl mb-4 shadow-inner">
                  <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" strokeWidth={1.5} />
                </div>
                <p className="text-lg sm:text-xl font-bold text-gray-600 mb-2">No programs found</p>
                <p className="text-sm sm:text-base text-gray-500 text-center max-w-md mb-6">
                  {filters.search || filters.category_id || filters.status !== 'all' 
                    ? 'Try adjusting your filters to find what you\'re looking for'
                    : 'Get started by creating your first program'}
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => router.push('/programs/new')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
                >
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                  Create Your First Program
                </Button>
              </div>
            ) : (
              <>
                {/* Card view on mobile/tablet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:hidden">
                  {programs.map((p) => (
                    <ProgramCard 
                      key={p?.id ?? p?.program_id} 
                      program={p} 
                      onView={handleView} 
                      onEdit={handleEdit} 
                      onDelete={handleDelete} 
                    />
                  ))}
                </div>
                
                {/* Table view on desktop */}
                <div className="hidden md:block">
                  <div className="rounded-2xl overflow-hidden">
                    <DataTable
                      key={`programs-${filters.limit}`}
                      columns={columns}
                      data={programs}
                      loading={loading}
                      emptyMessage="No programs found"
                      enableGlobalSearch={false}
                      onRefresh={handleRefresh}
                      rowActions={rowActions}
                      initialPageSize={Number(filters.limit) || 10}
                      onPageSizeChange={(size) => handleFilterChange({ limit: Number(size) || 10 })}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteProgramModal 
        program={deleteTarget} 
        isOpen={!!deleteTarget} 
        onConfirm={confirmDelete} 
        onCancel={() => setDeleteTarget(null)} 
        loading={deleting} 
      />
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block p-5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-lg animate-pulse">
            <BookOpen className="h-12 w-12 text-purple-600" strokeWidth={2.5} />
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading programs...</p>
        </div>
      </div>
    }>
      <ProgramsPageContent />
    </Suspense>
  );
}
