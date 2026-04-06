"use client";

import { useState, useRef } from "react";

interface MediaUploaderProps {
  type: "video" | "music";
  currentUrl: string;
  onUrlChange: (newUrl: string) => void;
}

export function MediaUploader({ type, currentUrl, onUrlChange }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const isVideo = type === "video";
  const accept = isVideo
    ? "video/mp4,video/webm,video/quicktime"
    : "audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/aac";
  const maxSize = isVideo ? "100MB" : "20MB";
  const formats = isVideo ? "MP4, WebM, or MOV" : "MP3, WAV, OGG, or AAC";

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);

    const form = new FormData();
    form.append("file", file);
    form.append("type", type);

    try {
      const res = await fetch("/api/admin/splash/media", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onUrlChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeMedia = async () => {
    if (!confirm(`Remove the current ${type}?`)) return;

    setUploading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/splash/media?type=${type}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      onUrlChange("");
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
      <label className="block text-xs font-medium text-muted capitalize">
        {type === "video" ? "Background Video" : "Background Music"}
      </label>

      {currentUrl ? (
        <div className="space-y-3">
          {isVideo ? (
            <video
              src={currentUrl}
              className="w-full max-h-48 rounded-lg border border-border object-cover"
              controls
              muted
            />
          ) : (
            <audio src={currentUrl} className="w-full" controls />
          )}
          <div className="flex gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-1.5 text-xs border border-border rounded-md hover:border-muted transition-colors disabled:opacity-40"
            >
              {uploading ? "Uploading..." : "Replace"}
            </button>
            <button
              onClick={removeMedia}
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
                {isVideo ? (
                  <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                )}
              </div>
              <p className="text-sm font-medium text-primary">
                Drop {type} here or click to upload
              </p>
              <p className="text-xs text-muted mt-1">{formats} — max {maxSize}</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onChange}
      />

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
