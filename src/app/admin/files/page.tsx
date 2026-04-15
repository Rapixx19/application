"use client";

import { useState, useEffect } from "react";
import { StatsRow } from "@/components/admin/stats-row";
import { UploadZone } from "@/components/admin/upload-zone";
import { FilesTable } from "@/components/admin/files-table";

interface Folder {
  id: string;
  name: string;
  created_at: string;
}

interface ProjectFile {
  id: string;
  display_name: string;
  size_bytes: number;
  created_at: string;
  folder_id: string | null;
  is_default: boolean;
  folder?: { id: string; name: string } | null;
}

export default function FilesPage() {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const fetchData = async () => {
    const res = await fetch("/api/admin/files");
    const data = await res.json();
    setFiles(data.files || []);
    setFolders(data.folders || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    setCreatingFolder(true);
    await fetch("/api/admin/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFolderName.trim() }),
    });
    setNewFolderName("");
    setCreatingFolder(false);
    fetchData();
  };

  const deleteFolder = async (id: string) => {
    if (!confirm("Delete this folder? Files inside will be moved to 'Unfiled'.")) return;
    await fetch(`/api/admin/folders/${id}`, { method: "DELETE" });
    fetchData();
  };

  const moveFileToFolder = async (fileId: string, folderId: string | null) => {
    await fetch(`/api/admin/files/${fileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder_id: folderId }),
    });
    fetchData();
  };

  const toggleDefault = async (fileId: string, isDefault: boolean) => {
    await fetch(`/api/admin/files/${fileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_default: isDefault }),
    });
    fetchData();
  };

  const totalSize = files.reduce((sum, f) => sum + (f.size_bytes || 0), 0);
  const stats = [
    { label: "Files uploaded", value: files.length },
    { label: "Folders", value: folders.length },
    { label: "Total size (MB)", value: Math.round(totalSize / (1024 * 1024) * 10) / 10 || 0 },
  ];

  // Group files by folder
  const unfiledFiles = files.filter((f) => !f.folder_id);
  const filesByFolder = folders.map((folder) => ({
    folder,
    files: files.filter((f) => f.folder_id === folder.id),
  }));

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-primary mb-6">File Manager</h1>
        <div className="text-center py-12 text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">File Manager</h1>
      <StatsRow stats={stats} />

      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="New folder name..."
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createFolder()}
          className="flex-1 px-4 py-2 border border-border rounded-lg text-sm focus:border-primary outline-none"
        />
        <button
          onClick={createFolder}
          disabled={creatingFolder || !newFolderName.trim()}
          className="px-5 py-2 bg-green text-white text-sm font-medium rounded-lg hover:bg-[#24774f] disabled:opacity-40 transition-colors"
        >
          {creatingFolder ? "Creating..." : "New Folder"}
        </button>
      </div>

      <UploadZone />

      {/* Folders with files */}
      {filesByFolder.map(({ folder, files: folderFiles }) => (
        <div key={folder.id} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <h2 className="text-lg font-semibold text-primary">{folder.name}</h2>
              <span className="text-xs text-muted">({folderFiles.length} files)</span>
            </div>
            <button
              onClick={() => deleteFolder(folder.id)}
              className="ml-auto text-xs text-red-500 hover:text-red-600"
            >
              Delete folder
            </button>
          </div>
          <FilesTable
            files={folderFiles}
            folders={folders}
            onMoveToFolder={moveFileToFolder}
            onToggleDefault={toggleDefault}
            onRefresh={fetchData}
          />
        </div>
      ))}

      {/* Unfiled files */}
      {unfiledFiles.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-lg font-semibold text-primary">Unfiled</h2>
            <span className="text-xs text-muted">({unfiledFiles.length} files)</span>
          </div>
          <FilesTable
            files={unfiledFiles}
            folders={folders}
            onMoveToFolder={moveFileToFolder}
            onToggleDefault={toggleDefault}
            onRefresh={fetchData}
          />
        </div>
      )}

      {files.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted text-sm">
          No files uploaded yet. Use the upload zone above.
        </div>
      )}
    </div>
  );
}
