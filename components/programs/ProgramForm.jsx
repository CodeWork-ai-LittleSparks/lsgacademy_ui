"use client";
import { useEffect, useMemo, useState } from 'react';
import ValidationMessage from '../common/ValidationMessage';
import ThumbnailUpload from '@/components/programs/ThumbnailUpload';
import { getCategories } from '@/lib/api/services/programService';
import { BookOpen, Tag, FileText, Layers, Calendar, Save, X, AlertCircle, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';

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
  const [touched, setTouched] = useState({});
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

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        const trimmedName = (value || '').trim();
        if (!trimmedName) return 'Program name is required';
        if (trimmedName.length < 3) return 'Program name must be at least 3 characters';
        if (trimmedName.length > 255) return 'Program name must be less than 255 characters';
        return '';
      
      case 'category_id':
        if (!value) return 'Category is required';
        return '';
      
      case 'description':
        const trimmedDesc = (value || '').trim();
        if (!trimmedDesc) return 'Description is required';
        if (trimmedDesc.length < 10) return 'Description must be at least 10 characters';
        if (trimmedDesc.length > 1000) return 'Description must be less than 1000 characters';
        return '';
      
      case 'total_levels':
        if (isEditing) return '';
        const levels = Number(value);
        if (!value || value === '') return 'Total levels is required';
        if (!Number.isInteger(levels)) return 'Total levels must be a whole number';
        if (levels < 1) return 'Total levels must be at least 1';
        if (levels > 50) return 'Total levels cannot exceed 50';
        return '';
      
      case 'age_from':
        if (isEditing) return '';
        const ageFrom = Number(value);
        if (!value || value === '') return 'Minimum age is required';
        if (!Number.isInteger(ageFrom)) return 'Age must be a whole number';
        if (ageFrom < 3) return 'Minimum age must be at least 3';
        if (ageFrom > 18) return 'Minimum age cannot exceed 18';
        return '';
      
      case 'age_to':
        if (isEditing) return '';
        const ageTo = Number(value);
        if (!value || value === '') return 'Maximum age is required';
        if (!Number.isInteger(ageTo)) return 'Age must be a whole number';
        if (ageTo < 3) return 'Maximum age must be at least 3';
        if (ageTo > 18) return 'Maximum age cannot exceed 18';
        // Cross-field validation
        const fromAge = Number(form.age_from);
        if (!isNaN(fromAge) && ageTo <= fromAge) {
          return 'Maximum age must be greater than minimum age';
        }
        return '';
      
      case 'thumbnail':
        if (!isEditing && !thumbnailFile && !initialData?.thumbnail_url) {
          return 'Thumbnail is required';
        }
        return '';
      
      default:
        return '';
    }
  };

  const validate = () => {
    const e = {};
    
    // Validate all fields
    e.name = validateField('name', form.name);
    e.category_id = validateField('category_id', form.category_id);
    e.description = validateField('description', form.description);
    if (!isEditing) {
      e.total_levels = validateField('total_levels', form.total_levels);
      e.age_from = validateField('age_from', form.age_from);
      e.age_to = validateField('age_to', form.age_to);
    }
    e.thumbnail = validateField('thumbnail', null);

    // Remove empty errors
    Object.keys(e).forEach(key => !e[key] && delete e[key]);
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBlur = (name) => {
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, form[name]);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleNumberChange = (name, value) => {
    // Only allow digits
    const numericValue = value.replace(/\D/g, '');
    setForm({ ...form, [name]: numericValue });
    if (touched[name]) {
      const error = validateField(name, numericValue);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(form).forEach(key => allTouched[key] = true);
    allTouched.thumbnail = true;
    setTouched(allTouched);
    
    if (!validate()) {
      const firstKey = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstKey}"]`);
      if (el && el.focus) el.focus();
      return;
    }
    
    try {
      setSubmitting(true);
      const payload = isEditing ? {
        name: form.name.trim(),
        category_id: form.category_id,
        description: form.description.trim(),
      } : {
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

  const inputClass = (name) => {
    const hasError = touched[name] && errors[name];
    return `w-full pl-11 pr-4 py-2.5 border-2 rounded-xl focus:ring-4 bg-white text-sm font-medium text-gray-900 placeholder:text-gray-400 transition-all duration-200 outline-none ${
      hasError 
        ? 'border-red-300 focus:ring-red-100 focus:border-red-500' 
        : 'border-gray-200 hover:border-purple-300 focus:ring-purple-100 focus:border-purple-500'
    }`;
  };

  const categoryOptions = [{ value: '', label: 'Select Category' }, ...categories.map((c) => ({ value: c.id, label: c.name }))];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Program Information Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b-2 border-gray-100">
          <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              Program Information
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">Basic details about the program</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Thumbnail */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Program Thumbnail
              {!isEditing && <span className="text-red-500">*</span>}
            </label>
            <ThumbnailUpload
              value={thumbnailFile}
              onChange={(file) => {
                setThumbnailFile(file);
                setTouched({ ...touched, thumbnail: true });
              }}
              onError={setThumbnailError}
              existingUrl={initialData?.thumbnail_url}
            />
            {touched.thumbnail && errors.thumbnail && <ValidationMessage message={errors.thumbnail} />}
            {thumbnailError && <ValidationMessage message={thumbnailError} />}
          </div>

          {/* Program Name */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Program Name
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-purple-100 rounded-lg pointer-events-none">
                <BookOpen className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className={inputClass('name')}
                placeholder="Enter the Program Name"
                maxLength={255}
              />
            </div>
            {touched.name && errors.name && <ValidationMessage message={errors.name} />}
            <p className="text-xs text-gray-500 mt-1.5 ml-0.5">{form.name.length}/255 characters</p>
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Category
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-green-100 rounded-lg pointer-events-none z-10">
                <Tag className="w-4 h-4 text-green-600" strokeWidth={2.5} />
              </div>
              <select
                name="category_id"
                value={form.category_id}
                onChange={(e) => handleChange('category_id', e.target.value)}
                onBlur={() => handleBlur('category_id')}
                className={`${inputClass('category_id')} appearance-none cursor-pointer`}
                disabled={loadingCategories}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {touched.category_id && errors.category_id && <ValidationMessage message={errors.category_id} />}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Description
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 p-1.5 bg-orange-100 rounded-lg pointer-events-none">
                <FileText className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                className={`${inputClass('description')} pt-2.5 resize-none`}
                rows={4}
                placeholder="Enter the Program Description"
                maxLength={1000}
              />
            </div>
            {touched.description && errors.description && <ValidationMessage message={errors.description} />}
            <p className="text-xs text-gray-500 mt-1.5 ml-0.5">{form.description.length}/1000 characters</p>
          </div>
        </div>
      </div>

      {/* Program Details Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b-2 border-gray-100">
          <div className="p-2.5 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-sm">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              Program Details
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">Levels and age range configuration</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Total Levels */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Total Levels
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-purple-100 rounded-lg pointer-events-none">
                <Layers className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
              </div>
              <input
                type="text"
                name="total_levels"
                value={form.total_levels}
                onChange={(e) => handleNumberChange('total_levels', e.target.value)}
                onBlur={() => handleBlur('total_levels')}
                className={inputClass('total_levels')}
                placeholder="Enter Total Levels (1-50)"
                maxLength={2}
                disabled={isEditing}
              />
            </div>
            {touched.total_levels && errors.total_levels && <ValidationMessage message={errors.total_levels} />}
            <p className="text-xs text-gray-500 mt-1.5 ml-0.5">Enter a number between 1 and 50</p>
          </div>

          {/* Age Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Minimum Age
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-green-100 rounded-lg pointer-events-none">
                  <Calendar className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  name="age_from"
                  value={form.age_from}
                  onChange={(e) => handleNumberChange('age_from', e.target.value)}
                  onBlur={() => handleBlur('age_from')}
                  className={inputClass('age_from')}
                  placeholder="Enter Min Age (3-18)"
                  maxLength={2}
                  disabled={isEditing}
                />
              </div>
              {touched.age_from && errors.age_from && <ValidationMessage message={errors.age_from} />}
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Maximum Age
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-green-100 rounded-lg pointer-events-none">
                  <Calendar className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  name="age_to"
                  value={form.age_to}
                  onChange={(e) => handleNumberChange('age_to', e.target.value)}
                  onBlur={() => handleBlur('age_to')}
                  className={inputClass('age_to')}
                  placeholder="Enter Max Age (3-18)"
                  maxLength={2}
                  disabled={isEditing}
                />
              </div>
              {touched.age_to && errors.age_to && <ValidationMessage message={errors.age_to} />}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Program Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input 
                  type="radio" 
                  name="is_active" 
                  checked={!!form.is_active} 
                  onChange={() => setForm({ ...form, is_active: true })}
                  className="sr-only peer"
                  disabled={isEditing}
                />
                <div className="flex items-center justify-center gap-2 p-3 sm:p-4 border-2 border-gray-200 rounded-xl peer-checked:border-green-500 peer-checked:bg-green-50 transition-all duration-200 hover:border-green-300 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                  <span className="font-bold text-sm text-gray-900">Active</span>
                </div>
              </label>
              <label className="cursor-pointer">
                <input 
                  type="radio" 
                  name="is_active" 
                  checked={!form.is_active} 
                  onChange={() => setForm({ ...form, is_active: false })}
                  className="sr-only peer"
                  disabled={isEditing}
                />
                <div className="flex items-center justify-center gap-2 p-3 sm:p-4 border-2 border-gray-200 rounded-xl peer-checked:border-red-500 peer-checked:bg-red-50 transition-all duration-200 hover:border-red-300 shadow-sm">
                  <XCircle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                  <span className="font-bold text-sm text-gray-900">Inactive</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Form Error Message */}
      {submitError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl shadow-sm">
          <div className="flex-shrink-0 p-1.5 bg-red-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">{submitError}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 pb-2">
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={submitting}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200 hover:scale-105 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={submitting}
          className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" strokeWidth={2.5} />
              <span>{isEditing ? 'Update Program' : 'Create Program'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
