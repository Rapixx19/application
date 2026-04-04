"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export function UploadZone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    await fetch("/api/admin/files", { method: "POST", body: form });
    setUploading(false);
    router.refresh();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-8 ${
        dragOver ? "border-green bg-green/5" : "border-border hover:border-muted"
      }`}
    >
      <input ref={inputRef} type="file" className="hidden" onChange={onChange} />
      {uploading ? (
        <p className="text-sm text-muted">Uploading...</p>
      ) : (
        <>
          <p className="text-sm font-medium text-primary">
            Drop a file here or click to upload
          </p>
          <p className="text-xs text-muted mt-1">PDF, DOCX, ZIP, PPTX &mdash; max 50MB</p>
        </>
      )}
    </div>
  );
}
