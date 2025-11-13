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
import { toPublicAssetUrl } from '@/lib/utils/urlutils';

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
        />
      </div>
      {/* Desktop: horizontal tabs */}
      <div role="tablist" aria-label="Settings sections" className="hidden sm:flex gap-2 border-b">
        {items.map((i) => (
          <button
            key={i.key}
            role="tab"
            aria-selected={active === i.key}
            onClick={() => onChange(i.key)}
            className={`px-3 py-2 text-sm border-b-2 ${active === i.key ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
          >
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
  // Active tabs for Super Admin
  const TAB_ITEMS = [
    { key: 'profile', label: 'Profile' },
    { key: 'security', label: 'Security' },
    { key: 'categories', label: 'Categories' },
    { key: 'performance', label: 'Performance' },
  ];
  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
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

  // Security state
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securityError, setSecurityError] = useState('');
  const [securityMessage, setSecurityMessage] = useState('');

  // Categories state
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', color: '#3B82F6', icon: '' });
  const [categorySaving, setCategorySaving] = useState(false);

  // Performance categories
  const [perfLoading, setPerfLoading] = useState(false);
  const [perfError, setPerfError] = useState('');
  const [perfCategories, setPerfCategories] = useState([]);
  const [perfEditingId, setPerfEditingId] = useState(null);
  const [perfSaving, setPerfSaving] = useState(false);
  const perfHasChanges = useUnsaved(perfCategories, perfCategories);

  // Init: load profile (and categories/performance lazily upon tab open)
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

  // Lazy load categories and performance when their tabs become active
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
  }, [activeTab]);

  // Profile handlers
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
    // If a new picture is selected, upload via specialized endpoint first
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
    // Refresh profile
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

  // Security handlers
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

  // Categories handlers
  function openCategoryModal(cat = null) {
    setEditingCategory(cat);
    setCategoryForm(cat ? { name: cat.name || '', description: cat.description || '', color: cat.color || '#3B82F6', icon: cat.icon || '' } : { name: '', description: '', color: '#3B82F6', icon: '' });
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
    // Refresh
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

  // Performance categories
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
    // Validation: names unique and descriptions, criteria length
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
    // Refresh from API
    const ref = await getPerformanceCategories();
    if (ref.success) setPerfCategories((ref.data || []).sort((a, b) => (a.order_index || 0) - (b.order_index || 0)));
  }

  const profileDirty = useUnsaved(originalForm, form) || !!profilePicture;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your profile, security, and system configuration</p>
      </div>

      <Tabs active={activeTab} onChange={setActiveTab} items={TAB_ITEMS} />

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="rounded-lg border bg-white p-4 space-y-4">
          <h2 className="text-lg font-semibold">Profile Settings</h2>
          {profileLoading ? (
            <p className="text-sm text-gray-600">Loading profile...</p>
          ) : profileError ? (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{profileError}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-[112px] h-[112px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {previewUrl ? (
                    // preview selected
                    <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <img src={toPublicAssetUrl(profile?.user?.profile_picture_url || '/avatar-placeholder.png')} alt="Profile" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => onSelectPhoto(e.target.files?.[0])}
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Change Photo</Button>
                  {profilePicture ? <Button variant="ghost" size="sm" onClick={clearPhoto}>Remove</Button> : null}
                </div>
                {profilePicture ? <p className="text-xs text-gray-600">New photo selected</p> : null}
              </div>

              {/* Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-700">Full Name *</label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} aria-label="Full Name" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Email</label>
                  <div className="relative">
                    <Input value={form.email} readOnly aria-label="Email" className="bg-gray-100" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs">🔒</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-700">Phone</label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Enter your phone number" aria-label="Phone" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Role</label>
                  <div className="flex items-center gap-2">
                    <Input value={form.role} readOnly className="bg-gray-100" aria-label="Role" />
                    <Badge>{String(form.role || '').replace('_', ' ')}</Badge>
                  </div>
                </div>

                {/* Teacher-specific fields (visible only if role = teacher) */}
                {String(form.role).includes('teacher') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-700">Qualifications</label>
                      <Input value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} aria-label="Qualifications" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Years of Experience</label>
                      <Input type="number" min={0} max={50} value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} aria-label="Experience" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-700">Bio</label>
                      <textarea className="border rounded px-3 py-2 w-full" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} aria-label="Bio" />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="ghost" onClick={cancelProfile}>Cancel</Button>
                  <Button variant="primary" onClick={saveProfile} disabled={!profileDirty || profileSaving}>{profileSaving ? 'Saving...' : 'Save Changes'}</Button>
                  {profileDirty ? <span className="text-xs text-gray-600">Unsaved changes</span> : null}
                </div>
                {profileMessage ? <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">{profileMessage}</p> : null}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="rounded-lg border bg-white p-4 space-y-4">
          <h2 className="text-lg font-semibold">Account Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700">Current Password *</label>
              <div className="flex gap-2">
                <Input type={showPw.current ? 'text' : 'password'} value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} aria-label="Current Password" />
                <Button size="sm" variant="ghost" onClick={() => setShowPw({ ...showPw, current: !showPw.current })}>{showPw.current ? 'Hide' : 'Show'}</Button>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-700">New Password *</label>
              <div className="flex gap-2">
                <Input type={showPw.new ? 'text' : 'password'} value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} aria-label="New Password" />
                <Button size="sm" variant="ghost" onClick={() => setShowPw({ ...showPw, new: !showPw.new })}>{showPw.new ? 'Hide' : 'Show'}</Button>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-2 w-24 rounded bg-gray-200 overflow-hidden">
                  <div className={`h-2 ${passwordStrength(passwords.new) === 'weak' ? 'bg-red-500 w-1/3' : passwordStrength(passwords.new) === 'medium' ? 'bg-yellow-500 w-2/3' : 'bg-green-500 w-full'}`}></div>
                </div>
                <span className="text-xs text-gray-600 capitalize">{passwordStrength(passwords.new)}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-700">Confirm New Password *</label>
              <div className="flex gap-2">
                <Input type={showPw.confirm ? 'text' : 'password'} value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} aria-label="Confirm Password" />
                <Button size="sm" variant="ghost" onClick={() => setShowPw({ ...showPw, confirm: !showPw.confirm })}>{showPw.confirm ? 'Hide' : 'Show'}</Button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setPasswords({ current: '', new: '', confirm: '' })}>Cancel</Button>
            <Button variant="primary" onClick={submitSecurity} disabled={securitySaving}>{securitySaving ? 'Changing...' : 'Change Password'}</Button>
          </div>
          {securityError ? <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{securityError}</p> : null}
          {securityMessage ? <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">{securityMessage}</p> : null}
          <div className="text-sm text-gray-600">
            <p>• At least 8 characters • Include uppercase and lowercase • Include numbers</p>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="rounded-lg border bg-white p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Program Categories</h2>
            <Button variant="primary" size="sm" onClick={() => openCategoryModal()}>+ Add Category</Button>
          </div>
          {categoriesLoading ? (
            <p className="text-sm text-gray-600">Loading categories...</p>
          ) : categoriesError ? (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{categoriesError}</p>
          ) : (
            <div className="space-y-3">
              {categories.map((c) => (
                <div key={c.id || c.category_id} className="border rounded p-3 flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: c.color || '#3B82F6' }}></span>
                    <div>
                      <div className="font-medium">{c.name} <span className="ml-2 text-gray-500 text-xs">{c.programs_count ?? 0} programs</span></div>
                      <div className="text-sm text-gray-700">{c.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => openCategoryModal(c)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => onDeleteCategory(c)}>Delete</Button>
                  </div>
                </div>
              ))}
              {categories.length === 0 ? <p className="text-sm text-gray-600">No categories found.</p> : null}
            </div>
          )}

          {categoryModalOpen && (
            <Modal>
              <div className="bg-white rounded-lg p-4 w-[90vw] max-w-[390px] shadow">
                <h3 className="text-md font-semibold mb-3">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-700">Name *</label>
                    <Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Description *</label>
                    <textarea className="border rounded px-3 py-2 w-full" rows={3} value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-700">Color *</label>
                      <Input type="color" value={categoryForm.color} onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Icon</label>
                      <Input value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} placeholder="e.g., star" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="ghost" onClick={closeCategoryModal}>Cancel</Button>
                  <Button variant="primary" onClick={saveCategory} disabled={categorySaving}>{categorySaving ? 'Saving...' : 'Save'}</Button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="rounded-lg border bg-white p-4 space-y-4">
          <h2 className="text-lg font-semibold">Performance Categories</h2>
          <p className="text-sm text-gray-600">These categories are used for student evaluations</p>
          {perfLoading ? (
            <p className="text-sm text-gray-600">Loading...</p>
          ) : perfError ? (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{perfError}</p>
          ) : (
            <div className="space-y-2">
              {perfCategories.map((c, i) => (
                <div key={c.id} className="border rounded p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <span className="inline-block w-4 h-4 rounded" style={{ backgroundColor: c.color || '#10B981' }}></span>
                      <div>
                        <div className="font-medium">{i + 1}. {c.name}</div>
                        <div className="text-sm text-gray-700">{c.description}</div>
                        <div className="text-xs text-gray-500">Criteria: {c.criteria}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => movePerf(c.id, 'up')}>↑</Button>
                      <Button size="sm" variant="ghost" onClick={() => movePerf(c.id, 'down')}>↓</Button>
                      <Button size="sm" variant="outline" onClick={() => startPerfEdit(c.id)}>Edit</Button>
                    </div>
                  </div>
                  {perfEditingId === c.id && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-gray-700">Name</label>
                        <Input value={c.name} onChange={(e) => updatePerfField(c.id, 'name', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm text-gray-700">Color</label>
                        <Input type="color" value={c.color} onChange={(e) => updatePerfField(c.id, 'color', e.target.value)} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-700">Description</label>
                        <Input value={c.description} onChange={(e) => updatePerfField(c.id, 'description', e.target.value)} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-700">Criteria</label>
                        <textarea className="border rounded px-3 py-2 w-full" rows={3} value={c.criteria} onChange={(e) => updatePerfField(c.id, 'criteria', e.target.value)}></textarea>
                      </div>
                      <div>
                        <label className="text-sm text-gray-700">Icon</label>
                        <Input value={c.icon || ''} onChange={(e) => updatePerfField(c.id, 'icon', e.target.value)} placeholder="e.g., star" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={cancelPerfEdit}>Cancel</Button>
                        <Button variant="primary" size="sm" onClick={savePerf} disabled={perfSaving}>{perfSaving ? 'Saving...' : 'Save Changes'}</Button>
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
