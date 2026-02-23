# MD Checklist — Spec

## Purpose

A markdown reader with interactive checkboxes, built for **discovery calls**. Load any `.md` file and every item becomes a checkable line — so you can track what's been covered in real time during a client conversation.

This is part of a **bidirectional prompting workflow**: you ask the client questions from the checklist, capture their answers, and use the checked/unchecked state to know exactly where you are and what's left.

---

## Workflow: Discovery Call

1. **Before the call** — Load your `client-discovery-questions.md` (or any question file) into the app
2. **During the call** — Check off each question as you cover it; skip around freely since checkboxes are independent
3. **After the call** — Review unchecked items to identify gaps; follow up with the client on anything missed

The default file is the full 38-question client discovery questionnaire covering:
- About Your Business
- Your Brand & Look
- Words & Content
- What the Site Needs to Do
- Technical Stuff
- Your Competition
- Where You Work
- Timeline & Decisions
- After We Launch

---

## App Features

### Core
- **Markdown parsing** — Renders any `.md` file using `react-markdown` + `remark-gfm`
- **Checkboxes on everything** — Every heading (h1–h6), list item, paragraph, and blockquote gets a checkbox
- **Check state** — Checked items get orange fill + strikethrough text; unchecked have blue border
- **State resets** when a new file is loaded

### File Loading
- **Open button** — File picker in the toolbar (`.md`, `.markdown`, `.txt`)
- **Drag & drop** — Drop a file anywhere on the page
- **Default file** — Loads `client-discovery-questions.md` on startup from `/public/default.md`

### UI
- **Toolbar** — Fixed top bar, blue (#3B82F6) background, orange "Open .md file" button
- **Content area** — Max width 900px, centered, clean slate background (#f8fafc)
- **Drop overlay** — Blue tinted overlay with orange dashed border when dragging a file

---

## Color Palette

| Color         | Hex       | Usage                                      |
|---------------|-----------|---------------------------------------------|
| Primary Blue  | `#3B82F6` | Toolbar bg, checkbox border, h1/h2 color, blockquote accent |
| Orange        | `#f97316` | Open button, checked checkbox fill           |
| White         | `#ffffff` | Button text, toolbar text, checkbox bg       |
| Slate BG      | `#f8fafc` | Page background                              |
| Slate Text    | `#1e293b` | Body text                                    |
| Muted Text    | `#64748b` | Checked/strikethrough text, h4               |

---

## Tech Stack

- **Next.js 16** — App router, static export capable
- **React 19**
- **Tailwind CSS v4** — Using `@import "tailwindcss"` + `@theme inline`
- **react-markdown 10** + **remark-gfm 4**
- **TypeScript 5**

---

## Component Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout, metadata
│   ├── page.tsx          # State management, file loading
│   └── globals.css       # Tailwind import, CSS vars, prose styles, checkbox styles
├── components/
│   ├── ChecklistViewer.tsx  # Markdown renderer with checkboxes
│   ├── Toolbar.tsx          # Top bar with file open button
│   └── DropZone.tsx         # Drag & drop overlay
public/
└── default.md            # Client discovery questions (38 questions)
```

---

## Future Considerations

- Export checked state (e.g. JSON or annotated markdown)
- Notes field per checkbox for capturing client answers inline
- Progress bar showing % checked
- Multiple file tabs
- Print-friendly view for post-call summary
