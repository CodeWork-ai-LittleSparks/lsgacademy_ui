"use client";

import React, { useEffect, useMemo, useState } from "react";
import apiClient from "@/lib/api/client";
import Pagination from "@/components/schools/Pagination";
import SkeletonGrid from "@/components/schools/Skeleton";
import ErrorState from "@/components/schools/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import { MoreHorizontal, CheckCircle2, XCircle, Eye, Filter as FilterIcon } from "lucide-react";

/**
 * SchoolList: Fetches and displays schools with filters, sorting, and pagination.
 * API: GET /api/v1/schools/ using base URL from NEXT_PUBLIC_API_URL
 * Query params: page, limit, search, location, status, sort_by, sort_order
 */
export default function SchoolList({ onViewSchool, onEditSchool }) {
  // Data and UI state
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12); // default page size (max 50)
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters and sorting
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState(""); // "active" | "inactive" | ""
  const [sortBy, setSortBy] = useState("name"); // "name" | "created_at" | "students_count"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  // Filter visibility toggle
  const [showFilters, setShowFilters] = useState(true);

  // Column filters (per the provided design)
  const [orgFilter, setOrgFilter] = useState("");
  const [mobileFilter, setMobileFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [adminNameFilter, setAdminNameFilter] = useState("");
  const [adminEmailFilter, setAdminEmailFilter] = useState("");
  const [programsFilter, setProgramsFilter] = useState("");
  const [studentsFilter, setStudentsFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  

  // Derived locations for dropdown
  const locations = useMemo(() => {
    const set = new Set((schools || []).map((s) => s.location).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [schools]);

  const fetchSchools = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit: Math.min(limit, 50),
        search: search || undefined,
        location: location || undefined,
        status: status || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      const res = await apiClient.get("/schools/", { params });
      if (res?.success) {
        const { schools: items = [], pagination = {} } = res.data || {};
        setSchools(items);
        setPage(pagination.page || 1);
        setTotalPages(pagination.total_pages || 1);
        setTotal(pagination.total || items.length);
      } else {
        setError(res?.message || "Failed to load schools");
      }
    } catch (err) {
      setError(err?.message || "Failed to load schools");
    } finally {
      setLoading(false);
    }
  };

  const toggleActiveStatus = async (school) => {
    const targetActive = !school.is_active;
    setUpdatingId(school.id);
    // Optimistic update
    setSchools((prev) => prev.map((s) => (s.id === school.id ? { ...s, is_active: targetActive } : s)));
    try {
      const res = await apiClient.patch(`/schools/${school.id}/`, { is_active: targetActive });
      if (!res?.success) {
        throw new Error(res?.message || "Failed to update status");
      }
    } catch (err) {
      // Revert on error
      setSchools((prev) => prev.map((s) => (s.id === school.id ? { ...s, is_active: school.is_active } : s)));
      setError(err?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
      setActionMenuOpenId(null);
    }
  };

  // Client-side filtered view to match per-column filters
  const filteredSchools = useMemo(() => {
    const norm = (v) => (v || "").toString().toLowerCase();
    const inc = (field, filter) => norm(field).includes(norm(filter));
    return (schools || []).filter((s) =>
      (!orgFilter || inc(s.name, orgFilter)) &&
      (!mobileFilter || inc(s.phone ?? s.contact_phone, mobileFilter)) &&
      (!emailFilter || inc(s.contact_email, emailFilter)) &&
      (!cityFilter || inc(s.location, cityFilter)) &&
      (!adminNameFilter || inc(s.school_admin_name, adminNameFilter)) &&
      (!adminEmailFilter || inc(s.school_admin_email, adminEmailFilter)) &&
      (!programsFilter || inc(s.programs_count, programsFilter)) &&
      (!studentsFilter || inc(s.students_count, studentsFilter)) &&
      (!statusFilter || inc(s.is_active ? "active" : "inactive", statusFilter))
    );
  }, [schools, orgFilter, mobileFilter, emailFilter, cityFilter, adminNameFilter, adminEmailFilter, programsFilter, studentsFilter, statusFilter]);

  // Fetch when dependencies change
  useEffect(() => {
    fetchSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, location, status, sortBy, sortOrder]);

  // Handle filter changes from FilterBar
  const handleFiltersChange = (updates) => {
    if (Object.prototype.hasOwnProperty.call(updates, "search")) {
      setSearch(updates.search);
      setPage(1);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "location")) {
      setLocation(updates.location);
      setPage(1);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "status")) {
      setStatus(updates.status);
      setPage(1);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "sortBy")) {
      setSortBy(updates.sortBy);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "sortOrder")) {
      setSortOrder(updates.sortOrder);
    }
  };

  // UI
  return (
    <div className="space-y-4">
      
      {/* Content */}
      <div className="rounded-xl border border-zinc-200 bg-white p-0">
        {loading ? (
          <div className="p-4"><SkeletonGrid count={9} /></div>
        ) : error ? (
          <div className="p-4"><ErrorState message={error} onRetry={fetchSchools} /></div>
        ) : schools.length === 0 ? (
          <div className="p-4"><EmptyState title="No schools found" description="Try adjusting filters or search." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-violet-50 text-left text-sm text-[#6F00FF]">
                  <th className="px-4 py-3 border-b w-10">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-1 rounded hover:bg-purple-100 transition-colors ${showFilters ? 'text-purple-600' : 'text-purple-400'}`}
                      aria-label={showFilters ? "Hide filters" : "Show filters"}
                    >
                      <FilterIcon className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-0' : 'rotate-180'}`} />
                    </button>
                  </th>
                  <th className="px-4 py-3 border-b min-w-[150px]">Organization</th>
                  <th className="px-4 py-3 border-b min-w-[120px] hidden sm:table-cell">Mobile</th>
                  <th className="px-4 py-3 border-b min-w-[180px] hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 border-b min-w-[120px] hidden lg:table-cell">City</th>
                  <th className="px-4 py-3 border-b min-w-[150px] hidden lg:table-cell">Admin Name</th>
                  <th className="px-4 py-3 border-b min-w-[180px] hidden xl:table-cell">Admin Email</th>
                  <th className="px-4 py-3 border-b text-center min-w-[100px] hidden md:table-cell">Programs</th>
                  <th className="px-4 py-3 border-b text-center min-w-[100px] hidden md:table-cell">Students</th>
                  <th className="px-4 py-3 border-b min-w-[100px]">Status</th>
                  <th className="px-4 py-3 border-b w-14">Actions</th>
                </tr>
                {/* Filter row - conditionally rendered */}
                {showFilters && (
                  <tr className="bg-gradient-to-r from-purple-50 to-violet-50">
                    <th className="px-3 py-3 border-b w-10"></th>
                    <th className="px-3 py-3 border-b">
                      <input
                        value={orgFilter}
                        onChange={(e) => setOrgFilter(e.target.value)}
                        placeholder="Filter Organization..."
                        className="w-full h-9 rounded-md border border-violet-200 bg-white px-3 text-sm text-gray-800 placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                      />
                    </th>
                    <th className="px-3 py-3 border-b hidden sm:table-cell">
                      <input
                        value={mobileFilter}
                        onChange={(e) => setMobileFilter(e.target.value)}
                        placeholder="Filter Mobile..."
                        className="w-full h-9 rounded-md border border-violet-200 bg-white px-3 text-sm text-gray-800 placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                      />
                    </th>
                    <th className="px-3 py-3 border-b hidden md:table-cell">
                      <input
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                        placeholder="Filter Email..."
                        className="w-full h-9 rounded-md border border-violet-200 bg-white px-3 text-sm text-gray-800 placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                      />
                    </th>
                    <th className="px-3 py-3 border-b hidden lg:table-cell">
                      <input
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        placeholder="Filter City..."
                        className="w-full h-9 rounded-md border border-violet-200 bg-white px-3 text-sm text-gray-800 placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                      />
                    </th>
                    <th className="px-3 py-3 border-b hidden lg:table-cell">
                      <input
                        value={adminNameFilter}
                        onChange={(e) => setAdminNameFilter(e.target.value)}
                        placeholder="Filter Admin Name..."
                        className="w-full h-9 rounded-md border border-violet-200 bg-white px-3 text-sm text-gray-800 placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                      />
                    </th>
                    <th className="px-3 py-3 border-b hidden xl:table-cell">
                      <input
                        value={adminEmailFilter}
                        onChange={(e) => setAdminEmailFilter(e.target.value)}
                        placeholder="Filter Admin Email..."
                        className="w-full h-9 rounded-md border border-violet-200 bg-white px-3 text-sm text-gray-800 placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                      />
                    </th>
                    <th className="px-3 py-3 border-b hidden md:table-cell">
                      <input
                        value={programsFilter}
                        onChange={(e) => setProgramsFilter(e.target.value)}
                        placeholder="Filter Programs..."
                        className="w-full h-9 rounded-md border border-violet-200 bg-white px-3 text-sm text-gray-800 placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                      />
                    </th>
                    <th className="px-3 py-3 border-b hidden md:table-cell">
                      <input
                        value={studentsFilter}
                        onChange={(e) => setStudentsFilter(e.target.value)}
                        placeholder="Filter Students..."
                        className="w-full h-9 rounded-md border border-violet-200 bg-white px-3 text-sm text-gray-800 placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                      />
                    </th>
                    <th className="px-3 py-3 border-b">
                      <input
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        placeholder="Filter Status..."
                        className="w-full h-9 rounded-md border border-violet-200 bg-white px-3 text-sm text-gray-800 placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
                      />
                    </th>
                    <th className="px-3 py-3 border-b"></th>
                  </tr>
                )}
              </thead>
              <tbody>
                {filteredSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 border-b w-10"></td>
                    <td className="px-4 py-3 border-b font-medium text-gray-800">
                      <div className="min-w-0">
                        <div className="font-medium text-gray-800 truncate">{school.name}</div>
                        <div className="text-sm text-gray-600 sm:hidden">
                          {school.phone ?? school.contact_phone ?? '—'} • {school.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-b text-gray-700 hidden sm:table-cell">{school.phone ?? school.contact_phone ?? '—'}</td>
                    <td className="px-4 py-3 border-b text-gray-700 hidden md:table-cell">{school.contact_email}</td>
                    <td className="px-4 py-3 border-b text-gray-700 hidden lg:table-cell">{school.location}</td>
                    <td className="px-4 py-3 border-b text-gray-700 hidden lg:table-cell">{school.school_admin_name}</td>
                    <td className="px-4 py-3 border-b text-gray-700 hidden xl:table-cell">{school.school_admin_email}</td>
                    <td className="px-4 py-3 border-b text-center text-gray-700 hidden md:table-cell">{school.programs_count ?? 0}</td>
                    <td className="px-4 py-3 border-b text-center text-gray-700 hidden md:table-cell">{school.students_count ?? 0}</td>
                    <td className="px-4 py-3 border-b">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${school.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {school.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {school.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b">
                      <div className="relative inline-block text-left">
                        <button
                          className="p-2 rounded hover:bg-zinc-100"
                          onClick={() => setActionMenuOpenId((prev) => (prev === school.id ? null : school.id))}
                          aria-label="Actions"
                        >
                          <MoreHorizontal className="h-5 w-5 text-gray-700" />
                        </button>
                        {actionMenuOpenId === school.id && (
                          <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                              <button
                                className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 flex items-center gap-2 text-gray-700"
                                onClick={() => {
                                  setActionMenuOpenId(null);
                                  onViewSchool?.(school);
                                }}
                              >
                                <Eye className="h-4 w-4 text-gray-700" /> View
                              </button>
                              <button
                                className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 text-gray-700"
                                disabled={updatingId === school.id}
                                onClick={() => toggleActiveStatus(school)}
                              >
                                {school.is_active ? "Mark Inactive" : "Mark Active"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer summary */}
        {!loading && !error && filteredSchools.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-gray-700 px-4">
            <span>
              Showing {filteredSchools.length} of {total} schools
            </span>
            <span>
              {filteredSchools.filter((s) => s.is_active).length} Active • {filteredSchools.filter((s) => !s.is_active).length} Inactive
            </span>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="p-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}