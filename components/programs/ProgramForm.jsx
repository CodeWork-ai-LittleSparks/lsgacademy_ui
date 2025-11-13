"use client";
import { useEffect, useMemo, useState } from 'react';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import Button from '@/components/ui/Button';
import ThumbnailUpload from '@/components/programs/ThumbnailUpload';
import { getCategories } from '@/lib/api/services/programService';
import { BookOpen, Tag, FileText, Layers, Calendar, ToggleLeft, Save, X, AlertCircle, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';

export default function ProgramForm({ initialData = null, isEditing = false, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => ({
    name: initialData?.name || '',
    category_id: initialData?.category?.id || initialData?.category_id || '',
    description: initialData?.description || '',
    total_levels: initialData?.total_levels || '',
    age_from: initialData?.age_from || '',
    age_to: initialData?.age_to || '',
    is_active: typeof initialData?.is_active === 'boolean' ? initialData.is_active : true,
  }));
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoadingCategories(true);
    getCategories()
      .then((res) => {
        if (!isMounted) return;
        if (res.success) {
          const sorted = (res.data || []).slice().sort((a, b) => a.name.localeCompare(b.name));
          setCategories(sorted);
        }
      })
      .finally(() => isMounted && setLoadingCategories(false));
    return () => { isMounted = false; };
  }, []);

  const validate = () => {
    const e = {};
    const name = (form.name || '').trim();
    const desc = (form.description || '').trim();
    const levels = Number(form.total_levels);
    const ageFrom = Number(form.age_from);
    const ageTo = Number(form.age_to);
    if (!name || name.length < 3 || name.length > 255) e.name = 'Name must be 3-255 characters';
    if (!form.category_id) e.category_id = 'Category is required';
    if (!desc || desc.length < 10) e.description = 'Description must be at least 10 characters';
    if (!Number.isInteger(levels) || levels < 1 || levels > 50) e.total_levels = 'Total levels must be between 1 and 50';
    if (!Number.isInteger(ageFrom) || ageFrom < 3 || ageFrom > 18) e.age_from = 'Minimum age must be between 3 and 18';
    if (!Number.isInteger(ageTo) || ageTo < 3 || ageTo > 18) e.age_to = 'Maximum age must be between 3 and 18';
    if (!e.age_from && !e.age_to && !(ageFrom < ageTo)) e.age_to = 'Maximum age must be greater than minimum age';
    if (!isEditing && !thumbnailFile) e.thumbnail = 'Thumbnail is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) {
      const firstKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstKey}"]`);
      if (el && el.focus) el.focus();
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        name: form.name.trim(),
        category_id: form.category_id,
        description: form.description.trim(),
        total_levels: Number(form.total_levels),
        age_from: Number(form.age_from),
        age_to: Number(form.age_to),
        is_active: !!form.is_active,
      };
      const res = await onSubmit?.(payload, thumbnailFile);
      if (res?.success) {
        // navigation handled by caller
      } else {
        setSubmitError(res?.error || 'Submission failed');
      }
    } catch (err) {
      setSubmitError(err?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = [{ value: '', label: 'Select Category' }, ...categories.map((c) => ({ value: c.id, label: c.name }))];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Program Information Section */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
          <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" strokeWidth={2.5} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Program Information
          </h3>
        </div>

        <div className="space-y-5">
          {/* Thumbnail */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              <ImageIcon className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
              Program Thumbnail *
            </label>
            <ThumbnailUpload
              value={thumbnailFile}
              onChange={setThumbnailFile}
              onError={setThumbnailError}
              existingUrl={initialData?.thumbnail_url}
            />
            {errors.thumbnail && (
              <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-xs sm:text-sm font-semibold text-red-700">{errors.thumbnail}</span>
              </div>
            )}
            {thumbnailError && (
              <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-xs sm:text-sm font-semibold text-red-700">{thumbnailError}</span>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              <BookOpen className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
              Program Name *
            </label>
            <Input
              name="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Enter program name"
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white font-medium transition-all duration-200 hover:border-blue-300"
            />
            {errors.name && (
              <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-xs sm:text-sm font-semibold text-red-700">{errors.name}</span>
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              <Tag className="w-4 h-4 text-green-600" strokeWidth={2.5} />
              Category *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-green-100 rounded-lg pointer-events-none z-10">
                <Tag className="h-4 w-4 text-green-600" strokeWidth={2.5} />
              </div>
              <Dropdown
                name="category_id"
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                options={categoryOptions}
                className="pl-12 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white font-medium transition-all duration-200 hover:border-green-300 appearance-none w-full"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.category_id && (
              <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-xs sm:text-sm font-semibold text-red-700">{errors.category_id}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              <FileText className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 bg-white font-medium transition-all duration-200 hover:border-orange-300 resize-none"
              placeholder="Describe the program in detail..."
            />
            {errors.description && (
              <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-xs sm:text-sm font-semibold text-red-700">{errors.description}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Program Details Section */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
          <div className="p-2.5 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-sm">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" strokeWidth={2.5} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Program Details
          </h3>
        </div>

        <div className="space-y-5">
          {/* Total Levels */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              <Layers className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
              Total Levels *
            </label>
            <Input
              name="total_levels"
              type="number"
              value={form.total_levels}
              onChange={(e) => setForm((f) => ({ ...f, total_levels: e.target.value }))}
              min={1}
              max={50}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 bg-white font-medium transition-all duration-200 hover:border-purple-300"
              placeholder="1-50"
            />
            <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-2 font-medium">
              <span>Enter a number between 1 and 50</span>
            </div>
            {errors.total_levels && (
              <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-xs sm:text-sm font-semibold text-red-700">{errors.total_levels}</span>
              </div>
            )}
          </div>

          {/* Age Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                <Calendar className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                Minimum Age *
              </label>
              <Input
                name="age_from"
                type="number"
                value={form.age_from}
                onChange={(e) => setForm((f) => ({ ...f, age_from: e.target.value }))}
                min={3}
                max={18}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white font-medium transition-all duration-200 hover:border-green-300"
                placeholder="3-18"
              />
              {errors.age_from && (
                <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-xs sm:text-sm font-semibold text-red-700">{errors.age_from}</span>
                </div>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                <Calendar className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                Maximum Age *
              </label>
              <Input
                name="age_to"
                type="number"
                value={form.age_to}
                onChange={(e) => setForm((f) => ({ ...f, age_to: e.target.value }))}
                min={3}
                max={18}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 bg-white font-medium transition-all duration-200 hover:border-green-300"
                placeholder="3-18"
              />
              {errors.age_to && (
                <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span className="text-xs sm:text-sm font-semibold text-red-700">{errors.age_to}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              <ToggleLeft className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
              Program Status
            </label>
            <div className="flex gap-3">
              <label className="flex-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="status" 
                  checked={!!form.is_active} 
                  onChange={() => setForm((f) => ({ ...f, is_active: true }))}
                  className="sr-only peer"
                />
                <div className="flex items-center justify-center gap-2 p-3 sm:p-4 border-2 border-gray-200 rounded-xl peer-checked:border-green-500 peer-checked:bg-green-50 transition-all duration-200 hover:border-green-300">
                  <CheckCircle className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                  <span className="font-bold text-gray-900">Active</span>
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="status" 
                  checked={!form.is_active} 
                  onChange={() => setForm((f) => ({ ...f, is_active: false }))}
                  className="sr-only peer"
                />
                <div className="flex items-center justify-center gap-2 p-3 sm:p-4 border-2 border-gray-200 rounded-xl peer-checked:border-red-500 peer-checked:bg-red-50 transition-all duration-200 hover:border-red-300">
                  <XCircle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                  <span className="font-bold text-gray-900">Inactive</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <div className="flex-shrink-0 p-1.5 bg-red-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">{submitError}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
        <Button 
          variant="secondary" 
          type="button" 
          onClick={onCancel} 
          disabled={submitting}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
          Cancel
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          disabled={submitting}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" strokeWidth={2.5} />
              <span>{isEditing ? 'Update Program' : 'Create Program'}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
