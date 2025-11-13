"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import Modal from "@/components/ui/Modal";
import PhotoUpload from "@/components/students/PhotoUpload";
import { createStudent, checkRollNumberUnique } from "@/lib/api/services/studentService";

const gradeOptions = [{ value: "", label: "Select Grade" }, ...Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))];

export default function NewStudentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    roll_number: "",
    grade: "",
    gender: "",
    date_of_birth: "",
    parent_name: "",
    parent_phone: "",
    parent_email: "",
    address: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoError, setPhotoError] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [rollCheck, setRollCheck] = useState({ checking: false, isUnique: true, lastValue: "" });
  const rollCheckTimer = useRef(null);

  const hasChanges = useMemo(() => {
    return Object.values(form).some((v) => String(v || "").length > 0) || !!photoFile;
  }, [form, photoFile]);

  const ageText = useMemo(() => {
    if (!form.date_of_birth) return "";
    const dob = new Date(form.date_of_birth);
    if (Number.isNaN(dob.getTime())) return "";
    const diff = Date.now() - dob.getTime();
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    return years >= 0 ? `${years} years` : "";
  }, [form.date_of_birth]);

  const validate = (values) => {
    const e = {};
    if (!values.full_name || values.full_name.trim().length < 3) e.full_name = "Full name is required (min 3 chars)";
    if (!values.roll_number || values.roll_number.trim().length < 3) e.roll_number = "Roll number is required (min 3 chars)";
    else if (!/^[a-zA-Z0-9-]+$/.test(values.roll_number)) e.roll_number = "Alphanumeric only";
    if (!values.grade) e.grade = "Grade is required";
    if (!values.gender) e.gender = "Gender is required";
    if (!values.date_of_birth) e.date_of_birth = "Date of birth is required";
    else {
      const dob = new Date(values.date_of_birth);
      if (Number.isNaN(dob.getTime())) e.date_of_birth = "Invalid date";
      else {
        const diff = Date.now() - dob.getTime();
        const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
        if (years < 3 || years > 18) e.date_of_birth = "Age must be 3–18 years";
      }
    }
    if (!values.parent_name || values.parent_name.trim().length < 3) e.parent_name = "Parent name is required";
    if (!values.parent_phone || !/^\+\d{10,15}$/.test(values.parent_phone)) e.parent_phone = "Valid phone required (e.g., +919876543210)";
    if (values.parent_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.parent_email)) e.parent_email = "Invalid email";
    return e;
  };

  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(form));
    if (field === 'roll_number' && form.roll_number && form.roll_number !== rollCheck.lastValue) {
      if (rollCheckTimer.current) clearTimeout(rollCheckTimer.current);
      setRollCheck((r) => ({ ...r, checking: true }));
      rollCheckTimer.current = setTimeout(async () => {
        const res = await checkRollNumberUnique(form.roll_number);
        setRollCheck({ checking: false, isUnique: !!res?.data?.isUnique, lastValue: form.roll_number });
        if (!res?.data?.isUnique) setErrors((e) => ({ ...e, roll_number: 'Roll number already exists' }));
      }, 500);
    }
  };

  const submit = async () => {
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const first = Object.keys(e)[0];
      document.getElementById(`field-${first}`)?.focus();
      return;
    }
    setSubmitting(true);
    const res = await createStudent(form, photoFile);
    setSubmitting(false);
    if (res?.success) {
      const created = res.data?.student ?? res.data;
      router.push(`/students/${created?.id}`);
    } else {
      setErrors((prev) => ({ ...prev, form: res?.error || 'Failed to create student' }));
    }
  };

  const handleCancel = () => {
    if (!hasChanges) { router.back(); return; }
    setShowCancelConfirm(true);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>{`< Back`}</Button>
          <h1 className="text-xl font-semibold">Add New Student</h1>
        </div>
      </div>

      {/* Photo Upload */}
      <div className="mb-4">
        <div className="font-medium mb-2">Student Photo</div>
        <PhotoUpload value={photoFile} onChange={setPhotoFile} onError={setPhotoError} />
        {photoError && <div className="text-red-600 text-sm mt-1">{photoError}</div>}
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border rounded p-4">
        <div>
          <label htmlFor="field-full_name" className="block text-sm font-medium mb-1">Full Name *</label>
          <Input id="field-full_name" value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} onBlur={() => handleBlur('full_name')} />
          {touched.full_name && errors.full_name && <div className="text-red-600 text-sm mt-1">{errors.full_name}</div>}
        </div>
        <div>
          <label htmlFor="field-roll_number" className="block text-sm font-medium mb-1">Roll Number *</label>
          <Input id="field-roll_number" value={form.roll_number} onChange={(e) => setForm((f) => ({ ...f, roll_number: e.target.value }))} onBlur={() => handleBlur('roll_number')} />
          {rollCheck.checking && <div className="text-gray-600 text-xs mt-1">Checking uniqueness...</div>}
          {touched.roll_number && errors.roll_number && <div className="text-red-600 text-sm mt-1">{errors.roll_number}</div>}
        </div>
        <div>
          <label htmlFor="field-grade" className="block text-sm font-medium mb-1">Grade *</label>
          <Dropdown id="field-grade" value={form.grade} onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))} onBlur={() => handleBlur('grade')} options={gradeOptions} />
          {touched.grade && errors.grade && <div className="text-red-600 text-sm mt-1">{errors.grade}</div>}
        </div>
        <div>
          <span className="block text-sm font-medium mb-1">Gender *</span>
          <div className="flex items-center gap-4">
            {['male','female','other'].map((g) => (
              <label key={g} className="flex items-center gap-2 text-sm">
                <input type="radio" name="gender" checked={form.gender === g} onChange={() => setForm((f) => ({ ...f, gender: g }))} onBlur={() => handleBlur('gender')} />
                <span className="capitalize">{g}</span>
              </label>
            ))}
          </div>
          {touched.gender && errors.gender && <div className="text-red-600 text-sm mt-1">{errors.gender}</div>}
        </div>
        <div>
          <label htmlFor="field-dob" className="block text-sm font-medium mb-1">Date of Birth *</label>
          <Input id="field-dob" type="date" value={form.date_of_birth} onChange={(e) => setForm((f) => ({ ...f, date_of_birth: e.target.value }))} onBlur={() => handleBlur('date_of_birth')} />
          <div className="text-xs text-gray-600 mt-1">{ageText ? `Age: ${ageText}` : ''}</div>
          {touched.date_of_birth && errors.date_of_birth && <div className="text-red-600 text-sm mt-1">{errors.date_of_birth}</div>}
        </div>
      </div>

      {/* Parent Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border rounded p-4 mt-4">
        <div>
          <label htmlFor="field-parent_name" className="block text-sm font-medium mb-1">Parent Name *</label>
          <Input id="field-parent_name" value={form.parent_name} onChange={(e) => setForm((f) => ({ ...f, parent_name: e.target.value }))} onBlur={() => handleBlur('parent_name')} />
          {touched.parent_name && errors.parent_name && <div className="text-red-600 text-sm mt-1">{errors.parent_name}</div>}
        </div>
        <div>
          <label htmlFor="field-parent_phone" className="block text-sm font-medium mb-1">Parent Phone *</label>
          <Input id="field-parent_phone" placeholder="+91xxxxxxxxxx" value={form.parent_phone} onChange={(e) => setForm((f) => ({ ...f, parent_phone: e.target.value }))} onBlur={() => handleBlur('parent_phone')} />
          {touched.parent_phone && errors.parent_phone && <div className="text-red-600 text-sm mt-1">{errors.parent_phone}</div>}
        </div>
        <div>
          <label htmlFor="field-parent_email" className="block text-sm font-medium mb-1">Parent Email</label>
          <Input id="field-parent_email" value={form.parent_email} onChange={(e) => setForm((f) => ({ ...f, parent_email: e.target.value }))} onBlur={() => handleBlur('parent_email')} />
          {touched.parent_email && errors.parent_email && <div className="text-red-600 text-sm mt-1">{errors.parent_email}</div>}
        </div>
        <div className="md:col-span-2">
          <label htmlFor="field-address" className="block text-sm font-medium mb-1">Address</label>
          <textarea id="field-address" className="border rounded px-3 py-2 w-full min-h-[60px]" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
        </div>
      </div>

      {errors.form && <div className="mt-3 p-3 bg-red-50 text-red-700 rounded">{errors.form}</div>}

      <div className="flex items-center justify-end gap-2 mt-4">
        <Button variant="outline" disabled={submitting} onClick={handleCancel}>Cancel</Button>
        <Button variant="primary" disabled={submitting} onClick={submit}>{submitting ? 'Creating...' : 'Create Student'}</Button>
      </div>

      {showCancelConfirm && (
        <Modal>
          <div className="bg-white rounded-lg p-5 w-[315px]">
            <h3 className="text-lg font-semibold mb-2">Discard changes?</h3>
            <p className="text-sm text-gray-700 mb-4">You have unsaved changes.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>Stay</Button>
              <Button variant="danger" onClick={() => router.back()}>Discard</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

