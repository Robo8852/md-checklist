"use client";

import { useCallback, useEffect, useState } from "react";
import Toolbar from "@/components/Toolbar";
import ChecklistViewer from "@/components/ChecklistViewer";
import DropZone from "@/components/DropZone";
import { exportAsMarkdown, exportAsPdf, exportAsDocx } from "@/lib/exportUtils";

const DEFAULT_FILE = "discovery-call.md";

export default function Home() {
  const [content, setContent] = useState("");
  const [filename, setFilename] = useState(DEFAULT_FILE);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/default.md")
      .then((r) => r.text())
      .then((text) => setContent(text))
      .catch(() =>
        setContent(
          "# Discovery Call Checklist\n\n- What is your business name?\n- What industry are you in?\n- Do you have an existing website?\n- What are your main goals?\n  - More leads\n  - Brand awareness\n  - Online sales\n- What is your budget range?\n- What is your timeline?"
        )
      );
  }, []);

  const handleFileLoad = useCallback((text: string, name: string) => {
    setContent(text);
    setFilename(name);
    setChecked({});
    window.scrollTo(0, 0);
  }, []);

  const handleExport = useCallback(
    (format: "pdf" | "docx" | "md") => {
      switch (format) {
        case "md":
          exportAsMarkdown(content, checked, filename);
          break;
        case "pdf":
          exportAsPdf(filename);
          break;
        case "docx":
          exportAsDocx(content, checked, filename);
          break;
      }
    },
    [content, checked, filename],
  );

  return (
    <>
      <Toolbar filename={filename} onFileLoad={handleFileLoad} onExport={handleExport} />
      <ChecklistViewer content={content} checked={checked} onCheckedChange={setChecked} />
      <DropZone onFileDrop={handleFileLoad} />
    </>
  );
}
