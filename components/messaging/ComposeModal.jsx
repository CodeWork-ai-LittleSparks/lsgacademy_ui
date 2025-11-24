"use client";
import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import AttachmentUpload from "./AttachmentUpload";
import messageService from "@/lib/api/messageService";
import { toast } from "sonner";
import { User, MessageSquare, Search, Send, X as XIcon, Paperclip } from "lucide-react";

export default function ComposeModal({ isOpen, onClose }) {
  const [search, setSearch] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    const run = async () => {
      try {
        const res = await messageService.getRecipients(search || undefined);
        if (active) setRecipients(res?.results || res || []);
      } catch {}
    };
    run();
    return () => {
      active = false;
    };
  }, [isOpen, search]);

  const validateField = (name, value) => {
    switch (name) {
      case 'recipient':
        return !selectedRecipient ? 'Please select a recipient' : '';
      case 'content':
        if (!value.trim() && attachments.length === 0) {
          return 'Please enter a message or attach a file';
        }
        if (value.trim().length > 1000) {
          return 'Message must be less than 1000 characters';
        }
        return '';
      default:
        return '';
    }
  };

  const validate = () => {
    const e = {};
    e.recipient = validateField('recipient', selectedRecipient);
    e.content = validateField('content', content);
    
    // Remove empty errors
    Object.keys(e).forEach(key => !e[key] && delete e[key]);
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBlur = (name) => {
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, name === 'recipient' ? selectedRecipient : content);
    setErrors({ ...errors, [name]: error });
  };

  const handleContentChange = (value) => {
    setContent(value);
    if (touched.content) {
      const error = validateField('content', value);
      setErrors({ ...errors, content: error });
    }
  };

  const handleSend = async () => {
    // Mark all fields as touched
    const allTouched = { recipient: true, content: true };
    setTouched(allTouched);
    
    if (!validate()) {
      toast.error("Please fix the errors before sending");
      return;
    }
    
    setLoading(true);
    try {
      await messageService.sendMessage({ recipient_id: selectedRecipient.id, content: content.trim(), attachments });
      toast.success("Message sent");
      setContent("");
      setAttachments([]);
      setSelectedRecipient(null);
      setTouched({});
      setErrors({});
      onClose?.();
    } catch (e) {
      toast.error("Failed to send");
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (name) => {
    const hasError = touched[name] && errors[name];
    const baseClasses = 'w-full pl-11 pr-4 py-2.5 border-2 rounded-xl focus:ring-4 bg-white text-sm font-medium text-gray-900 placeholder:text-gray-400 transition-all duration-200 outline-none';
    const errorClasses = 'border-red-300 focus:ring-red-100 focus:border-red-500';
    const normalClasses = 'border-gray-200 hover:border-purple-300 focus:ring-purple-100 focus:border-purple-500';
    return `${baseClasses} ${hasError ? errorClasses : normalClasses}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Message" size="md">
      <div className="space-y-6 px-2">
        {/* Form Section Header */}
        <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-100">
          <div className="p-2.5 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl shadow-sm">
            <MessageSquare className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">Compose Message</h3>
            <p className="text-xs text-gray-600 mt-0.5">Send a message to a recipient</p>
          </div>
        </div>

        {/* Recipient Selection */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Recipient
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 bg-purple-100 rounded-lg pointer-events-none">
              <User className="w-4 h-4 text-purple-600" strokeWidth={2.5} />
            </div>
            <input 
              type="text" 
              placeholder="Search recipient by name..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className={getInputClass('recipient')}
              onBlur={() => handleBlur('recipient')}
            />
          </div>
          {touched.recipient && errors.recipient && (
            <p className="text-sm text-red-600 mt-1.5 ml-0.5">{errors.recipient}</p>
          )}
          
          {recipients.length > 0 && (
            <div className="mt-3 border-2 border-gray-200 rounded-xl max-h-48 overflow-y-auto bg-white shadow-sm">
              {recipients.map((r) => (
                <div
                  key={r.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedRecipient?.id === r.id ? "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200" : ""
                  }`}
                  onClick={() => {
                    setSelectedRecipient(r);
                    setSearch(r.full_name);
                    setRecipients([]);
                    if (touched.recipient) {
                      setErrors({ ...errors, recipient: '' });
                    }
                  }}
                >
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
                </div>
              ))}
            </div>
          )}
          
          {selectedRecipient && !search && (
            <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-600">
                      {selectedRecipient.full_name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{selectedRecipient.full_name}</div>
                    <div className="text-xs text-gray-500 capitalize">{selectedRecipient.role?.replace("_", " ")}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRecipient(null);
                    setSearch("");
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <XIcon className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            Message
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-3 p-1.5 bg-blue-100 rounded-lg pointer-events-none">
              <MessageSquare className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
            </div>
            <textarea 
              value={content} 
              onChange={(e) => handleContentChange(e.target.value)}
              onBlur={() => handleBlur('content')}
              rows={5} 
              placeholder="Type your message here..." 
              className={`${getInputClass('content')} pt-3 resize-none`}
              maxLength={1000}
            />
          </div>
          {touched.content && errors.content && (
            <p className="text-sm text-red-600 mt-1.5 ml-0.5">{errors.content}</p>
          )}
          <p className="text-xs text-gray-500 mt-1.5 ml-0.5">{content.length}/1000 characters</p>
        </div>

        {/* Attachments */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
            <Paperclip className="w-4 h-4" strokeWidth={2.5} />
            Attachments (Optional)
          </label>
          <AttachmentUpload attachments={attachments} onAttachmentsChange={setAttachments} />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button 
            type="button" 
            onClick={onClose} 
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200 hover:scale-105 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <XIcon className="w-4 h-4" strokeWidth={2.5} />
            Cancel
          </button>
          <button 
            onClick={handleSend} 
            disabled={loading || !selectedRecipient}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" strokeWidth={2.5} />
                <span>Send Message</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}