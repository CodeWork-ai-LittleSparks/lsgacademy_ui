"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ValidationMessage from './ValidationMessage';
import FormSection from './FormSection';
import { createSchool, updateSchool } from '@/lib/api/services/schoolService';
import { School, User, Mail, Phone, MapPin, FileText, Shield, CheckCircle, XCircle, Save, X as XIcon } from 'lucide-react';

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPhone = (v) => /^\+91\d{10}$/.test(v);

export default function SchoolForm({ initialData = null, onSubmit, onCancel, isEditing = false, onDirtyChange }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', location: '', address: '', contact_person: '', contact_email: '', contact_phone: '',
    school_admin_name: '', school_admin_email: '', school_admin_phone: '',
  });
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        location: initialData.location || '',
        address: initialData.address || '',
        contact_person: initialData.contact_person || '',
        contact_email: initialData.contact_email || '',
        contact_phone: initialData.contact_phone || '',
        school_admin_name: initialData.school_admin?.full_name || '',
        school_admin_email: initialData.school_admin?.email || '',
        school_admin_phone: initialData.school_admin?.phone || '',
      });
      setIsActive(initialData.is_active ?? true);
    }
  }, [initialData]);

  useEffect(() => {
    if (!initialData) return onDirtyChange?.(Object.values(formData).some(Boolean));
    const base = {
      name: initialData.name || '',
      location: initialData.location || '',
      address: initialData.address || '',
      contact_person: initialData.contact_person || '',
      contact_email: initialData.contact_email || '',
      contact_phone: initialData.contact_phone || '',
    };
    const changed = [
      formData.name !== base.name,
      formData.location !== base.location,
      formData.address !== base.address,
      formData.contact_person !== base.contact_person,
      formData.contact_email !== base.contact_email,
      formData.contact_phone !== base.contact_phone,
      isEditing && (isActive !== (initialData.is_active ?? true)),
    ].some(Boolean);
    onDirtyChange?.(changed);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, isActive]);

  const validate = () => {
    const e = {};
    if (!formData.name || formData.name.length < 3) e.name = 'Name is required (min 3 chars)';
    if (!formData.location || formData.location.length < 2) e.location = 'Location is required';
    if (formData.address && formData.address.length < 10) e.address = 'Address must be at least 10 chars';
    if (!formData.contact_person || formData.contact_person.length < 3) e.contact_person = 'Contact person is required';
    if (!formData.contact_email || !isValidEmail(formData.contact_email)) e.contact_email = 'Valid email required';
    if (!formData.contact_phone || !isValidPhone(formData.contact_phone)) e.contact_phone = 'Phone must be +91XXXXXXXXXX';

    if (!isEditing) {
      if (!formData.school_admin_name || formData.school_admin_name.length < 3) e.school_admin_name = 'Admin name is required';
      if (!formData.school_admin_email || !isValidEmail(formData.school_admin_email)) e.school_admin_email = 'Valid admin email required';
      if (!formData.school_admin_phone || !isValidPhone(formData.school_admin_phone)) e.school_admin_phone = 'Admin phone must be +91XXXXXXXXXX';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isEditing && initialData?.id) {
        const payload = {
          name: formData.name,
          location: formData.location,
          address: formData.address,
          contact_person: formData.contact_person,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          is_active: isActive,
        };
        const res = await updateSchool(initialData.id, payload);
        if (res.success) {
          onSubmit?.(res.data);
          router.push(`/schools/${initialData.id}`);
          return;
        }
        setErrors({ form: res.error || 'Update failed' });
      } else {
        const createPayload = {
          name: formData.name,
          location: formData.location,
          address: formData.address,
          contact_person: formData.contact_person,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          school_admin: {
            full_name: formData.school_admin_name,
            email: formData.school_admin_email,
            phone: formData.school_admin_phone,
          },
        };
        const res = await createSchool(createPayload);
        if (res.success) {
          const newId = res.data?.school_id || res.data?.school?.id || res.data?.id;
          onSubmit?.(res.data);
          if (newId) {
            router.push(`/schools/${newId}`);
          }
          return;
        }
        setErrors({ form: res.error || 'Creation failed' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (name) => `w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 bg-white text-sm font-medium text-gray-900 placeholder:text-gray-400 transition-all duration-200 outline-none ${errors[name] ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200 hover:border-purple-300'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* School Information Section */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
          <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
            <School className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" strokeWidth={2.5} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            School Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Active Status Toggle - Only for Editing */}
          {isEditing && (
            <div className="md:col-span-2 p-4 rounded-xl bg-white border-2 border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-green-100' : 'bg-red-100'}`}>
                    {isActive ? (
                      <CheckCircle className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Active Status</div>
                    <div className="text-xs text-gray-600">Toggle to activate or deactivate the school</div>
                  </div>
                </div>
                <label className="inline-flex items-center cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={isActive} 
                    onChange={(e)=>setIsActive(e.target.checked)} 
                  />
                  <div className="relative w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-600 transition-all duration-300 shadow-inner">
                    <div className={`absolute top-0.5 left-0.5 bg-white rounded-full h-6 w-6 shadow-md transition-transform duration-300 ${isActive ? 'translate-x-7' : ''}`} />
                  </div>
                  <span className="ml-3 text-sm font-bold text-gray-700">{isActive ? 'Active' : 'Inactive'}</span>
                </label>
              </div>
            </div>
          )}

          {/* School Name */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              <School className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
              School Name *
            </label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e)=>setFormData({ ...formData, name: e.target.value })} 
              className={inputClass('name')}
              placeholder="Enter school name"
            />
            <ValidationMessage message={errors.name} />
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              <MapPin className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
              Location *
            </label>
            <input 
              type="text" 
              value={formData.location} 
              onChange={(e)=>setFormData({ ...formData, location: e.target.value })} 
              className={inputClass('location')}
              placeholder="Enter city or region"
            />
            <ValidationMessage message={errors.location} />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              <FileText className="w-4 h-4 text-green-600" strokeWidth={2.5} />
              Full Address
            </label>
            <textarea 
              value={formData.address} 
              onChange={(e)=>setFormData({ ...formData, address: e.target.value })} 
              className={inputClass('address')} 
              rows={3}
              placeholder="Enter complete address with street, city, state, and postal code"
            />
            <ValidationMessage message={errors.address} />
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
          <div className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-sm">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" strokeWidth={2.5} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Contact Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Contact Person */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              <User className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
              Contact Person *
            </label>
            <input 
              type="text" 
              value={formData.contact_person} 
              onChange={(e)=>setFormData({ ...formData, contact_person: e.target.value })} 
              className={inputClass('contact_person')}
              placeholder="Full name"
            />
            <ValidationMessage message={errors.contact_person} />
          </div>

          {/* Contact Email */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              <Mail className="w-4 h-4 text-green-600" strokeWidth={2.5} />
              Contact Email *
            </label>
            <input 
              type="email" 
              value={formData.contact_email} 
              onChange={(e)=>setFormData({ ...formData, contact_email: e.target.value })} 
              className={inputClass('contact_email')}
              placeholder="email@example.com"
            />
            <ValidationMessage message={errors.contact_email} />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              <Phone className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
              Contact Phone *
            </label>
            <input 
              type="tel" 
              value={formData.contact_phone} 
              onChange={(e)=>setFormData({ ...formData, contact_phone: e.target.value })} 
              className={inputClass('contact_phone')} 
              placeholder="+91XXXXXXXXXX" 
            />
            <ValidationMessage message={errors.contact_phone} />
          </div>
        </div>
      </div>

      {/* School Admin Account Section - Only for Creation */}
      {!isEditing && (
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 sm:p-6 shadow-md">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
            <div className="p-2.5 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl shadow-sm">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                School Admin Account
              </h3>
              <p className="text-xs text-gray-600 mt-1">This account will have administrative access to the school</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Admin Name */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                <User className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                Admin Name *
              </label>
              <input 
                type="text" 
                value={formData.school_admin_name} 
                onChange={(e)=>setFormData({ ...formData, school_admin_name: e.target.value })} 
                className={inputClass('school_admin_name')}
                placeholder="Full name"
              />
              <ValidationMessage message={errors.school_admin_name} />
            </div>

            {/* Admin Email */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                <Mail className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                Admin Email *
              </label>
              <input 
                type="email" 
                value={formData.school_admin_email} 
                onChange={(e)=>setFormData({ ...formData, school_admin_email: e.target.value })} 
                className={inputClass('school_admin_email')}
                placeholder="admin@example.com"
              />
              <ValidationMessage message={errors.school_admin_email} />
            </div>

            {/* Admin Phone */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                <Phone className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                Admin Phone *
              </label>
              <input 
                type="tel" 
                value={formData.school_admin_phone} 
                onChange={(e)=>setFormData({ ...formData, school_admin_phone: e.target.value })} 
                className={inputClass('school_admin_phone')} 
                placeholder="+91XXXXXXXXXX" 
              />
              <ValidationMessage message={errors.school_admin_phone} />
            </div>
          </div>
        </div>
      )}

      {/* Form Error Message */}
      {errors.form && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
          <div className="flex-shrink-0 p-1.5 bg-red-100 rounded-lg">
            <XCircle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">{errors.form}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
        <button 
          type="button" 
          onClick={onCancel} 
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200 hover:scale-105 shadow-sm"
        >
          <XIcon className="w-4 h-4" strokeWidth={2.5} />
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={submitting} 
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" strokeWidth={2.5} />
              <span>{isEditing ? 'Update School' : 'Create School'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
