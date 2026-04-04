"use client";

const EXT_COLORS: Record<string, string> = {
  pdf: "bg-red-600",
  docx: "bg-blue-600",
  doc: "bg-blue-600",
  zip: "bg-violet-600",
  pptx: "bg-orange-600",
  ppt: "bg-orange-600",
  xlsx: "bg-emerald-600",
  xls: "bg-emerald-600",
};

function getExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() || "file";
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileCardProps {
  name: string;
  size: number;
  url: string;
  applicationId: string;
  fileId: string;
  index: number;
}

export function FileCard({ name, size, url, applicationId, fileId, index }: FileCardProps) {
  const ext = getExt(name);
  const color = EXT_COLORS[ext] || "bg-gray-500";

  const handleDownload = () => {
    // Track file open
    fetch("/api/track/open", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ application_id: applicationId, file_id: fileId, file_name: name }),
    }).catch(() => {});

    window.open(url, "_blank");
  };

  return (
    <div
      className="flex items-center gap-4 p-5 bg-card border border-border rounded-xl opacity-0 animate-[revealCard_0.5s_ease_forwards]"
      style={{ animationDelay: `${0.2 + index * 0.2}s` }}
    >
      {/* File type icon */}
      <div className={`w-11 h-11 rounded-[10px] ${color} flex items-center justify-center text-white text-[0.7rem] font-semibold uppercase shrink-0`}>
        {ext}
      </div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-primary truncate">{name}</div>
        <div className="text-xs text-muted mt-0.5">{formatSize(size)}</div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-xs text-muted hover:border-muted transition-colors shrink-0"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download
      </button>
    </div>
  );
}
