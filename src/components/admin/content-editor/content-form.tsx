"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ContentFormProps {
  pageKey: string;
}

export function ContentForm({ pageKey }: ContentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`/api/admin/content/${pageKey}`)
      .then((r) => r.json())
      .then(setContent)
      .catch(() => setContent({}));
  }, [pageKey]);

  const save = async () => {
    setSaving(true);
    setStatus("");
    const res = await fetch(`/api/admin/content/${pageKey}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setStatus(res.ok ? "Saved" : "Error saving");
    setTimeout(() => setStatus(""), 2000);
  };

  const reset = async () => {
    if (!confirm("Reset to defaults? This cannot be undone.")) return;
    setResetting(true);
    await fetch(`/api/admin/content/${pageKey}/reset`, { method: "POST" });
    setResetting(false);
    // Reload content
    const res = await fetch(`/api/admin/content/${pageKey}`);
    setContent(await res.json());
    setStatus("Reset to defaults");
    setTimeout(() => setStatus(""), 2000);
  };

  if (!content) {
    return <div className="text-sm text-muted py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        {renderFields(content, [], (path, value) => {
          setContent((prev) => {
            const next = JSON.parse(JSON.stringify(prev));
            let obj = next;
            for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
            obj[path[path.length - 1]] = value;
            return next;
          });
        })}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button onClick={save} disabled={saving}
          className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-[#2d3748] disabled:opacity-40 transition-colors">
          {saving ? "Saving\u2026" : "Save changes"}
        </button>
        <button onClick={reset} disabled={resetting}
          className="px-5 py-2.5 border border-border text-sm text-muted rounded-lg hover:border-muted disabled:opacity-40 transition-colors">
          {resetting ? "Resetting\u2026" : "Reset to defaults"}
        </button>
        {status && <span className="text-sm text-green font-medium">{status}</span>}
      </div>
    </div>
  );
}

function renderFields(
  obj: Record<string, unknown>,
  path: string[],
  onChange: (path: string[], value: unknown) => void
): React.ReactNode[] {
  return Object.entries(obj).map(([key, value]) => {
    const currentPath = [...path, key];
    const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const cls = "w-full p-3 border border-border rounded-lg text-sm focus:border-primary outline-none";
    const k = currentPath.join(".");

    if (typeof value === "string") {
      return (
        <div key={k}>
          <label className="block text-xs font-medium text-muted mb-1">{label}</label>
          {value.length > 100
            ? <textarea value={value} onChange={(e) => onChange(currentPath, e.target.value)} rows={4} className={`${cls} resize-none`} />
            : <input type="text" value={value} onChange={(e) => onChange(currentPath, e.target.value)} className={cls} />}
        </div>
      );
    }
    if (typeof value === "number") {
      return (
        <div key={k}>
          <label className="block text-xs font-medium text-muted mb-1">{label}</label>
          <input type="number" value={value} onChange={(e) => onChange(currentPath, Number(e.target.value))} className={cls} />
        </div>
      );
    }
    if (typeof value === "boolean") {
      return (
        <div key={k} className="flex items-center gap-2">
          <input type="checkbox" checked={value} onChange={(e) => onChange(currentPath, e.target.checked)} className="w-4 h-4 rounded border-border" />
          <label className="text-sm text-primary">{label}</label>
        </div>
      );
    }

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      return (
        <fieldset key={k} className="border border-border/50 rounded-lg p-4 space-y-4">
          <legend className="text-xs font-semibold text-primary px-2">{label}</legend>
          {renderFields(value as Record<string, unknown>, currentPath, onChange)}
        </fieldset>
      );
    }
    if (Array.isArray(value)) {
      const json = JSON.stringify(value, null, 2);
      return (
        <div key={k}>
          <label className="block text-xs font-medium text-muted mb-1">{label} (JSON)</label>
          <textarea value={json} onChange={(e) => { try { onChange(currentPath, JSON.parse(e.target.value)); } catch {} }}
            rows={Math.min(10, json.split("\n").length + 1)} className={`${cls} text-xs font-mono resize-none`} />
        </div>
      );
    }
    return null;
  });
}
