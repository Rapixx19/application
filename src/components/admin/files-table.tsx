"use client";

import { useState } from "react";

interface Folder {
  id: string;
  name: string;
}

interface ProjectFile {
  id: string;
  display_name: string;
  size_bytes: number;
  created_at: string;
  folder_id?: string | null;
  is_default?: boolean;
}

interface FilesTableProps {
  files: ProjectFile[];
  folders?: Folder[];
  onMoveToFolder?: (fileId: string, folderId: string | null) => void;
  onToggleDefault?: (fileId: string, isDefault: boolean) => void;
  onRefresh?: () => void;
}

function fmtSize(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export function FilesTable({ files, folders = [], onMoveToFolder, onToggleDefault, onRefresh }: FilesTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [movingId, setMovingId] = useState<string | null>(null);

  const rename = async (id: string) => {
    if (!newName.trim()) return;
    await fetch(`/api/admin/files/${id}/rename`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: newName.trim() }),
    });
    setEditingId(null);
    onRefresh?.();
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this file?")) return;
    await fetch(`/api/admin/files/${id}`, { method: "DELETE" });
    onRefresh?.();
  };

  if (files.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center text-muted text-sm">
        No files in this folder.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-background text-[0.75rem] uppercase text-muted font-semibold tracking-wide border-b border-border">
            <th className="text-left px-4 py-3 w-8">
              <span className="sr-only">Default</span>
            </th>
            <th className="text-left px-4 py-3">File</th>
            <th className="text-left px-4 py-3 hidden sm:table-cell">Size</th>
            <th className="text-left px-4 py-3 hidden sm:table-cell">Uploaded</th>
            <th className="text-right px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((f) => (
            <tr key={f.id} className="border-b border-border/50">
              <td className="px-4 py-3">
                <button
                  onClick={() => onToggleDefault?.(f.id, !f.is_default)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    f.is_default !== false
                      ? "border-green bg-green text-white"
                      : "border-border hover:border-muted"
                  }`}
                  title={f.is_default !== false ? "Default (pre-selected for NDA)" : "Not default"}
                >
                  {f.is_default !== false && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </td>
              <td className="px-4 py-3">
                {editingId === f.id ? (
                  <div className="flex gap-2">
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && rename(f.id)}
                      className="flex-1 px-2 py-1 border border-border rounded text-sm focus:border-primary outline-none"
                      autoFocus
                    />
                    <button onClick={() => rename(f.id)} className="text-xs text-green font-medium">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-xs text-muted">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span className="font-medium text-primary">{f.display_name}</span>
                )}
              </td>
              <td className="px-4 py-3 text-muted hidden sm:table-cell">{fmtSize(f.size_bytes)}</td>
              <td className="px-4 py-3 text-muted hidden sm:table-cell">
                {new Date(f.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex gap-2 justify-end items-center">
                  {folders.length > 0 && (
                    <div className="relative">
                      {movingId === f.id ? (
                        <select
                          autoFocus
                          className="text-xs px-2 py-1 border border-border rounded bg-white"
                          onChange={(e) => {
                            const val = e.target.value;
                            onMoveToFolder?.(f.id, val === "" ? null : val);
                            setMovingId(null);
                          }}
                          onBlur={() => setMovingId(null)}
                          defaultValue={f.folder_id || ""}
                        >
                          <option value="">Unfiled</option>
                          {folders.map((folder) => (
                            <option key={folder.id} value={folder.id}>
                              {folder.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => setMovingId(f.id)}
                          className="text-xs px-2.5 py-1 border border-border rounded hover:border-muted transition-colors"
                        >
                          Move
                        </button>
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setEditingId(f.id);
                      setNewName(f.display_name);
                    }}
                    className="text-xs px-2.5 py-1 border border-border rounded hover:border-muted transition-colors"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => remove(f.id)}
                    className="text-xs px-2.5 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
