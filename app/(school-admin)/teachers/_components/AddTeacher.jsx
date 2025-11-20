"use client";
import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createTeacher, updateTeacher, checkEmailUnique } from "@/lib/api/services/teacherService";
import { 
  User, 
  Mail, 
  Phone, 
  Award, 
  TrendingUp, 
  FileText, 
  Check, 
  X, 
  AlertCircle, 
  Loader2,
  UserPlus,
  Save
} from "lucide-react";

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
        setMessage(isEditing ? "Teacher updated successfully!" : "Teacher created successfully!");
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
    <Card className="bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-[#E9B3FB] to-[#6F00FF]/30 rounded-xl shadow-sm">
              {isEditing ? (
                <User className="w-5 h-5 text-[#3B0270]" strokeWidth={2.5} />
              ) : (
                <UserPlus className="w-5 h-5 text-[#3B0270]" strokeWidth={2.5} />
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              {isEditing ? "Edit Teacher" : "Add New Teacher"}
            </h2>
          </div>
          {onCancel && (
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-300 hover:bg-[#FFF1F1] text-gray-900 font-semibold transition-all"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
              Cancel
            </Button>
          )}
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-red-200 bg-red-50 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}
        {message && (
          <div className="flex items-start gap-3 p-4 rounded-xl border-2 border-green-200 bg-green-50 animate-in fade-in">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
            <p className="text-sm font-semibold text-green-700">{message}</p>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
              <User className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              Full Name *
            </label>
            <Input 
              value={form.full_name} 
              onChange={handleChange('full_name')} 
              placeholder="Enter full name"
              className="w-full px-4 py-3 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium placeholder:text-gray-500 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
              <Mail className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              Email *
            </label>
            <div className="flex gap-2">
              <Input 
                value={form.email} 
                onChange={handleChange('email')} 
                placeholder="teacher@example.com" 
                className={`flex-1 px-4 py-3 rounded-xl focus:ring-4 text-gray-900 font-medium placeholder:text-gray-500 transition-all ${
                  isEditing 
                    ? 'bg-gray-100 cursor-not-allowed' 
                    : 'focus:border-[#6F00FF] focus:ring-[#6F00FF]/20'
                }`}
                disabled={isEditing} 
              />
              {!isEditing && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  disabled={!form.email || emailCheck.loading} 
                  onClick={validateEmail}
                  className="px-4 py-3 rounded-xl border-2 border-[#6F00FF] text-[#6F00FF] hover:bg-[#FFF1F1] font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {emailCheck.loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" strokeWidth={2.5} />
                      Checking...
                    </>
                  ) : (
                    "Check"
                  )}
                </Button>
              )}
            </div>
            {emailCheck.checked && (
              <div className={`flex items-center gap-2 mt-2 text-xs font-semibold ${emailCheck.isUnique ? "text-green-700" : "text-red-700"}`}>
                {emailCheck.isUnique ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                    Email is available
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" strokeWidth={2.5} />
                    Email already in use
                  </>
                )}
              </div>
            )}
          </div>

          {/* Phone and Qualifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                <Phone className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
                Phone
              </label>
              <Input 
                value={form.phone} 
                onChange={handleChange('phone')} 
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium placeholder:text-gray-500 transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                <Award className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
                Qualifications
              </label>
              <Input 
                value={form.qualifications} 
                onChange={handleChange('qualifications')} 
                placeholder="B.Ed, M.Sc, Ph.D"
                className="w-full px-4 py-3 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium placeholder:text-gray-500 transition-all"
              />
            </div>
          </div>

          {/* Experience Years */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
              <TrendingUp className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              Experience (years)
            </label>
            <Input 
              type="number" 
              value={form.experience_years} 
              onChange={handleChange('experience_years')} 
              placeholder="0"
              min="0"
              max="50"
              className="w-full px-4 py-3 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium placeholder:text-gray-500 transition-all"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
              <FileText className="w-4 h-4 text-[#6F00FF]" strokeWidth={2.5} />
              Bio
            </label>
            <textarea 
              value={form.bio} 
              onChange={handleChange('bio')} 
              placeholder="Write a short bio about the teacher..."
              className="w-full px-4 py-3 rounded-xl focus:border-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 text-gray-900 font-medium placeholder:text-gray-500 resize-none transition-all" 
              rows={4} 
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 p-4 bg-[#FFF1F1] rounded-xl">
            <input 
              id="is_active" 
              type="checkbox" 
              checked={!!form.is_active} 
              onChange={handleChange('is_active')}
              className="w-5 h-5 rounded border-2 border-[#6F00FF] text-[#6F00FF] focus:ring-4 focus:ring-[#6F00FF]/20 cursor-pointer"
            />
            <label htmlFor="is_active" className="text-sm font-bold text-gray-900 cursor-pointer flex-1">
              Active Status
            </label>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
              form.is_active 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}>
              {form.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 hover:bg-[#FFF1F1] text-gray-900 font-bold transition-all"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
            Cancel
          </Button>
          <Button 
            variant="primary" 
            disabled={saving || (isEditing && !hasChanges)} 
            onClick={submit}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#6F00FF] to-[#3B0270] hover:from-[#3B0270] hover:to-[#6F00FF] text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                <span>{isEditing ? "Saving..." : "Creating..."}</span>
              </>
            ) : (
              <>
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4" strokeWidth={2.5} />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" strokeWidth={2.5} />
                    <span>Create Teacher</span>
                  </>
                )}
              </>
            )}
          </Button>
        </div>

        {/* Change Indicator */}
        {isEditing && hasChanges && (
          <div className="flex items-center justify-center gap-2 text-sm text-orange-600 font-semibold">
            <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
            You have unsaved changes
          </div>
        )}
      </div>
    </Card>
  );
}
