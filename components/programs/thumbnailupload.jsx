"use client";
import { useEffect, useRef, useState } from 'react';
import { toPublicAssetUrl } from '@/lib/utils/urlUtils';
import Button from '@/components/ui/Button';
import { Upload, Image as ImageIcon, X, Check, RefreshCw } from 'lucide-react';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];

export default function ThumbnailUpload({ value, onChange, onError, existingUrl }) {
  const [preview, setPreview] = useState(existingUrl ? toPublicAssetUrl(existingUrl) : null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (!value) {
      setPreview(existingUrl ? toPublicAssetUrl(existingUrl) : null);
    }
  }, [value, existingUrl]);

  const validateFile = (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      onError?.('Please upload JPG or PNG image');
      return false;
    }
    if (file.size > MAX_SIZE_BYTES) {
      onError?.('Image must be under 5MB');
      return false;
    }
    return true;
  };

  const handleFiles = (files) => {
    const file = files?.[0];
    if (validateFile(file)) {
      onError?.(null);
      onChange?.(file);
    }
  };

  return (
    <div>
      {!preview ? (
        <div
          className={`group relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
            dragOver
              ? 'border-purple-500 bg-purple-50 scale-105'
              : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-purple-400 hover:bg-purple-50'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          role="button"
          aria-label="Upload thumbnail"
        >
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
          
          <div className="relative z-10 p-8 sm:p-12 text-center space-y-4">
            {/* Upload Icon */}
            <div className="flex justify-center">
              <div className={`p-4 sm:p-5 rounded-2xl shadow-lg transition-all duration-300 ${
                dragOver 
                  ? 'bg-gradient-to-br from-purple-500 to-blue-500 scale-110' 
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-purple-100 group-hover:to-blue-100'
              }`}>
                {dragOver ? (
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-bounce" strokeWidth={2.5} />
                ) : (
                  <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 group-hover:text-purple-600 transition-colors" strokeWidth={2} />
                )}
              </div>
            </div>

            {/* Upload Text */}
            <div className="space-y-2">
              <div className="text-base sm:text-lg font-bold text-gray-900">
                {dragOver ? (
                  <span className="text-purple-700">Drop your image here</span>
                ) : (
                  <>
                    <span className="text-purple-600 hover:text-purple-700 cursor-pointer">Click to upload</span>
                    {' '}or drag and drop
                  </>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-gray-600 font-medium">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg font-bold">
                  <ImageIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                  JPG, PNG
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg font-bold">
                  <Upload className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Max 5MB
                </span>
              </div>
            </div>
          </div>

          {/* Drag Overlay */}
          {dragOver && (
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

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      ) : (
        <div className="relative space-y-4">
          {/* Preview Container */}
          <div className="group/preview relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={preview} 
              alt="Thumbnail preview" 
              className="w-full aspect-video object-cover group-hover/preview:scale-105 transition-transform duration-500" 
            />
            
            {/* Success Badge Overlay */}
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-xl shadow-lg backdrop-blur-sm">
                <Check className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-xs font-bold">Uploaded</span>
              </div>
            </div>

            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-white">
                  <ImageIcon className="w-5 h-5" strokeWidth={2.5} />
                  <span className="text-sm font-semibold">Program Thumbnail</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => inputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-purple-600 hover:text-purple-700 font-semibold transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
              Change Image
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => { onChange?.(null); setPreview(null); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 font-semibold transition-all duration-200 hover:scale-105"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
              Remove Image
            </Button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}
    </div>
  );
}
