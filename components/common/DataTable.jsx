"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ChevronDown, ChevronUp, Search, SlidersHorizontal, Columns, Download, RefreshCw, MoreHorizontal, ChevronLeft, ChevronRight, Filter, Table as TableIcon, Sparkles } from "lucide-react";

// Column definition shape (for reference):
// {
//   id: string,
//   header: string,
//   accessorKey?: string,
//   accessorFn?: (row) => any,
//   type?: 'text'|'number'|'boolean'|'date',
//   sortable?: boolean,
//   filterable?: boolean,
//   align?: 'left'|'center'|'right',
//   width?: string,
//   cell?: (value, row) => ReactNode
// }

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No data found",
  // local state (non-remote) pagination and sorting
  initialPage = 1,
  initialPageSize = 10,
  initialSortBy = null, // column id
  initialSortDir = "asc", // 'asc' | 'desc'
  // column filters
  initialFilters = {}, // { [columnId]: value }
  // selection
  selectable = false,
  selectedRowIds = [],
  onSelectionChange,
  // actions
  rowActions, // (row) => [{ id, label, icon, variant, onClick }]
  toolbarActions = [], // [{ label, icon, variant, onClick }]
  onRowClick,
  // toolbar
  enableGlobalSearch = true,
  onRefresh,
  enableExport = true,
  // layout
  stickyHeader = true,
  density = "comfortable", // 'comfortable' | 'compact'
  // callbacks
  onPageSizeChange,
}) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDir, setSortDir] = useState(initialSortDir);
  const [filters, setFilters] = useState(() => {
    const base = {};
    columns.forEach((c) => { if (c.filterable) base[c.id] = initialFilters?.[c.id] ?? (c.type === 'boolean' ? 'all' : ''); });
    return base;
  });
  const [globalSearch, setGlobalSearch] = useState("");
  const [columnsMenuOpen, setColumnsMenuOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(() => {
    const map = {};
    columns.forEach((c) => { map[c.id] = true; });
    return map;
  });

  const columnsMenuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(e.target)) {
        setColumnsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rowHeightClass = density === 'compact' ? 'py-1.5' : 'py-3';

  const accessValue = (col, row) => {
    if (col.accessorFn) return col.accessorFn(row);
    if (col.accessorKey) return row?.[col.accessorKey];
    return undefined;
  };

  const filteredData = useMemo(() => {
    let rows = Array.isArray(data) ? data : [];
    // Global search (applies to text columns)
    if (enableGlobalSearch && globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      rows = rows.filter((row) =>
        columns.some((c) => {
          if (c.type === 'text') {
            const v = String(accessValue(c, row) ?? '').toLowerCase();
            return v.includes(q);
          }
          return false;
        })
      );
    }
    // Column filters
    rows = rows.filter((row) => {
      return columns.every((c) => {
        if (!c.filterable) return true;
        const v = accessValue(c, row);
        const f = filters[c.id];
        if (c.type === 'boolean') {
          if (!f || f === 'all') return true;
          const boolVal = !!v;
          return f === 'true' ? boolVal : !boolVal;
        }
        if (c.type === 'number') {
          if (f === '' || f === null || f === undefined) return true;
          const num = Number(v) || 0;
          const min = Number(f);
          return num >= min;
        }
        // text/date fallback: contains
        const str = String(v ?? '').toLowerCase();
        return String(f ?? '').trim() === '' ? true : str.includes(String(f).toLowerCase());
      });
    });
    // Sorting
    if (sortBy) {
      const col = columns.find((c) => c.id === sortBy);
      if (col) {
        const dirMul = sortDir === 'asc' ? 1 : -1;
        rows = [...rows].sort((a, b) => {
          const va = accessValue(col, a);
          const vb = accessValue(col, b);
          if (va == null && vb == null) return 0;
          if (va == null) return -1 * dirMul;
          if (vb == null) return 1 * dirMul;
          if (col.type === 'number') {
            return (Number(va) - Number(vb)) * dirMul;
          }
          const sa = String(va).toLowerCase();
          const sb = String(vb).toLowerCase();
          if (sa < sb) return -1 * dirMul;
          if (sa > sb) return 1 * dirMul;
          return 0;
        });
      }
    }
    return rows;
  }, [data, columns, globalSearch, filters, sortBy, sortDir, enableGlobalSearch]);

  const totalRows = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const toggleSort = (col) => {
    if (!col.sortable) return;
    if (sortBy !== col.id) {
      setSortBy(col.id);
      setSortDir('asc');
    } else {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    }
  };

  const exportToCSV = () => {
    const visibleCols = columns.filter((c) => visibleColumns[c.id] && c.type !== 'actions');
    const header = visibleCols.map((c) => c.header);
    const rows = filteredData.map((row) => visibleCols.map((c) => {
      const v = accessValue(c, row);
      return v == null ? '' : String(v).replace(/\n/g, ' ');
    }));
    const csv = [header, ...rows].map(r => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Column filter row has been removed; keep internal filter state for compatibility
  // but do not surface any active filter badges in the toolbar.

  return (
    <div className="w-full space-y-4">
      {/* Enhanced Toolbar */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-5 sm:p-6 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {enableGlobalSearch && (
              <div className="relative flex-1 lg:flex-none min-w-[200px] sm:min-w-[280px]">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-purple-100 rounded-lg pointer-events-none">
                  <Search className="h-4 w-4 text-purple-600" strokeWidth={2.5} />
                </div>
                <Input
                  value={globalSearch}
                  onChange={(e) => { setGlobalSearch(e.target.value); setPage(1); }}
                  placeholder="Search across all fields..."
                  className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 bg-white font-medium transition-all duration-200 hover:border-purple-300"
                />
              </div>
            )}
            
            <div className="relative" ref={columnsMenuRef}>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 font-semibold transition-all duration-200" 
                onClick={() => setColumnsMenuOpen((o) => !o)}
              >
                <Columns className="h-4 w-4 text-purple-600" strokeWidth={2.5} /> 
                Columns
              </Button>
              {columnsMenuOpen && (
                <div className="absolute z-20 mt-2 w-56 rounded-xl border-2 border-gray-200 bg-white shadow-xl p-3">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                    <TableIcon className="h-4 w-4 text-purple-600" strokeWidth={2.5} />
                    <span className="text-sm font-bold text-gray-900">Visible Columns</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {columns.map((c) => (
                      <label key={c.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors group">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">{c.header}</span>
                        <input 
                          type="checkbox" 
                          checked={!!visibleColumns[c.id]} 
                          onChange={(e) => setVisibleColumns((m) => ({ ...m, [c.id]: e.target.checked }))}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {enableExport && (
              <Button 
                variant="outline" 
                onClick={exportToCSV} 
                className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 font-semibold transition-all duration-200"
              >
                <Download className="h-4 w-4 text-green-600" strokeWidth={2.5} /> 
                <span className="hidden sm:inline">Export</span>
              </Button>
            )}
            
            {onRefresh && (
              <Button 
                variant="ghost" 
                onClick={onRefresh} 
                className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-blue-50 font-semibold transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4 text-blue-600" strokeWidth={2.5} /> 
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            )}
          </div>
          
          {/* Right Section */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto lg:justify-end">
            {toolbarActions?.map((a) => (
              <Button 
                key={a.label} 
                variant={a.variant || 'primary'} 
                onClick={a.onClick} 
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                {a.icon ? <a.icon className="h-4 w-4" strokeWidth={2.5} /> : null}
                {a.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Table Container */}
      <div className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <thead className={`bg-gradient-to-r from-gray-50 to-gray-100 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
              <tr className="text-left text-xs sm:text-sm border-b-2 border-gray-200">
                {selectable && (
                  <th className={`px-3 sm:px-4 ${rowHeightClass} w-12`}>
                    {/* Reserved for future: Select all */}
                  </th>
                )}
                {columns.map((c) => (
                  visibleColumns[c.id] ? (
                    <th key={c.id} className={`px-3 sm:px-4 ${rowHeightClass} ${c.width || ''} ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left'}`}>
                      <div className={`flex items-center ${c.align === 'right' ? 'justify-end' : c.align === 'center' ? 'justify-center' : 'justify-start'} gap-2`}>
                        <button
                          className={`text-gray-700 font-bold uppercase tracking-wide ${c.sortable ? 'hover:text-purple-700 transition-colors' : ''}`}
                          onClick={() => toggleSort(c)}
                          disabled={!c.sortable}
                        >
                          {c.header}
                        </button>
                        {sortBy === c.id && (
                          <div className="p-1 bg-purple-100 rounded-lg">
                            {sortDir === 'asc' ? (
                              <ChevronUp className="h-4 w-4 text-purple-600" strokeWidth={2.5} />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-purple-600" strokeWidth={2.5} />
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  ) : null
                ))}
                {rowActions ? (
                  <th className={`px-3 sm:px-4 ${rowHeightClass} text-center font-bold uppercase tracking-wide text-gray-700`}>Actions</th>
                ) : null}
              </tr>
              {/* Column filter row removed as per requirement */}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td className="px-3 sm:px-4 py-12 text-center" colSpan={(columns.filter(c => visibleColumns[c.id]).length) + (rowActions ? 1 : 0) + (selectable ? 1 : 0)}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                      <p className="text-sm font-semibold text-gray-600">Loading data...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td className="px-3 sm:px-4 py-12 text-center" colSpan={(columns.filter(c => visibleColumns[c.id]).length) + (rowActions ? 1 : 0) + (selectable ? 1 : 0)}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-inner">
                        <TableIcon className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
                      </div>
                      <p className="text-base font-semibold text-gray-600">{emptyMessage}</p>
                      <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={`group hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 ${onRowClick ? 'cursor-pointer' : ''}`} 
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className={`px-3 sm:px-4 ${rowHeightClass}`}>
                        <input
                          type="checkbox"
                          checked={selectedRowIds?.includes(row.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const next = new Set(selectedRowIds || []);
                            if (isChecked) next.add(row.id); else next.delete(row.id);
                            onSelectionChange?.(Array.from(next));
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                      </td>
                    )}
                    {columns.map((c) => (
                      visibleColumns[c.id] ? (
                        <td key={c.id} className={`px-3 sm:px-4 ${rowHeightClass} text-sm font-medium text-gray-700 ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left'}`}>
                          {c.cell ? c.cell(accessValue(c, row), row) : String(accessValue(c, row) ?? '')}
                        </td>
                      ) : null
                    ))}
                    {rowActions ? (
                      <td className={`px-3 sm:px-4 ${rowHeightClass}`} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          {rowActions(row)?.map((a) => (
                            <Button 
                              key={a.id || a.label} 
                              variant={a.variant || 'ghost'} 
                              onClick={a.onClick} 
                              className="px-3 py-2 text-xs font-semibold rounded-lg hover:scale-110 transition-all duration-200"
                            >
                              {a.icon ? <a.icon className="h-4 w-4" strokeWidth={2.5} /> : null}
                              {a.label && <span className="ml-1">{a.label}</span>}
                            </Button>
                          ))}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-5 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Sparkles className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
            <span>Showing <span className="text-purple-700">{paginatedData.length}</span> of <span className="text-purple-700">{totalRows}</span> items</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Button 
              variant="outline" 
              onClick={() => { setPage((p) => Math.max(1, p - 1)); }} 
              disabled={currentPage <= 1} 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} /> 
              <span className="hidden sm:inline">Prev</span>
            </Button>
            
            <div className="flex items-center gap-2 px-4 py-2.5 bg-purple-100 border-2 border-purple-200 rounded-xl">
              <span className="text-sm font-bold text-purple-700">Page {currentPage} of {totalPages}</span>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); }} 
              disabled={currentPage >= totalPages} 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </Button>
            
            <select
              value={pageSize}
              onChange={(e) => { const next = Number(e.target.value); setPageSize(next); setPage(1); onPageSizeChange?.(next); }}
              className="border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-900 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 hover:border-purple-300"
            >
              {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}/page</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
