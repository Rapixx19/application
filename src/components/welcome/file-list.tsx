"use client";

import { FileCard } from "./file-card";

interface FileItem {
  id: string;
  display_name: string;
  size_bytes: number;
  url: string;
}

export function FileList({
  files,
  applicationId,
}: {
  files: FileItem[];
  applicationId: string;
}) {
  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-muted text-sm">
        No files have been uploaded yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file, i) => (
        <FileCard
          key={file.id}
          name={file.display_name}
          size={file.size_bytes}
          url={file.url}
          applicationId={applicationId}
          fileId={file.id}
          index={i}
        />
      ))}
    </div>
  );
}
