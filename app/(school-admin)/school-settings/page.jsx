"use client";
import React, { useEffect, useMemo, useState, useRef } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import Badge from '@/components/ui/Badge';
import {
  getProfile,
  uploadProfilePicture,
  updateProfile,
  changePassword,
  getSchool,
  updateSchool,
} from '@/lib/api/services/settingsService';
import { toPublicAssetUrl } from '@/lib/utils/urlUtils';

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

export default function SchoolSettingsPage() {
  const TAB_ITEMS = [
    { key: 'profile', label: 'Profile' },
    { key: 'security', label: 'Security' },
    { key: 'school', label: 'School' },
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

  // School state
  const [schoolLoading, setSchoolLoading] = useState(false);
  const [schoolError, setSchoolError] = useState('');
  const [school, setSchool] = useState(null);
  const [schoolForm, setSchoolForm] = useState({ name: '', location: '', address: '', contact_person: '', contact_email: '', contact_phone: '' });
  const [schoolOriginal, setSchoolOriginal] = useState(schoolForm);
  const [schoolSaving, setSchoolSaving] = useState(false);
  const schoolDirty = useUnsaved(schoolOriginal, schoolForm);

  // Init: load profile, then school
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
          const schoolId = res.data?.school?.id;
          if (schoolId) {
            setSchoolLoading(true); setSchoolError('');
            getSchool(schoolId)
              .then((r) => {
                if (r.success) {
                  const s = r.data;
                  setSchool(s);
                  const sf = {
                    name: s.name || '',
                    location: s.location || '',
                    address: s.address || '',
                    contact_person: s.contact_person || '',
                    contact_email: s.contact_email || '',
                    contact_phone: s.contact_phone || '',
                  };
                  setSchoolForm(sf);
                  setSchoolOriginal(sf);
                } else {
                  setSchoolError(r.error || 'Failed to load school');
                }
              })
              .finally(() => setSchoolLoading(false));
          }
        } else {
          setProfileError(res.error || 'Failed to load profile');
        }
      })
      .finally(() => mounted && setProfileLoading(false));
    return () => { mounted = false; };
  }, []);

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

  // School handlers
  function validateSchool(d) {
    const e = {};
    if (!d.name || d.name.trim().length < 3 || d.name.trim().length > 255) e.name = 'School name must be 3-255 characters';
    if (!d.location || d.location.trim().length < 2 || d.location.trim().length > 100) e.location = 'Location must be 2-100 characters';
    if (!d.contact_person || d.contact_person.trim().length < 3 || d.contact_person.trim().length > 100) e.contact_person = 'Contact person must be 3-100 characters';
    if (!d.contact_email || !/^\S+@\S+\.\S+$/.test(d.contact_email)) e.contact_email = 'Invalid email format';
    if (!d.contact_phone || !/^\+?[0-9]{10,15}$/.test(d.contact_phone)) e.contact_phone = 'Invalid phone format';
    return e;
  }
  async function saveSchool() {
    const errs = validateSchool(schoolForm);
    if (Object.keys(errs).length) { setSchoolError(Object.values(errs)[0]); return; }
    setSchoolSaving(true); setSchoolError('');
    const res = await updateSchool(school?.id, schoolForm);
    setSchoolSaving(false);
    if (!res.success) { setSchoolError(res.error || 'Failed to update school'); return; }
    setSchoolOriginal(schoolForm);
  }
  function cancelSchool() {
    if (schoolDirty) {
      const ok = window.confirm('Discard unsaved changes?');
      if (!ok) return;
    }
    setSchoolForm(schoolOriginal);
    setSchoolError('');
  }

  const profileDirty = useUnsaved(originalForm, form) || !!profilePicture;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">School Settings</h1>
        <p className="text-gray-600">Manage your profile, security, and school information</p>
      </div>

      <Tabs active={activeTab} onChange={setActiveTab} items={TAB_ITEMS} />

      {activeTab === 'profile' && (
        <div className="rounded-lg border bg-white p-4 space-y-4">
          <h2 className="text-lg font-semibold">Profile Settings</h2>
          {profileLoading ? (
            <p className="text-sm text-gray-600">Loading profile...</p>
          ) : profileError ? (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{profileError}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-[112px] h-[112px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {previewUrl ? (
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
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+919876543210" aria-label="Phone" />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Role</label>
                  <div className="flex items-center gap-2">
                    <Input value={form.role} readOnly className="bg-gray-100" aria-label="Role" />
                    <Badge>{String(form.role || '').replace('_', ' ')}</Badge>
                  </div>
                </div>

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

      {activeTab === 'school' && (
        <div className="rounded-lg border bg-white p-4 space-y-4">
          <h2 className="text-lg font-semibold">School Settings</h2>
          {schoolLoading ? (
            <p className="text-sm text-gray-600">Loading school...</p>
          ) : schoolError ? (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{schoolError}</p>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-700">School Name *</label>
                <Input value={schoolForm.name} onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-700">Location *</label>
                <Input value={schoolForm.location} onChange={(e) => setSchoolForm({ ...schoolForm, location: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-700">Address</label>
                <textarea className="border rounded px-3 py-2 w-full" rows={3} value={schoolForm.address} onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-700">Contact Person *</label>
                  <Input value={schoolForm.contact_person} onChange={(e) => setSchoolForm({ ...schoolForm, contact_person: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Contact Email *</label>
                  <Input type="email" value={schoolForm.contact_email} onChange={(e) => setSchoolForm({ ...schoolForm, contact_email: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-gray-700">Contact Phone *</label>
                  <Input value={schoolForm.contact_phone} onChange={(e) => setSchoolForm({ ...schoolForm, contact_phone: e.target.value })} placeholder="+91XXXXXXXXXX" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={cancelSchool}>Cancel</Button>
                <Button variant="primary" onClick={saveSchool} disabled={!schoolDirty || schoolSaving}>{schoolSaving ? 'Saving...' : 'Save Changes'}</Button>
                {schoolDirty ? <span className="text-xs text-gray-600">Unsaved changes</span> : null}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
