"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import Modal from "@/components/ui/Modal";
import PhotoUpload from "@/components/students/PhotoUpload";
import { getStudentById, updateStudent } from "@/lib/api/services/studentService";

const gradeOptions = [...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))];

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getStudentById(id);
      if (!cancelled) {
        if (res?.success) {
          const s = res.data;
          setOriginal(s);
          setForm({
            full_name: s.full_name || '',
            roll_number: s.roll_number || '',
            grade: String(s.grade ?? ''),
            gender: s.gender || '',
            date_of_birth: s.date_of_birth || '',
            parent_name: s.parent_name || '',
            parent_phone: s.parent_phone || '',
            parent_email: s.parent_email || '',
            address: s.address || '',
            is_active: !!s.is_active,
          });
        } else {
          setErrors({ form: res?.error || 'Failed to load student' });
        }
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const validate = (values) => {
    const e = {};
    if (!values.full_name || values.full_name.trim().length < 3) e.full_name = "Full name is required (min 3 chars)";
    if (!values.roll_number || values.roll_number.trim().length < 3) e.roll_number = "Roll number is required (min 3 chars)";
    if (!values.grade) e.grade = "Grade is required";
    if (!values.gender) e.gender = "Gender is required";
    if (!values.date_of_birth) e.date_of_birth = "Date of birth is required";
    if (!values.parent_name || values.parent_name.trim().length < 3) e.parent_name = "Parent name is required";
    if (!values.parent_phone || !/^\+\d{10,15}$/.test(values.parent_phone)) e.parent_phone = "Valid phone required";
    if (values.parent_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.parent_email)) e.parent_email = "Invalid email";
    return e;
  };

  const changes = useMemo(() => {
    if (!original) return {};
    const diff = {};
    const mapParent = (vals) => ({ parent_name: vals.parent_name, parent_phone: vals.parent_phone, parent_email: vals.parent_email, address: vals.address });
    const fields = ['full_name','roll_number','grade','gender','date_of_birth'];
    for (const k of fields) { if (String(form[k] ?? '') !== String(original[k] ?? '')) diff[k] = form[k]; }
    const parentOrig = mapParent({
      parent_name: original.parent_name || '',
      parent_phone: original.parent_phone || '',
      parent_email: original.parent_email || '',
      address: original.address || '',
    });
    const parentCurr = mapParent(form);
    for (const k of Object.keys(parentCurr)) { if (String(parentCurr[k] ?? '') !== String(parentOrig[k] ?? '')) diff[k] = parentCurr[k]; }
    if (Boolean(form.is_active) !== Boolean(original.is_active)) diff.is_active = !!form.is_active;
    return diff;
  }, [form, original]);

  const hasChanges = useMemo(() => Object.keys(changes).length > 0 || !!photoFile, [changes, photoFile]);

  const submit = async () => {
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitting(true);
    const res = await updateStudent(id, changes, photoFile);
    setSubmitting(false);
    if (res?.success) {
      router.push(`/students/${id}`);
    } else {
      setErrors((prev) => ({ ...prev, form: res?.error || 'Failed to update student' }));
    }
  };

  const ageText = useMemo(() => {
    if (!form.date_of_birth) return "";
    const dob = new Date(form.date_of_birth);
    if (Number.isNaN(dob.getTime())) return "";
    const diff = Date.now() - dob.getTime();
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    return years >= 0 ? `${years} years` : "";
  }, [form.date_of_birth]);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/students/${id}`)}>{`< Back`}</Button>
          <h1 className="text-xl font-semibold">Edit Student</h1>
        </div>
        <div className="text-sm text-gray-700">{hasChanges ? 'Unsaved changes' : ''}</div>
      </div>

      {/* Photo Upload */}
      <div className="mb-4">
        <div className="font-medium mb-2">Student Photo</div>
        <PhotoUpload value={photoFile} onChange={setPhotoFile} onError={setPhotoError} existingUrl={original?.photo_url} />
        {photoError && <div className="text-red-600 text-sm mt-1">{photoError}</div>}
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border rounded p-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <Input value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
          {errors.full_name && <div className="text-red-600 text-sm mt-1">{errors.full_name}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Roll Number *</label>
          <Input value={form.roll_number} onChange={(e) => setForm((f) => ({ ...f, roll_number: e.target.value }))} />
          {errors.roll_number && <div className="text-red-600 text-sm mt-1">{errors.roll_number}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Grade *</label>
          <Dropdown value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))} options={[{ value: '', label: 'Select Grade' }, ...gradeOptions]} />
          {errors.grade && <div className="text-red-600 text-sm mt-1">{errors.grade}</div>}
        </div>
        <div>
          <span className="block text-sm font-medium mb-1">Gender *</span>
          <div className="flex items-center gap-4">
            {['male','female','other'].map((g) => (
              <label key={g} className="flex items-center gap-2 text-sm">
                <input type="radio" name="gender" checked={form.gender === g} onChange={() => setForm((f) => ({ ...f, gender: g }))} />
                <span className="capitalize">{g}</span>
              </label>
            ))}
          </div>
          {errors.gender && <div className="text-red-600 text-sm mt-1">{errors.gender}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth *</label>
          <Input type="date" value={form.date_of_birth} onChange={(e) => setForm((f) => ({ ...f, date_of_birth: e.target.value }))} />
          <div className="text-xs text-gray-600 mt-1">{ageText ? `Age: ${ageText}` : ''}</div>
          {errors.date_of_birth && <div className="text-red-600 text-sm mt-1">{errors.date_of_birth}</div>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Active</label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
            <span>{form.is_active ? 'Active' : 'Inactive'}</span>
          </label>
        </div>
      </div>

      {/* Parent Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border rounded p-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Parent Name *</label>
          <Input value={form.parent_name} onChange={(e) => setForm((f) => ({ ...f, parent_name: e.target.value }))} />
          {errors.parent_name && <div className="text-red-600 text-sm mt-1">{errors.parent_name}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Parent Phone *</label>
          <Input placeholder="+91xxxxxxxxxx" value={form.parent_phone} onChange={(e) => setForm((f) => ({ ...f, parent_phone: e.target.value }))} />
          {errors.parent_phone && <div className="text-red-600 text-sm mt-1">{errors.parent_phone}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Parent Email</label>
          <Input value={form.parent_email} onChange={(e) => setForm((f) => ({ ...f, parent_email: e.target.value }))} />
          {errors.parent_email && <div className="text-red-600 text-sm mt-1">{errors.parent_email}</div>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea className="border rounded px-3 py-2 w-full min-h-[60px]" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
        </div>
      </div>

      {errors.form && <div className="mt-3 p-3 bg-red-50 text-red-700 rounded">{errors.form}</div>}

      <div className="flex items-center justify-end gap-2 mt-4">
        <Button variant="outline" disabled={submitting} onClick={() => setShowCancelConfirm(true)}>Cancel</Button>
        <Button variant="primary" disabled={submitting || !hasChanges} onClick={submit}>{submitting ? 'Updating...' : 'Update Student'}</Button>
      </div>

      {showCancelConfirm && (
        <Modal>
          <div className="bg-white rounded-lg p-5 w-[315px]">
            <h3 className="text-lg font-semibold mb-2">Discard changes?</h3>
            <p className="text-sm text-gray-700 mb-4">You have unsaved changes.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>Stay</Button>
              <Button variant="danger" onClick={() => router.push(`/students/${id}`)}>Discard</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
