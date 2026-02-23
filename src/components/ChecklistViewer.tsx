"use client";

import { useState, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ReactNode } from "react";

interface ChecklistViewerProps {
  content: string;
}

export default function ChecklistViewer({ content }: ChecklistViewerProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setChecked({});
  }, [content]);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  let counter = 0;

  function withCheckbox(id: string, children: ReactNode) {
    const isChecked = !!checked[id];
    return (
      <span className="checklist-row">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => toggle(id)}
          className="checklist-box"
        />
        <span className={isChecked ? "checked-text" : ""}>{children}</span>
      </span>
    );
  }

  return (
    <article className="prose mx-auto max-w-[900px] px-3 pt-14 pb-12 sm:px-4 md:px-6 lg:px-8">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1>{withCheckbox(`h-${counter++}`, children)}</h1>,
          h2: ({ children }) => <h2>{withCheckbox(`h-${counter++}`, children)}</h2>,
          h3: ({ children }) => <h3>{withCheckbox(`h-${counter++}`, children)}</h3>,
          h4: ({ children }) => <h4>{withCheckbox(`h-${counter++}`, children)}</h4>,
          h5: ({ children }) => <h5>{withCheckbox(`h-${counter++}`, children)}</h5>,
          h6: ({ children }) => <h6>{withCheckbox(`h-${counter++}`, children)}</h6>,
          li: ({ children }) => (
            <li style={{ listStyle: "none" }}>{withCheckbox(`li-${counter++}`, children)}</li>
          ),
          p: ({ children }) => <p>{withCheckbox(`p-${counter++}`, children)}</p>,
          blockquote: ({ children }) => <blockquote>{children}</blockquote>,
          img: ({ src, alt, ...props }) => {
            if (!src) return null;
            return <img src={src} alt={alt ?? ""} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
