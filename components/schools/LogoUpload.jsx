"use client";
import { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Check, AlertCircle, X } from 'lucide-react';

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];

export default function LogoUpload({ value, onChange }) {
  const [preview, setPreview] = useState(value || '/favicon.ico');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPreview(typeof value === 'string' && value ? value : '/favicon.ico');
  }, [value]);

  const handleFile = (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Logo must be JPEG or PNG');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Logo must be less than 2MB');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    onChange?.(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`group relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? 'border-purple-500 bg-purple-50 scale-105'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-purple-400 hover:bg-purple-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-5 sm:p-6">
          {/* Preview Image */}
          <div className="relative flex-shrink-0 group/preview">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white border-4 border-white shadow-lg group-hover/preview:shadow-xl transition-all duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={preview} 
                alt="Logo preview" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Success Badge */}
            {preview && preview !== '/favicon.ico' && !error && (
              <div className="absolute -bottom-2 -right-2 p-1.5 bg-green-500 rounded-full shadow-md">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            )}
          </div>

          {/* Upload Instructions */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <ImageIcon className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                </div>
                <h4 className="text-base font-bold text-gray-900">
                  School Logo
                </h4>
              </div>
              
              <p className="text-sm text-gray-600 font-medium">
                {isDragging ? (
                  <span className="text-purple-600 font-semibold">Drop your logo here</span>
                ) : (
                  <>
                    Drag & drop or{' '}
                    <label className="text-purple-600 hover:text-purple-700 font-semibold cursor-pointer hover:underline">
                      browse
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFile(e.target.files?.[0])} 
                      />
                    </label>
                  </>
                )}
              </p>
            </div>

            {/* File Requirements */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                <ImageIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                JPEG/PNG
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                <Upload className="w-3.5 h-3.5" strokeWidth={2.5} />
                Max 2MB
              </span>
            </div>

            {/* Upload Button */}
            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105">
              <Upload className="w-4 h-4" strokeWidth={2.5} />
              Upload Logo
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handleFile(e.target.files?.[0])} 
              />
            </label>
          </div>
        </div>

        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-100/80 backdrop-blur-sm rounded-2xl pointer-events-none">
            <div className="flex flex-col items-center gap-2">
              <div className="p-4 bg-white rounded-2xl shadow-lg">
                <Upload className="w-8 h-8 text-purple-600 animate-bounce" strokeWidth={2.5} />
              </div>
              <p className="text-base font-bold text-purple-700">
                Drop to upload
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-in slide-in-from-top duration-200">
          <div className="flex-shrink-0 p-1.5 bg-red-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <p className="text-xs text-red-600 mt-1">Please choose a valid image file</p>
          </div>
          <button 
            onClick={() => setError('')}
            className="flex-shrink-0 p-1 hover:bg-red-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-red-600" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Success Message */}
      {preview && preview !== '/favicon.ico' && !error && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
          <div className="flex-shrink-0 p-1.5 bg-green-100 rounded-lg">
            <Check className="w-5 h-5 text-green-600" strokeWidth={2.5} />
          </div>
          <p className="text-sm font-semibold text-green-700">
            Logo uploaded successfully!
          </p>
        </div>
      )}
    </div>
  );
}
