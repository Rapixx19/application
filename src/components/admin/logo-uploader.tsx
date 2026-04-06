"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface LogoUploaderProps {
  currentLogo: string;
  onLogoChange: (newPath: string) => void;
}

export function LogoUploader({ currentLogo, onLogoChange }: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/branding/logo", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onLogoChange(data.logo_path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = async () => {
    if (!confirm("Remove the current logo?")) return;

    setUploading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/branding/logo", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      onLogoChange("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setUploading(false);
    }
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
    <div className="space-y-4">
      <label className="block text-xs font-medium text-muted">Logo</label>

      {currentLogo ? (
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-border">
            <Image
              src={currentLogo}
              alt="Current logo"
              fill
              className="object-contain p-2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-1.5 text-xs border border-border rounded-md hover:border-muted transition-colors disabled:opacity-40"
            >
              {uploading ? "Uploading..." : "Replace"}
            </button>
            <button
              onClick={removeLogo}
              disabled={uploading}
              className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-md hover:border-red-400 transition-colors disabled:opacity-40"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragOver ? "border-green bg-green/5" : "border-border hover:border-muted"
          }`}
        >
          {uploading ? (
            <p className="text-sm text-muted">Uploading...</p>
          ) : (
            <>
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-primary">
                Drop logo here or click to upload
              </p>
              <p className="text-xs text-muted mt-1">PNG, JPG, SVG, or WebP — max 2MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden"
        onChange={onChange}
      />

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
