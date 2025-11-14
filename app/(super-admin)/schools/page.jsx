'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Plus, ChevronLeft, School, Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSchools, deleteSchool } from '@/lib/api/services/schoolService';
import SchoolFilters from '@/components/schools/SchoolFilters';
import SchoolCard from '@/components/schools/SchoolCard';
import DeleteSchoolModal from '@/components/schools/DeleteSchoolModal';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/ui/Button';

function SchoolsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [schools, setSchools] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
  const [filters, setFilters] = useState({ search: '', location: '', status: 'all', sort_by: 'name', sort_order: 'asc' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Initialize filters from URL
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    setPagination((p) => ({ ...p, page, limit }));
    setFilters({
      search: searchParams.get('search') || '',
      location: searchParams.get('location') || '',
      status: searchParams.get('status') || 'all',
      sort_by: searchParams.get('sort_by') || 'name',
      sort_order: searchParams.get('sort_order') || 'asc',
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryFromState = (noCache = false, f = filters, p = pagination) => ({
    page: p.page,
    limit: p.limit,
    search: (f.search || '').trim() || undefined,
    location: (f.location || '').trim() || undefined,
    // API expects `status` of 'active' | 'inactive'; omit when 'all'
    status: f.status !== 'all' ? f.status : undefined,
    sort_by: f.sort_by || undefined,
    sort_order: f.sort_order || undefined,
    noCache,
  });

  const pushQueryToUrl = (f = filters, p = pagination) => {
    const params = new URLSearchParams();
    params.set('page', String(p.page));
    params.set('limit', String(p.limit));
    if ((f.search || '').trim()) params.set('search', (f.search || '').trim());
    if ((f.location || '').trim()) params.set('location', (f.location || '').trim());
    if (f.status && f.status !== 'all') params.set('status', f.status);
    if (f.sort_by) params.set('sort_by', f.sort_by);
    if (f.sort_order) params.set('sort_order', f.sort_order);
    router.replace(`/schools?${params.toString()}`);
  };

  const loadSchools = async (noCache = false, fOverride = undefined, pOverride = undefined) => {
    setLoading(true); setError('');
    try {
      const res = await getSchools(queryFromState(noCache, fOverride ?? filters, pOverride ?? pagination));
      if (res.success) {
        const { schools: list = [], pagination: p = { page: 1, limit: 10, total: 0, total_pages: 1 } } = res.data || {};
        setSchools(list);
        setPagination(p);
        // Keep URL in sync with latest filters/pagination used for this request
        pushQueryToUrl(fOverride ?? filters, pOverride ?? pagination);
      } else {
        setError(res.error || 'Failed to load schools');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSchools(false); }, []);

  const onFilterChange = (next) => {
    // Reset to first page on any filter change
    const nextPagination = { ...pagination, page: 1 };
    setFilters(next);
    setPagination(nextPagination);
    // Immediately load using the latest filters to avoid stale queries
    loadSchools(true, next, nextPagination);
  };

  const onView = (s) => {
    const id = s.id || s.school_id;
    router.push(id ? `/schools/${id}` : '/schools');
  };
  const onEdit = (s) => {
    const id = s.id || s.school_id;
    router.push(id ? `/schools/${id}/edit` : '/schools');
  };
  const onDelete = (s) => setDeleteTarget(s);
  const confirmDelete = async (s) => {
    const id = s.id || s.school_id;
    const res = await deleteSchool(id);
    setDeleteTarget(null);
    if (res.success) loadSchools(true);
  };

  // DataTable columns mapped to API response
  const columns = useMemo(() => ([
    { id: 'name', header: 'School', accessorKey: 'name', type: 'text', sortable: true, filterable: true, cell: (v) => (<span className="font-semibold text-gray-900">{v}</span>) },
    { id: 'location', header: 'Location', accessorKey: 'location', type: 'text', sortable: true, filterable: true },
    { id: 'contact_person', header: 'Contact Person', accessorKey: 'contact_person', type: 'text', filterable: true },
    { id: 'contact_email', header: 'Contact Email', accessorKey: 'contact_email', type: 'text', filterable: true, cell: (v) => v ? (<a href={`mailto:${v}`} className="text-purple-600 hover:text-purple-700 hover:underline font-medium">{v}</a>) : '-' },
    { id: 'school_admin_name', header: 'Admin', accessorKey: 'school_admin_name', type: 'text', filterable: true },
    { id: 'school_admin_email', header: 'Admin Email', accessorKey: 'school_admin_email', type: 'text', filterable: true, cell: (v) => v ? (<a href={`mailto:${v}`} className="text-purple-600 hover:text-purple-700 hover:underline font-medium">{v}</a>) : '-' },
    { id: 'programs_count', header: 'Programs', accessorKey: 'programs_count', type: 'number', sortable: true, filterable: true },
    { id: 'students_count', header: 'Students', accessorKey: 'students_count', type: 'number', sortable: true, filterable: true },
    { id: 'is_active', header: 'Status', accessorKey: 'is_active', type: 'boolean', filterable: true, cell: (v) => (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border-2 shadow-sm ${v ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{v ? 'Active' : 'Inactive'}</span>
    ) },
  ]), []);

  const rowActions = (row) => [
    { id: 'view', label: 'View', variant: 'ghost', onClick: () => onView(row) },
    { id: 'edit', label: 'Edit', variant: 'outline', onClick: () => onEdit(row) },
    { id: 'delete', label: 'Delete', variant: 'danger', onClick: () => onDelete(row) },
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
                <School className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Schools Management
                </h1>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  Manage all schools and their information
                </p>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button 
                variant="primary" 
                onClick={() => router.push('/schools/new')} 
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} />
                <span>Add School</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-3">
        {/* Filters Bar */}
        <SchoolFilters filters={filters} onFilterChange={onFilterChange} />

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
            {schools.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-white to-gray-50">
                <div className="p-5 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl mb-4 shadow-inner">
                  <School className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" strokeWidth={1.5} />
                </div>
                <p className="text-lg sm:text-xl font-bold text-gray-600 mb-2">No schools found</p>
                <p className="text-sm sm:text-base text-gray-500 text-center max-w-md mb-6">
                  {filters.search || filters.location || filters.status !== 'all' 
                    ? 'Try adjusting your filters to find what you\'re looking for'
                    : 'Get started by adding your first school to the system'}
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => router.push('/schools/new')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
                >
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                  Add Your First School
                </Button>
              </div>
            ) : (
              <>
                {/* Card view on mobile/tablet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:hidden">
                  {schools.map((s) => (
                    <SchoolCard key={s.id} school={s} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                  ))}
                </div>
                
                {/* Table view on desktop */}
                <div className="hidden md:block">
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                    <DataTable
                      columns={columns}
                      data={schools}
                      loading={loading}
                      enableGlobalSearch={false}
                      rowActions={rowActions}
                      initialPageSize={pagination.limit || 10}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteSchoolModal 
        school={deleteTarget} 
        isOpen={!!deleteTarget} 
        onCancel={() => setDeleteTarget(null)} 
        onConfirm={confirmDelete} 
      />
    </div>
  );
}

export default function SchoolsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block p-5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-lg animate-pulse">
            <School className="h-12 w-12 text-purple-600" strokeWidth={2.5} />
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading schools...</p>
        </div>
      </div>
    }>
      <SchoolsPageContent />
    </Suspense>
  );
}
