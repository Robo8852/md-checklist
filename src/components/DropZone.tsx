"use client";

import { useEffect, useState } from "react";

interface DropZoneProps {
  onFileDrop: (content: string, name: string) => void;
}

export default function DropZone({ onFileDrop }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let dragCounter = 0;
    const handleDragEnter = (e: DragEvent) => { e.preventDefault(); dragCounter++; setIsDragging(true); };
    const handleDragOver = (e: DragEvent) => e.preventDefault();
    const handleDragLeave = (e: DragEvent) => { e.preventDefault(); dragCounter--; if (dragCounter === 0) setIsDragging(false); };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault(); dragCounter = 0; setIsDragging(false);
      const file = e.dataTransfer?.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { const text = ev.target?.result; if (typeof text === "string") onFileDrop(text, file.name); };
      reader.readAsText(file);
    };
    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);
    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, [onFileDrop]);

  if (!isDragging) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center text-2xl text-white"
      style={{ background: "rgba(59,130,246,0.3)", border: "3px dashed var(--accent)" }}
    >
      Drop .md file here
    </div>
  );
}
