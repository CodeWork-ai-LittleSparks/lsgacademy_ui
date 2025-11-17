"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import messageService from "@/lib/api/messageService";
import { toast } from "sonner";

const MAX_FILES = 5;
const MAX_SIZE_MB = 10;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "application/zip",
];

export default function AttachmentUpload({ attachments = [], onAttachmentsChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files) => {
    const list = Array.from(files);
    if (attachments.length + list.length > MAX_FILES) {
      toast.error(`Max ${MAX_FILES} files`);
      return;
    }
    setUploading(true);
    try {
      for (const file of list) {
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          toast.error(`${file.name} exceeds ${MAX_SIZE_MB}MB`);
          continue;
        }
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`${file.name} type not allowed`);
          continue;
        }
        const uploaded = await messageService.uploadAttachment(file);
        const idOrUrl = uploaded?.id || uploaded?.url;
        if (idOrUrl) onAttachmentsChange([...attachments, idOrUrl]);
      }
    } catch (e) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (value) => {
    onAttachmentsChange(attachments.filter((a) => a !== value));
  };

  return (
    <div className="border rounded p-3">
      <div className="flex items-center gap-2">
        <input
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
        <Button disabled={uploading} onClick={() => toast.info("Select files to upload")}>Upload</Button>
      </div>
      {!!attachments.length && (
        <div className="mt-2 space-y-2">
          {attachments.map((a) => (
            <div key={a} className="flex items-center justify-between text-sm">
              <span className="truncate max-w-[70%]">{a}</span>
              <Button variant="outline" size="sm" onClick={() => removeAttachment(a)}>Remove</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}