"use client";

import { useRef, useState } from "react";

interface ToolbarProps {
  filename: string;
  onFileLoad: (content: string, name: string) => void;
  onExport: (format: "pdf" | "docx" | "md") => void;
}

export default function Toolbar({ filename, onFileLoad, onExport }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportOpen, setExportOpen] = useState(false);

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

      <div className="relative ml-auto">
        <button
          onClick={() => setExportOpen((v) => !v)}
          onBlur={() => setTimeout(() => setExportOpen(false), 150)}
          className="shrink-0 cursor-pointer rounded px-3 py-2 text-sm font-medium text-white transition-colors active:scale-95"
          style={{ background: "var(--accent)" }}
        >
          Export ▾
        </button>
        {exportOpen && (
          <div
            className="absolute right-0 mt-1 min-w-[120px] rounded shadow-lg"
            style={{ background: "var(--primary)", border: "1px solid var(--border)" }}
          >
            {(["pdf", "docx", "md"] as const).map((fmt) => (
              <button
                key={fmt}
                onMouseDown={() => { onExport(fmt); setExportOpen(false); }}
                className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-white hover:opacity-80"
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

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
