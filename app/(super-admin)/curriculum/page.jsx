"use client";
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/authContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { getPrograms, getCategories } from '@/lib/api/services/programService';
import CategoryManager from '@/app/(super-admin)/curriculum/_components/CategoryManager';
import { 
  Search, 
  Filter, 
  Settings, 
  BookOpen, 
  Layers, 
  ChevronRight,
  CheckCircle,
  XCircle,
  Tag,
  Sparkles,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

export default function CurriculumProgramsPage() {
  const router = useRouter();
  const { isSuperAdmin } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      getPrograms({ status: 'active', limit: 10, page: 1, search, category_id: selectedCategoryId || undefined })
        .then((res) => {
          if (!isMounted) return;
          if (res.success) {
            const list = Array.isArray(res?.data?.programs) ? res.data.programs : [];
            setPrograms(list);
          } else {
            setError(res.error || 'Failed to load programs');
          }
        })
        .catch((e) => setError(e.message))
        .finally(() => isMounted && setLoading(false));
    }, 250);
    return () => { isMounted = false; clearTimeout(timer); };
  }, [search, selectedCategoryId]);

  useEffect(() => {
    let isMounted = true;
    setCatLoading(true);
    setCatError(null);
    getCategories()
      .then((res) => {
        if (!isMounted) return;
        if (res.success) {
          const list = Array.isArray(res.data?.categories) ? res.data.categories : (Array.isArray(res.data) ? res.data : []);
          setCategories(list);
        } else {
          setCatError(res.error || 'Failed to load categories');
        }
      })
      .catch((e) => setCatError(e.message))
      .finally(() => isMounted && setCatLoading(false));
    return () => { isMounted = false; };
  }, []);

  const filtered = programs;
  const getId = (p) => p?.program_id || p?.id;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
            <BookOpen className="w-6 h-6 text-purple-600" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Curriculum Management
            </h1>
            <p className="text-sm text-gray-600 font-medium mt-0.5">
              Select a program to manage its curriculum structure
            </p>
          </div>
        </div>
        {isSuperAdmin() && (
          <Button 
            variant="outline" 
            onClick={() => setShowCategoryManager(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-300 hover:bg-gray-50 font-semibold transition-all duration-200 hover:scale-105"
          >
            <Settings className="w-4 h-4" strokeWidth={2.5} />
            Manage Categories
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-5 rounded-xl border-2 border-red-200 bg-red-50">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-purple-100 rounded-lg">
            <Search className="text-purple-600 h-4 w-4" strokeWidth={2.5} />
          </div>
          <Input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search programs by name..." 
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 font-medium transition-all duration-200 hover:border-purple-300"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl bg-white min-w-fit">
          <Filter className="h-4 w-4 text-gray-600 flex-shrink-0" strokeWidth={2.5} />
          <label className="text-sm font-semibold text-gray-700 hidden sm:block">Category</label>
          <select
            className="border-none outline-none font-semibold text-gray-900 bg-transparent cursor-pointer"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {catLoading && (
            <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>

      {/* Category Error */}
      {catError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <AlertTriangle className="w-4 h-4 text-yellow-600" strokeWidth={2.5} />
          <span className="text-xs font-semibold text-yellow-700">{catError}</span>
        </div>
      )}

      {/* Programs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl p-6 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse h-32" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border-2 border-gray-200 shadow-md">
          <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-inner w-fit mx-auto mb-4">
            <FolderOpen className="h-12 w-12 text-gray-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No programs found</h3>
          <p className="text-gray-600 font-medium">
            {search || selectedCategoryId ? 'Try adjusting your search or filter criteria' : 'No active programs available'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 -z-30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-sm">
              <Layers className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Available Programs ({filtered.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((p) => {
              const id = getId(p);
              return (
                <Card 
                  key={id} 
                  className={`group relative overflow-hidden rounded-2xl border-2 bg-white p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 ${
                    p.is_active 
                      ? 'border-gray-200 hover:border-purple-300' 
                      : 'border-gray-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* Top Accent Line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 transition-opacity duration-300 ${
                    p.is_active
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100'
                      : 'bg-gradient-to-r from-gray-400 to-slate-400'
                  }`} />

                  {/* Decorative Background */}
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${
                    p.is_active 
                      ? 'bg-gradient-to-br from-purple-100 to-blue-100' 
                      : 'bg-gradient-to-br from-gray-100 to-slate-100'
                  }`} />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Program Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`flex-shrink-0 p-2.5 rounded-xl shadow-sm ${
                            p.is_active 
                              ? 'bg-gradient-to-br from-purple-100 to-blue-100' 
                              : 'bg-gray-100'
                          }`}>
                            <BookOpen className={`w-5 h-5 ${
                              p.is_active ? 'text-purple-600' : 'text-gray-500'
                            }`} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate mb-1">
                              {p.name}
                            </h2>
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Status Badge */}
                              {p.is_active ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                                  <CheckCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
                                  <XCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
                                  Inactive
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Program Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                          {p?.category?.name && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg">
                              <Tag className="w-3.5 h-3.5" strokeWidth={2.5} />
                              <span>{p.category.name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg">
                            <Layers className="w-3.5 h-3.5" strokeWidth={2.5} />
                            <span>{p.total_levels} Levels</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        variant="primary" 
                        onClick={() => router.push(`/curriculum/${id}`)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Manage</span>
                        <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <Modal>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-4">
            <CategoryManager 
              onClose={() => setShowCategoryManager(false)} 
              onUpdated={() => {
                setCatLoading(true);
                getCategories({ noCache: true }).then((res) => {
                  if (res.success) {
                    const list = Array.isArray(res.data?.categories) ? res.data.categories : (Array.isArray(res.data) ? res.data : []);
                    setCategories(list);
                  }
                }).finally(() => setCatLoading(false));
              }} 
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
