"use client";

import { FileCard } from "./file-card";

interface FileItem {
  id: string;
  display_name: string;
  size_bytes: number;
  url: string;
  folder_name?: string | null;
  folder_id?: string | null;
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

  // Group files by folder
  const folders = new Map<string | null, { name: string | null; files: FileItem[] }>();

  files.forEach((file) => {
    const folderId = file.folder_id || null;
    if (!folders.has(folderId)) {
      folders.set(folderId, { name: file.folder_name || null, files: [] });
    }
    folders.get(folderId)!.files.push(file);
  });

  // Convert to array, with unfiled at the end
  const folderGroups = Array.from(folders.entries()).sort(([aId], [bId]) => {
    if (aId === null) return 1;
    if (bId === null) return -1;
    return 0;
  });

  // If only one group and it's unfiled, don't show folder headers
  const showFolderHeaders = folderGroups.length > 1 || folderGroups[0]?.[0] !== null;

  let fileIndex = 0;

  return (
    <div className="space-y-6">
      {folderGroups.map(([folderId, group]) => (
        <div key={folderId || "unfiled"}>
          {showFolderHeaders && (
            <div className="flex items-center gap-2 mb-3">
              {group.name ? (
                <>
                  <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <span className="text-sm font-medium text-primary">{group.name}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-medium text-muted">Other files</span>
                </>
              )}
            </div>
          )}
          <div className="space-y-3">
            {group.files.map((file) => {
              const idx = fileIndex++;
              return (
                <FileCard
                  key={file.id}
                  name={file.display_name}
                  size={file.size_bytes}
                  url={file.url}
                  applicationId={applicationId}
                  fileId={file.id}
                  index={idx}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
