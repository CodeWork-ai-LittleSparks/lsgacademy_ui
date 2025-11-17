"use client";
import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useCreateAnnouncement } from "@/lib/hooks/useAnnouncements";
import messageService from "@/lib/api/messageService";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useAuth } from "@/lib/auth/authContext";
import { Megaphone, Send, Search, UserPlus, UserMinus, FileText, AlertCircle, Calendar, Flag, Users } from "lucide-react";

export default function CreateAnnouncementPage() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("normal");
  const [recipientType, setRecipientType] = useState("all");
  const [recipientSearch, setRecipientSearch] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [selected, setSelected] = useState([]);
  const [expiresAt, setExpiresAt] = useState("");
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const createMutation = useCreateAnnouncement();
  const { user, isSuperAdmin, isSchoolAdmin } = useAuth();

  const debouncedRecipientSearch = useDebounce(recipientSearch, 300);
  useEffect(() => {
    let active = true;
    const run = async () => {
      if (recipientType !== "specific") return;
      const res = await messageService.getRecipients(debouncedRecipientSearch || undefined);
      let list = res?.results || res || [];
      if (isSchoolAdmin && isSchoolAdmin()) list = list.filter((r) => r.role === "teacher");
      if (isSuperAdmin && isSuperAdmin()) list = list.filter((r) => r.role === "school_admin");
      if (user?.id) list = list.filter((r) => r.id !== user.id);
      if (active) setRecipients(list);
    };
    run();
    return () => { active = false; };
  }, [debouncedRecipientSearch, recipientType]);

  const validateField = (name, value) => {
    switch (name) {
      case 'subject':
        if (!value || value.trim().length < 3) return 'Subject must be at least 3 characters';
        if (value.trim().length > 200) return 'Subject must be less than 200 characters';
        return '';
      case 'content':
        if (!value || value.trim().length < 10) return 'Content must be at least 10 characters';
        if (value.trim().length > 2000) return 'Content must be less than 2000 characters';
        return '';
      case 'recipientType':
        if (value === 'specific' && selected.length === 0) return 'Please select at least one recipient';
        return '';
      default:
        return '';
    }
  };

  const validate = () => {
    const e = {};
    e.subject = validateField('subject', subject);
    e.content = validateField('content', content);
    e.recipientType = validateField('recipientType', recipientType);
    
    // Remove empty errors
    Object.keys(e).forEach(key => !e[key] && delete e[key]);
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBlur = (name) => {
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, name === 'subject' ? subject : name === 'content' ? content : recipientType);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubjectChange = (value) => {
    setSubject(value);
    if (touched.subject) {
      const error = validateField('subject', value);
      setErrors({ ...errors, subject: error });
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
    if (touched.content) {
      const error = validateField('content', value);
      setErrors({ ...errors, content: error });
    }
  };

  const toggleRecipient = (r) => {
    const exists = selected.some((x) => x.id === r.id);
    const newSelected = exists ? selected.filter((x) => x.id !== r.id) : [...selected, r];
    setSelected(newSelected);
    
    // Validate recipient selection if recipient type is specific
    if (recipientType === 'specific' && touched.recipientType) {
      const error = validateField('recipientType', recipientType);
      setErrors({ ...errors, recipientType: error });
    }
  };

  const submit = async () => {
    // Mark all fields as touched
    const allTouched = { subject: true, content: true, recipientType: true };
    setTouched(allTouched);
    
    if (!validate()) {
      // Show toast for validation errors
      const errorMessages = Object.values(errors).filter(Boolean);
      if (errorMessages.length > 0) {
        // You could show the first error or all errors
        console.error('Validation errors:', errorMessages);
      }
      return;
    }
    
    await createMutation.mutateAsync({ 
      subject, 
      content, 
      priority, 
      recipient_type: recipientType, 
      recipient_ids: selected.map((r) => r.id), 
      expires_at: expiresAt || undefined 
    });
    
    // Reset form and validation state
    setSubject(""); 
    setContent(""); 
    setRecipientType("all"); 
    setSelected([]); 
    setExpiresAt("");
    setTouched({});
    setErrors({});
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
    <div className="min-h-full bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/20">
      <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-lg">
              <Megaphone className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Create Announcement
              </h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">
                Send important updates to your recipients
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 space-y-8">
          {/* Basic Info Section */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b-2 border-gray-100">
              <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                  Announcement Details
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">Subject and content for your announcement</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Subject */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Subject
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-purple-100 rounded-lg pointer-events-none">
                    <Megaphone className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter announcement subject..." 
                    value={subject} 
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    onBlur={() => handleBlur('subject')}
                    className={inputClass('subject')}
                    maxLength={200}
                  />
                </div>
                {touched.subject && errors.subject && (
                  <p className="text-sm text-red-600 mt-1.5 ml-0.5">{errors.subject}</p>
                )}
                <p className="text-xs text-gray-500 mt-1.5 ml-0.5">{subject.length}/200 characters</p>
              </div>

              {/* Content */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Content
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 p-1.5 bg-blue-100 rounded-lg pointer-events-none">
                    <FileText className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                  </div>
                  <textarea 
                    rows={8} 
                    placeholder="Write your announcement content..." 
                    value={content} 
                    onChange={(e) => handleContentChange(e.target.value)}
                    onBlur={() => handleBlur('content')}
                    className={`${inputClass('content')} pt-3 resize-none`}
                    maxLength={2000}
                  />
                </div>
                {touched.content && errors.content && (
                  <p className="text-sm text-red-600 mt-1.5 ml-0.5">{errors.content}</p>
                )}
                <p className="text-xs text-gray-500 mt-1.5 ml-0.5">{content.length}/2000 characters</p>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-md">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b-2 border-gray-100">
              <div className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-sm">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                  Settings & Recipients
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">Configure priority, recipients, and expiration</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Priority */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  <Flag className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
                  Priority
                </label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)} 
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-medium hover:border-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Recipients */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  <Users className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                  Recipients
                </label>
                <select 
                  value={recipientType} 
                  onChange={(e) => {
                    setRecipientType(e.target.value);
                    if (touched.recipientType) {
                      const error = validateField('recipientType', e.target.value);
                      setErrors({ ...errors, recipientType: error });
                    }
                  }}
                  onBlur={() => handleBlur('recipientType')}
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-medium hover:border-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Users</option>
                  <option value="specific">Specific Recipients</option>
                </select>
                {touched.recipientType && errors.recipientType && (
                  <p className="text-sm text-red-600 mt-1.5">{errors.recipientType}</p>
                )}
              </div>

              {/* Expires At */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  <Calendar className="w-4 h-4 text-green-600" strokeWidth={2.5} />
                  Expires At
                </label>
                <input 
                  type="date" 
                  value={expiresAt} 
                  onChange={(e) => setExpiresAt(e.target.value)} 
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-medium hover:border-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Recipient Selection */}
          {recipientType === "specific" && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-md">
              <div className="flex items-center gap-3 mb-6 pb-5 border-b-2 border-gray-100">
                <div className="p-2.5 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl shadow-sm">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                    Select Recipients
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">Choose specific users to receive this announcement</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Search Recipients
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-blue-100 rounded-lg pointer-events-none">
                      <Search className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
                    </div>
                    <input 
                      placeholder="Search recipients by name..." 
                      value={recipientSearch} 
                      onChange={(e) => setRecipientSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-medium hover:border-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Available Recipients */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Available Recipients
                    </h3>
                    <div className="border-2 border-gray-200 rounded-xl p-4 max-h-80 overflow-y-auto bg-gray-50">
                      {recipients.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <Search className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">No recipients found</p>
                          <p className="text-xs text-gray-400">Try searching for a name</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {recipients.map((r) => (
                            <div key={r.id} className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-purple-300 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-purple-600">
                                    {r.full_name?.charAt(0)?.toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{r.full_name}</div>
                                  <div className="text-xs text-gray-500 capitalize">{r.role?.replace("_", " ")}</div>
                                </div>
                              </div>
                              <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={selected.some((x) => x.id === r.id)} 
                                  onChange={() => toggleRecipient(r)}
                                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-xs font-medium">Select</span>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Recipients */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <UserMinus className="h-4 w-4" />
                      Selected Recipients ({selected.length})
                    </h3>
                    <div className="border-2 border-purple-200 rounded-xl p-4 max-h-80 overflow-y-auto bg-gradient-to-br from-purple-50 to-blue-50">
                      {selected.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <UserMinus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">No recipients selected</p>
                          <p className="text-xs text-gray-400">Select recipients from the left</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selected.map((r) => (
                            <div key={r.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-purple-600">
                                    {r.full_name?.charAt(0)?.toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{r.full_name}</div>
                                  <div className="text-xs text-gray-500 capitalize">{r.role?.replace("_", " ")}</div>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setSelected(selected.filter((x) => x.id !== r.id))}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Info Note */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex-shrink-0 p-1.5 bg-blue-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 leading-relaxed">
                Announcements will be sent immediately to selected recipients. Urgent announcements will be highlighted in their dashboard.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button 
              onClick={submit} 
              disabled={createMutation.isPending || !subject.trim() || !content.trim()}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold hover:scale-105"
            >
              <Send className="h-5 w-5" strokeWidth={2.5} />
              <span>{createMutation.isPending ? "Sending..." : "Send Announcement"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}