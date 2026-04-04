"use client";

import { useState } from "react";
import { TabNav } from "@/components/admin/content-editor/tab-nav";
import { ContentForm } from "@/components/admin/content-editor/content-form";

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState("splash");

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Content Editor</h1>
      <TabNav active={activeTab} onChange={setActiveTab} />
      <ContentForm key={activeTab} pageKey={activeTab} />
    </div>
  );
}
