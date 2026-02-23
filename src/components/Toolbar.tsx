"use client";

import { useRef } from "react";

interface ToolbarProps {
  filename: string;
  onFileLoad: (content: string, name: string) => void;
}

export default function Toolbar({ filename, onFileLoad }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === "string") onFileLoad(text, file.name);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4"
      style={{ background: "var(--primary)", borderBottom: "1px solid var(--border)" }}
    >
      <button
        onClick={() => fileInputRef.current?.click()}
        className="shrink-0 cursor-pointer rounded px-3 py-2 text-sm font-medium text-white transition-colors active:scale-95"
        style={{ background: "var(--accent)" }}
      >
        Open .md file
      </button>
      <span className="truncate text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
        {filename}
      </span>
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
    </header>
  );
}
