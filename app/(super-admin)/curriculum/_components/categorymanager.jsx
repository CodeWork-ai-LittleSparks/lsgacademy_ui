"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import programService, { createCategory, updateCategory } from "@/lib/api/services/programService";
import { Tag, Plus, Edit, X, Check, AlertCircle, Palette, FileText, Grid3x3, Save, Settings, Sparkles } from "lucide-react";

function isValidHexColor(v) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v);
}

export default function CategoryManager({ onClose, onUpdated }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    icon: "message-circle",
  });

  const [editForm, setEditForm] = useState({ name: "", description: "", color: "", icon: "" });

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await programService.getCategories({ noCache: true });
      if (res.success) {
        const list = Array.isArray(res.data) ? res.data : (res.data?.categories ?? []);
        setCategories(list);
      } else {
        setError(res.error || "Failed to load categories");
      }
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const resetMessages = () => { setError(null); setSuccessMsg(""); };

  const handleCreate = async (e) => {
    e?.preventDefault?.();
    resetMessages();
    if (!newCategory.name.trim()) {
      setError("Name is required");
      return;
    }
    if (newCategory.color && !isValidHexColor(newCategory.color)) {
      setError("Color must be a valid hex (e.g., #3B82F6)");
      return;
    }
    setCreating(true);
    try {
      const res = await createCategory({
        name: newCategory.name.trim(),
        description: newCategory.description?.trim() || "",
        color: newCategory.color || "",
        icon: newCategory.icon?.trim() || "",
      });
      if (res.success) {
        setSuccessMsg("Category created successfully!");
        setNewCategory({ name: "", description: "", color: "#3B82F6", icon: "message-circle" });
        await loadCategories();
        onUpdated?.();
      } else {
        setError(res.error || "Failed to create category");
      }
    } catch (err) {
      setError(err?.message || "Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (cat) => {
    setUpdatingId(cat.id);
    setEditForm({
      name: cat.name || "",
      description: cat.description || "",
      color: cat.color || "",
      icon: cat.icon || "",
    });
    resetMessages();
  };

  const cancelEdit = () => {
    setUpdatingId(null);
    setEditForm({ name: "", description: "", color: "", icon: "" });
    resetMessages();
  };

  const handleUpdate = async () => {
    resetMessages();
    if (!editForm.name.trim()) {
      setError("Name is required");
      return;
    }
    if (editForm.color && !isValidHexColor(editForm.color)) {
      setError("Color must be a valid hex (e.g., #FF0000)");
      return;
    }
    try {
      const res = await updateCategory(updatingId, {
        name: editForm.name.trim(),
        description: editForm.description?.trim() || "",
        color: editForm.color || "",
        icon: editForm.icon?.trim() || "",
      });
      if (res.success) {
        setSuccessMsg("Category updated successfully!");
        setUpdatingId(null);
        await loadCategories();
        onUpdated?.();
      } else {
        setError(res.error || "Failed to update category");
      }
    } catch (err) {
      setError(err?.message || "Failed to update category");
    }
  };

  const list = useMemo(() => Array.isArray(categories) ? categories : [], [categories]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white pb-4 border-b-2 border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
              <Settings className="w-6 h-6 text-purple-600" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Manage Categories
              </h2>
              <p className="text-sm text-gray-600 mt-0.5 font-medium">
                Create and organize program categories
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200 hover:scale-105"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            Close
          </Button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-red-200 bg-red-50 animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      )}
      {successMsg && (
        <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-green-200 bg-green-50 animate-in fade-in duration-300">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <p className="text-sm font-semibold text-green-700">{successMsg}</p>
        </div>
      )}

      {/* Create Category Card */}
      <Card className="rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-gray-200">
          <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-sm">
            <Plus className="w-5 h-5 text-green-600" strokeWidth={2.5} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Create New Category
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
              <Tag className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
              Name *
            </label>
            <Input 
              value={newCategory.name} 
              onChange={(e) => setNewCategory((c) => ({ ...c, name: e.target.value }))} 
              placeholder="e.g., Language Arts"
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 bg-white font-medium transition-all duration-200 hover:border-purple-300"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
              <Grid3x3 className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
              Icon
            </label>
            <Input 
              value={newCategory.icon} 
              onChange={(e) => setNewCategory((c) => ({ ...c, icon: e.target.value }))} 
              placeholder="e.g., book-open"
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white font-medium transition-all duration-200 hover:border-blue-300"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
              <FileText className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
              Description
            </label>
            <textarea 
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 bg-white font-medium transition-all duration-200 hover:border-orange-300 resize-none" 
              rows={3} 
              value={newCategory.description} 
              onChange={(e) => setNewCategory((c) => ({ ...c, description: e.target.value }))}
              placeholder="Describe this category and its purpose..."
            />
          </div>

          {/* Color */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
              <Palette className="w-4 h-4 text-green-600" strokeWidth={2.5} />
              Color (Hex Code)
            </label>
            <div className="flex items-center gap-3">
              <Input 
                value={newCategory.color} 
                onChange={(e) => setNewCategory((c) => ({ ...c, color: e.target.value }))} 
                placeholder="#3B82F6"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white font-mono font-medium transition-all duration-200 hover:border-green-300"
              />
              <div 
                className="w-14 h-14 rounded-xl border-2 border-gray-300 shadow-md flex-shrink-0 transition-transform hover:scale-110" 
                style={{ backgroundColor: isValidHexColor(newCategory.color) ? newCategory.color : '#e5e7eb' }} 
              />
            </div>
          </div>

          {/* Create Button */}
          <div className="flex items-end">
            <Button 
              variant="primary" 
              onClick={handleCreate} 
              disabled={creating}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" strokeWidth={2.5} />
                  <span>Create Category</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Categories List Card */}
      <Card className="rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-sm">
              <Tag className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                All Categories
              </h3>
              <p className="text-xs text-gray-600 font-medium">{list.length} total</p>
            </div>
          </div>
          {loading && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 rounded-full">
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-blue-700">Loading...</span>
            </div>
          )}
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
            <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-inner mb-4">
              <Tag className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1">
              No categories yet
            </h4>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Create your first category above to start organizing your programs
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border-2 border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 border-b-2 border-gray-200">
                <tr className="text-left text-xs">
                  <th className="py-3.5 px-4 font-bold text-gray-700 uppercase tracking-wide">Name</th>
                  <th className="py-3.5 px-4 font-bold text-gray-700 uppercase tracking-wide hidden md:table-cell">Description</th>
                  <th className="py-3.5 px-4 font-bold text-gray-700 uppercase tracking-wide hidden lg:table-cell">Icon</th>
                  <th className="py-3.5 px-4 font-bold text-gray-700 uppercase tracking-wide">Color</th>
                  <th className="py-3.5 px-4 font-bold text-gray-700 uppercase tracking-wide hidden xl:table-cell">Updated</th>
                  <th className="py-3.5 px-4 font-bold text-gray-700 uppercase tracking-wide text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.map((cat) => {
                  const isEditing = updatingId === cat.id;
                  return (
                    <tr key={cat.id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200">
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <Input 
                            value={editForm.name} 
                            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 font-medium"
                          />
                        ) : (
                          <span className="font-bold text-gray-900">{cat.name}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        {isEditing ? (
                          <textarea 
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 font-medium resize-none" 
                            rows={2} 
                            value={editForm.description} 
                            onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} 
                          />
                        ) : (
                          <span className="text-gray-700 text-sm line-clamp-2">{cat.description || '—'}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 hidden lg:table-cell">
                        {isEditing ? (
                          <Input 
                            value={editForm.icon} 
                            onChange={(e) => setEditForm((f) => ({ ...f, icon: e.target.value }))}
                            className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 font-medium"
                          />
                        ) : (
                          <span className="text-gray-700 text-sm font-mono">{cat.icon || '—'}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <Input 
                                value={editForm.color} 
                                onChange={(e) => setEditForm((f) => ({ ...f, color: e.target.value }))}
                                className="w-24 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 font-medium font-mono text-xs"
                              />
                              <div 
                                className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm flex-shrink-0" 
                                style={{ backgroundColor: isValidHexColor(editForm.color) ? editForm.color : '#fff' }} 
                              />
                            </>
                          ) : (
                            <>
                              <span className="text-gray-700 text-xs font-mono">{cat.color || '—'}</span>
                              <div 
                                className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm flex-shrink-0" 
                                style={{ backgroundColor: isValidHexColor(cat.color || '') ? cat.color : '#e5e7eb' }} 
                              />
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 text-xs font-medium hidden xl:table-cell">
                        {cat.updated_at ? new Date(cat.updated_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) : '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="primary" 
                              onClick={handleUpdate}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-xs shadow-md transition-all duration-200 hover:scale-105"
                            >
                              <Save className="w-3.5 h-3.5" strokeWidth={2.5} />
                              Save
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={cancelEdit}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-gray-300 hover:bg-gray-50 font-semibold text-xs transition-all duration-200"
                            >
                              <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <Button 
                              variant="outline" 
                              onClick={() => startEdit(cat)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-purple-600 font-semibold text-xs shadow-sm transition-all duration-200 hover:scale-105"
                            >
                              <Edit className="w-3.5 h-3.5" strokeWidth={2.5} />
                              Edit
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
