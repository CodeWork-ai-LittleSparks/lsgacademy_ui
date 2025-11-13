"use client";
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import { toPublicAssetUrl } from '@/lib/utils/urlUtils';

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];

export default function PhotoUpload({ value, onChange, onError, existingUrl }) {
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
      onError?.('Image must be under 2MB');
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
          className={`border-2 border-dashed rounded-lg p-6 text-center text-gray-600 ${dragOver ? 'bg-gray-50' : 'bg-white'}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          role="button"
          aria-label="Upload photo"
        >
          <div className="mb-2 font-medium">Click to upload or drag and drop</div>
          <div className="text-sm">JPG, PNG (max 2MB)</div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      ) : (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Photo preview" className="w-48 h-48 object-cover rounded-full border" />
          <div className="flex gap-2 mt-2">
            <Button variant="outline" onClick={() => inputRef.current?.click()}>Change Photo</Button>
            <Button variant="ghost" onClick={() => { onChange?.(null); setPreview(null); }}>Remove Photo</Button>
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

