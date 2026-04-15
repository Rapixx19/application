"use client";

import { useState, useEffect } from "react";

interface Folder {
  id: string;
  name: string;
}

interface ProjectFile {
  id: string;
  display_name: string;
  size_bytes: number;
  folder_id: string | null;
  is_default: boolean;
}

interface SendNdaModalProps {
  applicationId: string;
  applicantName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function fmtSize(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export function SendNdaModal({ applicationId, applicantName, isOpen, onClose, onSuccess }: SendNdaModalProps) {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen]);

  const fetchFiles = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/files");
    const data = await res.json();
    const allFiles = data.files || [];
    const allFolders = data.folders || [];
    setFiles(allFiles);
    setFolders(allFolders);
    // Pre-select default files
    const defaultIds = new Set<string>(
      allFiles.filter((f: ProjectFile) => f.is_default !== false).map((f: ProjectFile) => f.id)
    );
    setSelectedIds(defaultIds);
    setLoading(false);
  };

  const toggleFile = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleFolder = (folderId: string) => {
    const folderFiles = files.filter((f) => f.folder_id === folderId);
    const allSelected = folderFiles.every((f) => selectedIds.has(f.id));

    setSelectedIds((prev) => {
      const next = new Set(prev);
      folderFiles.forEach((f) => {
        if (allSelected) {
          next.delete(f.id);
        } else {
          next.add(f.id);
        }
      });
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(files.map((f) => f.id)));
  };

  const selectNone = () => {
    setSelectedIds(new Set());
  };

  const sendNda = async () => {
    setSending(true);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/send-nda`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_ids: Array.from(selectedIds) }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  const unfiledFiles = files.filter((f) => !f.folder_id);
  const filesByFolder = folders.map((folder) => ({
    folder,
    files: files.filter((f) => f.folder_id === folder.id),
  }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-primary">Send NDA to {applicantName}</h2>
          <p className="text-sm text-muted mt-1">
            Select which files will be released after NDA signing (10-minute delay)
          </p>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="text-center py-8 text-muted">Loading files...</div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-muted">No files uploaded yet.</div>
          ) : (
            <>
              <div className="flex gap-3 mb-4">
                <button onClick={selectAll} className="text-xs text-green hover:underline">
                  Select all
                </button>
                <button onClick={selectNone} className="text-xs text-muted hover:underline">
                  Select none
                </button>
              </div>

              <div className="space-y-4">
                {/* Folders */}
                {filesByFolder.map(({ folder, files: folderFiles }) => {
                  if (folderFiles.length === 0) return null;
                  const allSelected = folderFiles.every((f) => selectedIds.has(f.id));
                  const someSelected = folderFiles.some((f) => selectedIds.has(f.id));

                  return (
                    <div key={folder.id}>
                      <button
                        onClick={() => toggleFolder(folder.id)}
                        className="flex items-center gap-2 w-full text-left mb-2 group"
                      >
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center text-white text-xs transition-colors ${
                            allSelected
                              ? "bg-green border-green"
                              : someSelected
                              ? "bg-green/50 border-green"
                              : "border-border group-hover:border-muted"
                          }`}
                        >
                          {(allSelected || someSelected) && (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                          />
                        </svg>
                        <span className="font-medium text-sm text-primary">{folder.name}</span>
                        <span className="text-xs text-muted">({folderFiles.length})</span>
                      </button>
                      <div className="ml-6 space-y-1">
                        {folderFiles.map((file) => (
                          <FileRow
                            key={file.id}
                            file={file}
                            selected={selectedIds.has(file.id)}
                            onToggle={() => toggleFile(file.id)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Unfiled files */}
                {unfiledFiles.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="font-medium text-sm text-primary">Unfiled</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      {unfiledFiles.map((file) => (
                        <FileRow
                          key={file.id}
                          file={file}
                          selected={selectedIds.has(file.id)}
                          onToggle={() => toggleFile(file.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={sending}
            className="px-4 py-2 text-sm text-muted border border-border rounded-lg hover:border-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={sendNda}
            disabled={sending || selectedIds.size === 0}
            className="px-5 py-2 bg-green text-white text-sm font-medium rounded-lg hover:bg-[#24774f] disabled:opacity-40 transition-colors"
          >
            {sending ? "Sending..." : `Send NDA with ${selectedIds.size} file${selectedIds.size !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function FileRow({
  file,
  selected,
  onToggle,
}: {
  file: ProjectFile;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 w-full text-left py-1 px-2 rounded hover:bg-gray-50 transition-colors group"
    >
      <span
        className={`w-4 h-4 rounded border flex items-center justify-center text-white text-xs transition-colors ${
          selected ? "bg-green border-green" : "border-border group-hover:border-muted"
        }`}
      >
        {selected && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className="text-sm text-primary flex-1 truncate">{file.display_name}</span>
      <span className="text-xs text-muted">{fmtSize(file.size_bytes)}</span>
    </button>
  );
}
