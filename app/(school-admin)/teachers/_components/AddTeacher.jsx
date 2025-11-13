"use client";
import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createTeacher, updateTeacher, checkEmailUnique } from "@/lib/api/services/teacherService";

export default function AddTeacher({ teacher = null, isEditing = false, onCancel, onSaved }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    qualifications: "",
    experience_years: "",
    bio: "",
    is_active: true,
  });
  const [original, setOriginal] = useState(form);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailCheck, setEmailCheck] = useState({ checked: false, isUnique: true, loading: false });

  useEffect(() => {
    if (teacher) {
      const init = {
        full_name: teacher?.user?.full_name || "",
        email: teacher?.user?.email || "",
        phone: teacher?.user?.phone || "",
        qualifications: teacher.qualifications || "",
        experience_years: teacher.experience_years ?? "",
        bio: teacher.bio || "",
        is_active: !!(teacher?.user?.is_active ?? teacher?.is_active),
      };
      setForm(init); setOriginal(init);
    }
  }, [teacher]);

  const hasChanges = useMemo(() => JSON.stringify(form) !== JSON.stringify(original), [form, original]);

  const handleChange = (field) => (e) => {
    const value = field === 'is_active' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    if (field === 'email') setEmailCheck({ checked: false, isUnique: true, loading: false });
  };

  const validateEmail = async () => {
    if (!form.email) return;
    setEmailCheck((s) => ({ ...s, loading: true }));
    try {
      const res = await checkEmailUnique(form.email);
      setEmailCheck({ checked: true, isUnique: !!res?.data?.isUnique, loading: false });
    } catch {
      setEmailCheck({ checked: true, isUnique: true, loading: false });
    }
  };

  const submit = async () => {
    setSaving(true); setMessage(""); setError("");
    try {
      const action = isEditing ? updateTeacher : createTeacher;
      const res = isEditing ? await action(teacher.id, form) : await action(form);
      if (res.success) {
        setMessage(isEditing ? "Teacher updated" : "Teacher created");
        onSaved?.(res?.data?.id ?? teacher?.id);
      } else {
        setError(res.error || "Operation failed");
      }
    } catch (err) {
      setError(err?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{isEditing ? "Edit Teacher" : "Add Teacher"}</h2>
          {onCancel ? (<Button variant="outline" onClick={onCancel}>Cancel</Button>) : null}
        </div>

        {error ? (<div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{error}</div>) : null}
        {message ? (<div className="rounded border border-green-200 bg-green-50 p-2 text-sm text-green-700">{message}</div>) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-700">Full Name</label>
            <Input value={form.full_name} onChange={handleChange('full_name')} placeholder="Full name" />
          </div>
        <div>
          <label className="text-sm text-gray-700">Email</label>
          <div className="flex gap-2">
            <Input value={form.email} onChange={handleChange('email')} placeholder="teacher@example.com" className="flex-1" disabled={isEditing} />
            {!isEditing && (
              <Button size="sm" variant="outline" disabled={!form.email || emailCheck.loading} onClick={validateEmail}>{emailCheck.loading ? "Checking..." : "Check"}</Button>
            )}
          </div>
          {emailCheck.checked && (
            <div className={`text-xs mt-1 ${emailCheck.isUnique ? "text-green-700" : "text-red-700"}`}>
              {emailCheck.isUnique ? "Email is available" : "Email already in use"}
            </div>
          )}
        </div>
          <div>
            <label className="text-sm text-gray-700">Phone</label>
            <Input value={form.phone} onChange={handleChange('phone')} placeholder="+919876543210" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Qualifications</label>
            <Input value={form.qualifications} onChange={handleChange('qualifications')} placeholder="B.Ed, M.Sc ..." />
          </div>
        <div>
          <label className="text-sm text-gray-700">Experience (years)</label>
          <Input type="number" value={form.experience_years} onChange={handleChange('experience_years')} placeholder="0" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-700">Bio</label>
          <textarea value={form.bio} onChange={handleChange('bio')} placeholder="Short bio" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} />
        </div>
        <div className="flex items-center gap-2">
          <input id="is_active" type="checkbox" checked={!!form.is_active} onChange={handleChange('is_active')} />
          <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
        </div>
      </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" disabled={saving || (isEditing && !hasChanges)} onClick={submit}>{isEditing ? (saving ? "Saving..." : "Save Changes") : (saving ? "Creating..." : "Create Teacher")}</Button>
        </div>
      </div>
    </Card>
  );
}