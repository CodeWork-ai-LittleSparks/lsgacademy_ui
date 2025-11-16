"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ValidationMessage from '../common/ValidationMessage';
import { createSchool, updateSchool } from '@/lib/api/services/schoolService';
import { School, User, Mail, Phone, MapPin, FileText, Shield, CheckCircle, XCircle, Save, X as XIcon, AlertCircle } from 'lucide-react';

// Enhanced validation functions
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPhone = (v) => /^[6-9]\d{9}$/.test(v); // Indian phone without +91
const formatPhoneInput = (v) => v.replace(/\D/g, '').slice(0, 10); // Only digits, max 10
const isValidName = (v) => /^[a-zA-Z\s.'-]{3,}$/.test(v); // Letters, spaces, and common name chars

export default function SchoolForm({ initialData = null, onSubmit, onCancel, isEditing = false, onDirtyChange }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', location: '', address: '', contact_person: '', contact_email: '', contact_phone: '',
    school_admin_name: '', school_admin_email: '', school_admin_phone: '',
  });
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        location: initialData.location || '',
        address: initialData.address || '',
        contact_person: initialData.contact_person || '',
        contact_email: initialData.contact_email || '',
        contact_phone: initialData.contact_phone?.replace('+91', '') || '',
        school_admin_name: initialData.school_admin?.full_name || '',
        school_admin_email: initialData.school_admin?.email || '',
        school_admin_phone: initialData.school_admin?.phone?.replace('+91', '') || '',
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
      contact_phone: initialData.contact_phone?.replace('+91', '') || '',
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

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value || value.length < 3) return 'School name must be at least 3 characters';
        if (value.length > 100) return 'School name must be less than 100 characters';
        return '';
      
      case 'location':
        if (!value || value.length < 2) return 'Location is required';
        if (value.length > 50) return 'Location must be less than 50 characters';
        return '';
      
      case 'address':
        if (value && value.length < 10) return 'Address must be at least 10 characters';
        if (value && value.length > 200) return 'Address must be less than 200 characters';
        return '';
      
      case 'contact_person':
      case 'school_admin_name':
        if (!value || value.length < 3) return 'Name must be at least 3 characters';
        if (!isValidName(value)) return 'Name can only contain letters, spaces, and common punctuation';
        if (value.length > 50) return 'Name must be less than 50 characters';
        return '';
      
      case 'contact_email':
      case 'school_admin_email':
        if (!value) return 'Email is required';
        if (!isValidEmail(value)) return 'Please enter a valid email address';
        if (value.length > 100) return 'Email must be less than 100 characters';
        return '';
      
      case 'contact_phone':
      case 'school_admin_phone':
        if (!value) return 'Phone number is required';
        if (!isValidPhone(value)) return 'Please enter a valid 10-digit Indian phone number';
        return '';
      
      default:
        return '';
    }
  };

  const validate = () => {
    const e = {};
    
    // Validate all required fields
    e.name = validateField('name', formData.name);
    e.location = validateField('location', formData.location);
    e.address = validateField('address', formData.address);
    e.contact_person = validateField('contact_person', formData.contact_person);
    e.contact_email = validateField('contact_email', formData.contact_email);
    e.contact_phone = validateField('contact_phone', formData.contact_phone);

    if (!isEditing) {
      e.school_admin_name = validateField('school_admin_name', formData.school_admin_name);
      e.school_admin_email = validateField('school_admin_email', formData.school_admin_email);
      e.school_admin_phone = validateField('school_admin_phone', formData.school_admin_phone);
    }

    // Remove empty errors
    Object.keys(e).forEach(key => !e[key] && delete e[key]);
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBlur = (name) => {
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, formData[name]);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handlePhoneChange = (name, value) => {
    const formatted = formatPhoneInput(value);
    setFormData({ ...formData, [name]: formatted });
    if (touched[name]) {
      const error = validateField(name, formatted);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => allTouched[key] = true);
    setTouched(allTouched);
    
    if (!validate()) return;
    
    setSubmitting(true);
    try {
      if (isEditing && initialData?.id) {
        const payload = {
          name: formData.name.trim(),
          location: formData.location.trim(),
          address: formData.address.trim(),
          contact_person: formData.contact_person.trim(),
          contact_email: formData.contact_email.trim().toLowerCase(),
          contact_phone: `+91${formData.contact_phone}`,
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
          name: formData.name.trim(),
          location: formData.location.trim(),
          address: formData.address.trim(),
          contact_person: formData.contact_person.trim(),
          contact_email: formData.contact_email.trim().toLowerCase(),
          contact_phone: `+91${formData.contact_phone}`,
          school_admin: {
            full_name: formData.school_admin_name.trim(),
            email: formData.school_admin_email.trim().toLowerCase(),
            phone: `+91${formData.school_admin_phone}`,
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

  const inputClass = (name) => {
    const hasError = touched[name] && errors[name];
    return `w-full pl-11 pr-4 py-2.5 border-2 rounded-xl focus:ring-4 bg-white text-sm font-medium text-gray-900 placeholder:text-gray-400 transition-all duration-200 outline-none ${
      hasError 
        ? 'border-red-300 focus:ring-red-100 focus:border-red-500' 
        : 'border-gray-200 hover:border-purple-300 focus:ring-purple-100 focus:border-purple-500'
    }`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* School Information Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b-2 border-gray-100">
          <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
            <School className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              School Information
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">Basic details about the school</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Active Status Toggle - Only for Editing */}
          {isEditing && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 shadow-sm">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* School Name */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                School Name
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-purple-100 rounded-lg pointer-events-none">
                  <School className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                </div>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  className={inputClass('name')}
                  placeholder="Enter the School Name"
                  maxLength={100}
                />
              </div>
              {touched.name && errors.name && <ValidationMessage message={errors.name} />}
              <p className="text-xs text-gray-500 mt-1.5 ml-0.5">{formData.name.length}/100 characters</p>
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Location
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-blue-100 rounded-lg pointer-events-none">
                  <MapPin className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                </div>
                <input 
                  type="text" 
                  value={formData.location} 
                  onChange={(e) => handleChange('location', e.target.value)}
                  onBlur={() => handleBlur('location')}
                  className={inputClass('location')}
                  placeholder="Enter the Location"
                  maxLength={50}
                />
              </div>
              {touched.location && errors.location && <ValidationMessage message={errors.location} />}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Full Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 p-1.5 bg-green-100 rounded-lg pointer-events-none">
                <FileText className="w-4 h-4 text-green-600" strokeWidth={2.5} />
              </div>
              <textarea 
                value={formData.address} 
                onChange={(e) => handleChange('address', e.target.value)}
                onBlur={() => handleBlur('address')}
                className={`${inputClass('address')} pt-2.5`}
                rows={3}
                placeholder="Enter the Full Address"
                maxLength={200}
              />
            </div>
            {touched.address && errors.address && <ValidationMessage message={errors.address} />}
            <p className="text-xs text-gray-500 mt-1.5 ml-0.5">{formData.address.length}/200 characters</p>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b-2 border-gray-100">
          <div className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-sm">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              Contact Information
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">Primary contact details for the school</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Contact Person */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Contact Person
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-blue-100 rounded-lg pointer-events-none">
                <User className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
              </div>
              <input 
                type="text" 
                value={formData.contact_person} 
                onChange={(e) => handleChange('contact_person', e.target.value)}
                onBlur={() => handleBlur('contact_person')}
                className={inputClass('contact_person')}
                placeholder="Enter the Contact Person"
                maxLength={50}
              />
            </div>
            {touched.contact_person && errors.contact_person && <ValidationMessage message={errors.contact_person} />}
          </div>

          {/* Contact Email */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Contact Email
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-green-100 rounded-lg pointer-events-none">
                <Mail className="w-4 h-4 text-green-600" strokeWidth={2.5} />
              </div>
              <input 
                type="email" 
                value={formData.contact_email} 
                onChange={(e) => handleChange('contact_email', e.target.value)}
                onBlur={() => handleBlur('contact_email')}
                className={inputClass('contact_email')}
                placeholder="Enter the Contact Email"
                maxLength={100}
              />
            </div>
            {touched.contact_email && errors.contact_email && <ValidationMessage message={errors.contact_email} />}
          </div>

          {/* Contact Phone */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Contact Phone
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-orange-100 rounded-lg pointer-events-none">
                <Phone className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
              </div>
              <input 
                type="tel" 
                value={formData.contact_phone} 
                onChange={(e) => handlePhoneChange('contact_phone', e.target.value)}
                onBlur={() => handleBlur('contact_phone')}
                className={inputClass('contact_phone')} 
                placeholder="Enter the Contact Phone"
                maxLength={10}
              />
            </div>
            {touched.contact_phone && errors.contact_phone && <ValidationMessage message={errors.contact_phone} />}
            <p className="text-xs text-gray-500 mt-1.5 ml-0.5">10-digit Indian mobile number</p>
          </div>
        </div>
      </div>

      {/* School Admin Account Section - Only for Creation */}
      {!isEditing && (
        <div className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 p-5 sm:p-6 shadow-md">
          <div className="flex items-start gap-3 mb-6 pb-5 border-b-2 border-orange-100">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                School Admin Account
              </h3>
              <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                This account will have administrative access to manage the school. Login credentials will be sent via email.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Admin Name */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Admin Name
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-purple-100 rounded-lg pointer-events-none">
                  <User className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                </div>
                <input 
                  type="text" 
                  value={formData.school_admin_name} 
                  onChange={(e) => handleChange('school_admin_name', e.target.value)}
                  onBlur={() => handleBlur('school_admin_name')}
                  className={inputClass('school_admin_name')}
                  placeholder="Enter the Admin Name"
                  maxLength={50}
                />
              </div>
              {touched.school_admin_name && errors.school_admin_name && <ValidationMessage message={errors.school_admin_name} />}
            </div>

            {/* Admin Email */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Admin Email
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-blue-100 rounded-lg pointer-events-none">
                  <Mail className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                </div>
                <input 
                  type="email" 
                  value={formData.school_admin_email} 
                  onChange={(e) => handleChange('school_admin_email', e.target.value)}
                  onBlur={() => handleBlur('school_admin_email')}
                  className={inputClass('school_admin_email')}
                  placeholder="Enter the Admin Email"
                  maxLength={100}
                />
              </div>
              {touched.school_admin_email && errors.school_admin_email && <ValidationMessage message={errors.school_admin_email} />}
            </div>

            {/* Admin Phone */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                Admin Phone
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-green-100 rounded-lg pointer-events-none">
                  <Phone className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                </div>
                <input 
                  type="tel" 
                  value={formData.school_admin_phone} 
                  onChange={(e) => handlePhoneChange('school_admin_phone', e.target.value)}
                  onBlur={() => handleBlur('school_admin_phone')}
                  className={inputClass('school_admin_phone')} 
                  placeholder="Enter the Admin Phone"
                  maxLength={10}
                />
              </div>
              {touched.school_admin_phone && errors.school_admin_phone && <ValidationMessage message={errors.school_admin_phone} />}
              <p className="text-xs text-gray-500 mt-1.5 ml-0.5">10-digit Indian mobile number</p>
            </div>
          </div>

          {/* Info Note */}
          <div className="flex items-start gap-3 p-4 mt-5 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex-shrink-0 p-1.5 bg-blue-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 leading-relaxed">
                The admin will receive an email with login credentials and instructions to access the school dashboard.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Error Message */}
      {errors.form && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl shadow-sm">
          <div className="flex-shrink-0 p-1.5 bg-red-100 rounded-lg">
            <XCircle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">{errors.form}</p>
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
          <XIcon className="w-4 h-4" strokeWidth={2.5} />
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
              <span>{isEditing ? 'Update School' : 'Create School'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
