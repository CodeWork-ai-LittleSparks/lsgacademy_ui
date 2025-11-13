"use client";
import React, { useEffect, useMemo, useState, useRef } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import {
  getProfile,
  uploadProfilePicture,
  updateProfile,
  changePassword,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getPerformanceCategories,
  updatePerformanceCategories,
} from '@/lib/api/services/settingsService';
import { toPublicAssetUrl } from '@/lib/utils/urlUtils';
import {
  User,
  Shield,
  Tag,
  TrendingUp,
  Camera,
  Lock,
  Mail,
  Phone,
  Briefcase,
  Award,
  FileText,
  Eye,
  EyeOff,
  Save,
  X,
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  AlertCircle,
  Settings as SettingsIcon,
  Palette
} from 'lucide-react';

function Tabs({ active, onChange, items }) {
  return (
    <div>
      {/* Mobile: dropdown */}
      <div className="sm:hidden mb-4">
        <Dropdown
          options={items.map((i) => ({ value: i.key, label: i.label }))}
          value={active}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Settings tabs"
          className="w-full px-4 py-3 border-2 border-[#E9B3FB] rounded-xl bg-white text-gray-900 font-semibold"
        />
      </div>
      {/* Desktop: horizontal tabs */}
      <div role="tablist" aria-label="Settings sections" className="hidden sm:flex gap-2 border-b-2 border-[#E9B3FB]">
        {items.map((i) => (
          <button
            key={i.key}
            role="tab"
            aria-selected={active === i.key}
            onClick={() => onChange(i.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
              active === i.key 
                ? 'border-[#6F00FF] text-[#6F00FF] bg-[#FFF1F1]' 
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-[#FFF1F1]'
            }`}
          >
            {i.icon}
            {i.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function useUnsaved(original, draft) {
  return useMemo(() => JSON.stringify(original) !== JSON.stringify(draft), [original, draft]);
}

function validateHex(hex) {
  return /^#([0-9a-fA-F]{6})$/.test(hex || '');
}

function passwordStrength(pw) {
  const len = (pw || '').length;
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const score = (len >= 8) + hasUpper + hasLower + hasNumber + hasSpecial;
  if (score >= 4) return 'strong';
  if (score >= 3) return 'medium';
  return 'weak';
}

export default function SettingsPage() {
  const TAB_ITEMS = [
    { key: 'profile', label: 'Profile', icon: <User className="w-4 h-4" strokeWidth={2.5} /> },
    { key: 'security', label: 'Security', icon: <Shield className="w-4 h-4" strokeWidth={2.5} /> },
    { key: 'categories', label: 'Categories', icon: <Tag className="w-4 h-4" strokeWidth={2.5} /> },
    { key: 'performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4" strokeWidth={2.5} /> },
  ];
  const [activeTab, setActiveTab] = useState('profile');

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', role: '', qualifications: '', experience_years: '', bio: '' });
  const [originalForm, setOriginalForm] = useState(form);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const fileInputRef = useRef(null);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securityError, setSecurityError] = useState('');
  const [securityMessage, setSecurityMessage] = useState('');

  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', color: '#6F00FF', icon: '' });
  const [categorySaving, setCategorySaving] = useState(false);

  const [perfLoading, setPerfLoading] = useState(false);
  const [perfError, setPerfError] = useState('');
  const [perfCategories, setPerfCategories] = useState([]);
  const [perfEditingId, setPerfEditingId] = useState(null);
  const [perfSaving, setPerfSaving] = useState(false);
  const perfHasChanges = useUnsaved(perfCategories, perfCategories);

  useEffect(() => {
    let mounted = true;
    setProfileLoading(true); setProfileError('');
    getProfile()
      .then((res) => {
        if (!mounted) return;
        if (res.success) {
          setProfile(res.data);
          const user = res.data?.user || {};
          const teacher = res.data?.teacher || {};
          const draft = {
            full_name: user.full_name || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || '',
            qualifications: teacher.qualifications || '',
            experience_years: teacher.experience_years ?? '',
            bio: teacher.bio || '',
          };
          setForm(draft);
          setOriginalForm(draft);
        } else {
          setProfileError(res.error || 'Failed to load profile');
        }
      })
      .finally(() => mounted && setProfileLoading(false));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (activeTab === 'categories' && categories.length === 0 && !categoriesLoading) {
      setCategoriesLoading(true); setCategoriesError('');
      getCategories()
        .then((res) => {
          if (res.success) setCategories(res.data);
          else setCategoriesError(res.error || 'Failed to load categories');
        })
        .finally(() => setCategoriesLoading(false));
    }
    if (activeTab === 'performance' && perfCategories.length === 0 && !perfLoading) {
      setPerfLoading(true); setPerfError('');
      getPerformanceCategories()
        .then((res) => {
          if (res.success) setPerfCategories((res.data || []).sort((a, b) => (a.order_index || 0) - (b.order_index || 0)));
          else setPerfError(res.error || 'Failed to load performance categories');
        })
        .finally(() => setPerfLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  function onSelectPhoto(file) {
    if (!file) return;
    const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
    const isValidSize = file.size <= 2 * 1024 * 1024;
    if (!isValidType) { setProfileError('Only JPG or PNG allowed'); return; }
    if (!isValidSize) { setProfileError('File must be ≤ 2MB'); return; }
    setProfileError('');
    setProfilePicture(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }
  function clearPhoto() {
    setProfilePicture(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
  }
  function validateProfile(d) {
    const e = {};
    const nameLen = (d.full_name || '').trim().length;
    if (nameLen < 3 || nameLen > 255) e.full_name = 'Name must be 3-255 characters';
    const phone = (d.phone || '').trim();
    if (phone && !/^\+?[0-9]{10,15}$/.test(phone)) e.phone = 'Invalid phone format';
    const exp = d.experience_years;
    if (typeof exp !== 'undefined' && exp !== '' && (Number(exp) < 0 || Number(exp) > 50)) e.experience_years = 'Experience must be between 0-50';
    return e;
  }
  async function saveProfile() {
    const errs = validateProfile(form);
    if (Object.keys(errs).length) { setProfileError(Object.values(errs)[0]); return; }
    setProfileSaving(true); setProfileMessage(''); setProfileError('');
    const { full_name, phone, qualifications, experience_years, bio } = form;
    if (profilePicture) {
      const up = await uploadProfilePicture(profilePicture);
      if (!up.success) { setProfileSaving(false); setProfileError(up.error || 'Failed to upload profile picture'); return; }
    }
    const res = await updateProfile({ full_name, phone, qualifications, experience_years, bio });
    setProfileSaving(false);
    if (!res.success) { setProfileError(res.error || 'Failed to update profile'); return; }
    setProfileMessage(res.message || 'Profile updated successfully');
    setOriginalForm(form);
    clearPhoto();
    const ref = await getProfile();
    if (ref.success) setProfile(ref.data);
  }
  function cancelProfile() {
    const dirty = useUnsaved(originalForm, form);
    if (dirty && typeof window !== 'undefined') {
      const ok = window.confirm('Discard unsaved changes?');
      if (!ok) return;
    }
    setForm(originalForm);
    clearPhoto();
    setProfileError(''); setProfileMessage('');
  }

  function validateSecurity() {
    const e = {};
    const cur = passwords.current;
    const nw = passwords.new;
    const cf = passwords.confirm;
    if (!cur || cur.length < 6) e.current = 'Current password is required';
    if (!nw || nw.length < 8) e.new = 'New password must be at least 8 characters';
    if (nw === cur) e.same = 'New password must be different from current';
    const s = passwordStrength(nw);
    if (s === 'weak') e.complexity = 'New password does not meet complexity requirements';
    if (!cf || cf !== nw) e.confirm = 'Passwords do not match';
    return e;
  }
  async function submitSecurity() {
    setSecurityMessage(''); setSecurityError('');
    const errs = validateSecurity();
    if (Object.keys(errs).length) { setSecurityError(Object.values(errs)[0]); return; }
    setSecuritySaving(true);
    const res = await changePassword({ current_password: passwords.current, new_password: passwords.new, confirm_password: passwords.confirm });
    setSecuritySaving(false);
    if (!res.success) { setSecurityError(res.error || 'Failed to change password'); return; }
    setSecurityMessage(res.message || 'Password changed successfully');
    setPasswords({ current: '', new: '', confirm: '' });
  }

  function openCategoryModal(cat = null) {
    setEditingCategory(cat);
    setCategoryForm(cat ? { name: cat.name || '', description: cat.description || '', color: cat.color || '#6F00FF', icon: cat.icon || '' } : { name: '', description: '', color: '#6F00FF', icon: '' });
    setCategoryModalOpen(true);
  }
  function closeCategoryModal() { setCategoryModalOpen(false); setEditingCategory(null); }
  function validateCategory(d) {
    const e = {};
    if (!d.name || d.name.trim().length < 3 || d.name.trim().length > 100) e.name = 'Name must be 3-100 characters';
    if (!d.description || d.description.trim().length < 10 || d.description.trim().length > 500) e.description = 'Description must be 10-500 characters';
    if (!validateHex(d.color)) e.color = 'Color must be valid hex (#RRGGBB)';
    return e;
  }
  async function saveCategory() {
    const errs = validateCategory(categoryForm);
    if (Object.keys(errs).length) { setCategoriesError(Object.values(errs)[0]); return; }
    setCategorySaving(true); setCategoriesError('');
    let res;
    if (editingCategory) res = await updateCategory(editingCategory.id || editingCategory.category_id, categoryForm);
    else res = await createCategory(categoryForm);
    setCategorySaving(false);
    if (!res.success) { setCategoriesError(res.error || 'Failed to save category'); return; }
    closeCategoryModal();
    const list = await getCategories();
    if (list.success) setCategories(list.data);
  }
  async function onDeleteCategory(cat) {
    if (!cat) return;
    if (cat.programs_count && cat.programs_count > 0) {
      alert(`Cannot delete: ${cat.programs_count} programs use this category`);
      return;
    }
    const ok = window.confirm(`Delete ${cat.name} category? This cannot be undone.`);
    if (!ok) return;
    const res = await deleteCategory(cat.id || cat.category_id);
    if (!res.success) { setCategoriesError(res.error || 'Failed to delete category'); return; }
    setCategories((prev) => prev.filter((c) => (c.id || c.category_id) !== (cat.id || cat.category_id)));
  }

  function startPerfEdit(id) { setPerfEditingId(id); }
  function cancelPerfEdit() { setPerfEditingId(null); setPerfError(''); }
  function updatePerfField(id, field, value) {
    setPerfCategories((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }
  function movePerf(id, dir) {
    setPerfCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swapWith = dir === 'up' ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= next.length) return prev;
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next.map((c, i) => ({ ...c, order_index: i + 1 }));
    });
  }
  async function savePerf() {
    setPerfSaving(true); setPerfError('');
    const names = new Set();
    for (const c of perfCategories) {
      if (!c.name || c.name.trim().length < 3 || c.name.trim().length > 100) { setPerfError('Name must be 3-100 characters'); setPerfSaving(false); return; }
      if (!c.description || c.description.trim().length < 10 || c.description.trim().length > 500) { setPerfError('Description must be 10-500 characters'); setPerfSaving(false); return; }
      if (!c.criteria || c.criteria.trim().length < 20 || c.criteria.trim().length > 1000) { setPerfError('Criteria must be 20-1000 characters'); setPerfSaving(false); return; }
      if (!validateHex(c.color)) { setPerfError('Color must be valid hex'); setPerfSaving(false); return; }
      const key = c.name.trim().toLowerCase();
      if (names.has(key)) { setPerfError('Category names must be unique'); setPerfSaving(false); return; }
      names.add(key);
    }
    const res = await updatePerformanceCategories(perfCategories.map((c, i) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      criteria: c.criteria,
      color: c.color,
      icon: c.icon,
      order_index: i + 1,
    })));
    setPerfSaving(false);
    if (!res.success) { setPerfError(res.error || 'Failed to update performance categories'); return; }
    setPerfEditingId(null);
    const ref = await getPerformanceCategories();
    if (ref.success) setPerfCategories((ref.data || []).sort((a, b) => (a.order_index || 0) - (b.order_index || 0)));
  }

  const profileDirty = useUnsaved(originalForm, form) || !!profilePicture;

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-[#FFF1F1]/20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-[#E9B3FB] to-[#6F00FF]/30 rounded-xl shadow-sm">
          <SettingsIcon className="w-6 h-6 text-[#3B0270]" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-600 font-medium mt-0.5">Manage your profile, security, and system configuration</p>
        </div>
      </div>

      <Tabs active={activeTab} onChange={setActiveTab} items={TAB_ITEMS} />

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl border-2 border-[#E9B3FB] bg-white p-5 sm:p-6 space-y-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-900">Profile Settings</h2>
          
          {profileLoading ? (
            <p className="text-sm text-gray-600">Loading profile...</p>
          ) : profileError ? (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{profileError}</p>
          ) : (
            <>
              {/* Avatar Section - Centered */}
              <div className="flex flex-col items-center gap-4 pb-6 border-b-2 border-[#E9B3FB]">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#E9B3FB] to-[#FFF1F1] flex items-center justify-center ring-4 ring-[#E9B3FB]/50 shadow-lg">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <img src={toPublicAssetUrl(profile?.user?.profile_picture_url || '/avatar-placeholder.png')} alt="Profile" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => onSelectPhoto(e.target.files?.[0])}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()} 
                    className="border-2 border-[#6F00FF] text-[#6F00FF] hover:bg-[#FFF1F1] font-semibold"
                  >
                    <Camera className="w-4 h-4 mr-2" strokeWidth={2.5} />
                    Change Photo
                  </Button>
                  {profilePicture && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearPhoto}
                      className="text-red-600 hover:bg-red-50 font-semibold"
                    >
                      <X className="w-4 h-4 mr-2" strokeWidth={2.5} />
                      Remove
                    </Button>
                  )}
                </div>
                {profilePicture && (
                  <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                    New photo selected
                  </p>
                )}
              </div>

              {/* Form Fields - Full Width */}
              <div className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Full Name *</label>
                  <Input 
                    value={form.full_name} 
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })} 
                    aria-label="Full Name" 
                    className="w-full px-4 py-3 border-2 border-[#E9B3FB] rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                  <div className="relative">
                    <Input 
                      value={form.email} 
                      readOnly 
                      aria-label="Email" 
                      className="w-full px-4 py-3 pr-10 border-2 border-[#E9B3FB] rounded-xl bg-gray-100 text-gray-700 font-medium"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" strokeWidth={2.5} />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Phone</label>
                  <Input 
                    value={form.phone} 
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                    placeholder="Enter your phone number" 
                    aria-label="Phone" 
                    className="w-full px-4 py-3 border-2 border-[#E9B3FB] rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium placeholder:text-gray-500 transition-all"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Role</label>
                  <div className="flex items-center gap-3">
                    <Input 
                      value={form.role} 
                      readOnly 
                      className="flex-1 px-4 py-3 border-2 border-[#E9B3FB] rounded-xl bg-gray-100 text-gray-700 font-medium" 
                      aria-label="Role" 
                    />
                    <Badge className="px-4 py-2 bg-[#E9B3FB] text-[#3B0270] border-2 border-[#6F00FF] font-bold text-sm rounded-xl">
                      {String(form.role || '').replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Teacher-specific fields */}
                {String(form.role).includes('teacher') && (
                  <div className="pt-4 border-t-2 border-[#E9B3FB] space-y-5">
                    <h3 className="text-base font-bold text-gray-900">Teacher Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Qualifications */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Qualifications</label>
                        <Input 
                          value={form.qualifications} 
                          onChange={(e) => setForm({ ...form, qualifications: e.target.value })} 
                          aria-label="Qualifications" 
                          placeholder="e.g., B.Ed, M.A."
                          className="w-full px-4 py-3 border-2 border-[#E9B3FB] rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium placeholder:text-gray-500 transition-all"
                        />
                      </div>

                      {/* Years of Experience */}
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Years of Experience</label>
                        <Input 
                          type="number" 
                          min={0} 
                          max={50} 
                          value={form.experience_years} 
                          onChange={(e) => setForm({ ...form, experience_years: e.target.value })} 
                          aria-label="Experience" 
                          className="w-full px-4 py-3 border-2 border-[#E9B3FB] rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium transition-all"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Bio</label>
                      <textarea 
                        className="w-full px-4 py-3 border-2 border-[#E9B3FB] rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium placeholder:text-gray-500 resize-none transition-all" 
                        rows={4} 
                        value={form.bio} 
                        onChange={(e) => setForm({ ...form, bio: e.target.value })} 
                        aria-label="Bio"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 border-t-2 border-[#E9B3FB]">
                <Button 
                  variant="ghost" 
                  onClick={cancelProfile} 
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-[#FFF1F1] text-gray-900 font-bold transition-all"
                >
                  <X className="w-4 h-4 mr-2" strokeWidth={2.5} />
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={saveProfile} 
                  disabled={!profileDirty || profileSaving} 
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {profileSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" strokeWidth={2.5} />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
                {profileDirty && (
                  <span className="text-sm text-orange-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
                    Unsaved changes
                  </span>
                )}
              </div>

              {profileMessage && (
                <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-green-200 bg-green-50 animate-in fade-in">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <p className="text-sm font-semibold text-green-700">{profileMessage}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Security, Categories, Performance tabs remain the same as before */}
      {activeTab === 'security' && (
        <div className="rounded-2xl border-2 border-[#E9B3FB] bg-white p-4 space-y-4 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900">Account Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-900 font-semibold">Current Password *</label>
              <div className="flex gap-2">
                <Input type={showPw.current ? 'text' : 'password'} value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} aria-label="Current Password" className="border-[#E9B3FB] focus:border-[#6F00FF] focus:ring-[#6F00FF]/20 text-gray-900" />
                <Button size="sm" variant="ghost" onClick={() => setShowPw({ ...showPw, current: !showPw.current })} className="hover:bg-[#FFF1F1] text-gray-900">{showPw.current ? 'Hide' : 'Show'}</Button>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-900 font-semibold">New Password *</label>
              <div className="flex gap-2">
                <Input type={showPw.new ? 'text' : 'password'} value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} aria-label="New Password" className="border-[#E9B3FB] focus:border-[#6F00FF] focus:ring-[#6F00FF]/20 text-gray-900" />
                <Button size="sm" variant="ghost" onClick={() => setShowPw({ ...showPw, new: !showPw.new })} className="hover:bg-[#FFF1F1] text-gray-900">{showPw.new ? 'Hide' : 'Show'}</Button>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-2 w-24 rounded bg-gray-200 overflow-hidden">
                  <div className={`h-2 ${passwordStrength(passwords.new) === 'weak' ? 'bg-red-500 w-1/3' : passwordStrength(passwords.new) === 'medium' ? 'bg-yellow-500 w-2/3' : 'bg-gradient-to-r from-[#6F00FF] to-[#3B0270] w-full'}`}></div>
                </div>
                <span className="text-xs text-gray-700 capitalize font-semibold">{passwordStrength(passwords.new)}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-900 font-semibold">Confirm New Password *</label>
              <div className="flex gap-2">
                <Input type={showPw.confirm ? 'text' : 'password'} value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} aria-label="Confirm Password" className="border-[#E9B3FB] focus:border-[#6F00FF] focus:ring-[#6F00FF]/20 text-gray-900" />
                <Button size="sm" variant="ghost" onClick={() => setShowPw({ ...showPw, confirm: !showPw.confirm })} className="hover:bg-[#FFF1F1] text-gray-900">{showPw.confirm ? 'Hide' : 'Show'}</Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setPasswords({ current: '', new: '', confirm: '' })} className="hover:bg-[#FFF1F1] text-gray-900">Cancel</Button>
            <Button variant="primary" onClick={submitSecurity} disabled={securitySaving} className="bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white">{securitySaving ? 'Changing...' : 'Change Password'}</Button>
          </div>
          {securityError ? <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{securityError}</p> : null}
          {securityMessage ? <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">{securityMessage}</p> : null}
          <div className="text-sm text-gray-900 bg-[#FFF1F1] border border-[#E9B3FB] rounded-lg p-3">
            <p className="font-semibold mb-1">Password Requirements:</p>
            <p className="text-gray-700">• At least 8 characters • Include uppercase and lowercase • Include numbers</p>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="rounded-2xl border-2 border-[#E9B3FB] bg-white p-4 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Program Categories</h2>
            <Button variant="primary" size="sm" onClick={() => openCategoryModal()} className="bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white">+ Add Category</Button>
          </div>
          {categoriesLoading ? (
            <p className="text-sm text-gray-600">Loading categories...</p>
          ) : categoriesError ? (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{categoriesError}</p>
          ) : (
            <div className="space-y-3">
              {categories.map((c) => (
                <div key={c.id || c.category_id} className="border-2 border-[#E9B3FB] rounded-xl p-3 flex items-center justify-between hover:bg-[#FFF1F1] transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: c.color || '#6F00FF' }}></span>
                    <div>
                      <div className="font-medium text-gray-900">{c.name} <span className="ml-2 text-gray-500 text-xs">{c.programs_count ?? 0} programs</span></div>
                      <div className="text-sm text-gray-700">{c.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => openCategoryModal(c)} className="border-[#6F00FF] text-[#6F00FF] hover:bg-[#FFF1F1]">Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => onDeleteCategory(c)}>Delete</Button>
                  </div>
                </div>
              ))}
              {categories.length === 0 ? <p className="text-sm text-gray-600">No categories found.</p> : null}
            </div>
          )}

          {categoryModalOpen && (
            <Modal>
              <div className="bg-white rounded-2xl p-4 w-[90vw] max-w-[390px] shadow-2xl border-2 border-[#E9B3FB]">
                <h3 className="text-md font-semibold mb-3 text-gray-900">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-900 font-semibold">Name *</label>
                    <Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="border-[#E9B3FB] focus:border-[#6F00FF] focus:ring-[#6F00FF]/20 text-gray-900" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-900 font-semibold">Description *</label>
                    <textarea className="border-2 border-[#E9B3FB] focus:border-[#6F00FF] focus:ring-2 focus:ring-[#6F00FF]/20 rounded px-3 py-2 w-full text-gray-900" rows={3} value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-900 font-semibold">Color *</label>
                      <Input type="color" value={categoryForm.color} onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-900 font-semibold">Icon</label>
                      <Input value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} placeholder="e.g., star" className="border-[#E9B3FB] focus:border-[#6F00FF] focus:ring-[#6F00FF]/20 text-gray-900" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="ghost" onClick={closeCategoryModal} className="hover:bg-[#FFF1F1] text-gray-900">Cancel</Button>
                  <Button variant="primary" onClick={saveCategory} disabled={categorySaving} className="bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white">{categorySaving ? 'Saving...' : 'Save'}</Button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="rounded-2xl border-2 border-[#E9B3FB] bg-white p-4 space-y-4 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900">Performance Categories</h2>
          <p className="text-sm text-gray-600">These categories are used for student evaluations</p>
          {perfLoading ? (
            <p className="text-sm text-gray-600">Loading...</p>
          ) : perfError ? (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{perfError}</p>
          ) : (
            <div className="space-y-2">
              {perfCategories.map((c, i) => (
                <div key={c.id} className="border-2 border-[#E9B3FB] rounded-xl p-3 hover:bg-[#FFF1F1] transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: c.color || '#6F00FF' }}></span>
                      <div>
                        <div className="font-medium text-gray-900">{i + 1}. {c.name}</div>
                        <div className="text-sm text-gray-700">{c.description}</div>
                        <div className="text-xs text-gray-500">Criteria: {c.criteria}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => movePerf(c.id, 'up')} className="hover:bg-[#FFF1F1] hover:text-[#6F00FF]">↑</Button>
                      <Button size="sm" variant="ghost" onClick={() => movePerf(c.id, 'down')} className="hover:bg-[#FFF1F1] hover:text-[#6F00FF]">↓</Button>
                      <Button size="sm" variant="outline" onClick={() => startPerfEdit(c.id)} className="border-[#6F00FF] text-[#6F00FF] hover:bg-[#FFF1F1]">Edit</Button>
                    </div>
                  </div>
                  {perfEditingId === c.id && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t-2 border-[#E9B3FB]">
                      <div>
                        <label className="text-sm text-gray-900 font-semibold">Name</label>
                        <Input value={c.name} onChange={(e) => updatePerfField(c.id, 'name', e.target.value)} className="border-[#E9B3FB] focus:border-[#6F00FF] focus:ring-[#6F00FF]/20 text-gray-900" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-900 font-semibold">Color</label>
                        <Input type="color" value={c.color} onChange={(e) => updatePerfField(c.id, 'color', e.target.value)} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-900 font-semibold">Description</label>
                        <Input value={c.description} onChange={(e) => updatePerfField(c.id, 'description', e.target.value)} className="border-[#E9B3FB] focus:border-[#6F00FF] focus:ring-[#6F00FF]/20 text-gray-900" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-900 font-semibold">Criteria</label>
                        <textarea className="border-2 border-[#E9B3FB] focus:border-[#6F00FF] focus:ring-2 focus:ring-[#6F00FF]/20 rounded px-3 py-2 w-full text-gray-900" rows={3} value={c.criteria} onChange={(e) => updatePerfField(c.id, 'criteria', e.target.value)}></textarea>
                      </div>
                      <div>
                        <label className="text-sm text-gray-900 font-semibold">Icon</label>
                        <Input value={c.icon || ''} onChange={(e) => updatePerfField(c.id, 'icon', e.target.value)} placeholder="e.g., star" className="border-[#E9B3FB] focus:border-[#6F00FF] focus:ring-[#6F00FF]/20 text-gray-900" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={cancelPerfEdit} className="hover:bg-[#FFF1F1] text-gray-900">Cancel</Button>
                        <Button variant="primary" size="sm" onClick={savePerf} disabled={perfSaving} className="bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white">{perfSaving ? 'Saving...' : 'Save Changes'}</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
