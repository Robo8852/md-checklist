import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

function baseName(filename: string) {
  return filename.replace(/\.[^.]+$/, "");
}

/**
 * Rebuild the markdown with checkbox state encoded as GFM task-list syntax.
 */
export function exportAsMarkdown(
  content: string,
  checked: Record<string, boolean>,
  filename: string,
) {
  const lines = content.split("\n");
  let counter = 0;

  const output = lines.map((line) => {
    // Heading lines
    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      const id = `h-${counter++}`;
      const prefix = checked[id] ? "[x]" : "[ ]";
      return `${headingMatch[1]} ${prefix} ${headingMatch[2]}`;
    }

    // List items (- or * or digits.)
    const listMatch = line.match(/^(\s*[-*]|\s*\d+\.)\s+(.*)/);
    if (listMatch) {
      const id = `li-${counter++}`;
      const prefix = checked[id] ? "[x]" : "[ ]";
      return `${listMatch[1]} ${prefix} ${listMatch[2]}`;
    }

    // Paragraph-level text (non-empty, non-blank lines that aren't headings/lists/blockquotes/images)
    if (line.trim() && !line.match(/^>/) && !line.match(/^!\[/)) {
      const id = `p-${counter++}`;
      const prefix = checked[id] ? "[x]" : "[ ]";
      return `${prefix} ${line}`;
    }

    return line;
  });

  const blob = new Blob([output.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${baseName(filename)}-checklist.md`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Capture the rendered article element as a PDF.
 */
export async function exportAsPdf(filename: string) {
  const el = document.querySelector("article.prose") as HTMLElement | null;
  if (!el) return;

  const canvas = await html2canvas(el, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");

  const pdfWidth = 210; // A4 mm
  const pdfHeight = 297;
  const imgWidth = pdfWidth - 20; // 10mm margins
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF("p", "mm", "a4");
  let y = 10;
  let remaining = imgHeight;

  // First page
  pdf.addImage(imgData, "PNG", 10, y, imgWidth, imgHeight);
  remaining -= pdfHeight - 20;

  // Additional pages if content is tall
  while (remaining > 0) {
    pdf.addPage();
    y = -(imgHeight - remaining) + 10;
    pdf.addImage(imgData, "PNG", 10, y, imgWidth, imgHeight);
    remaining -= pdfHeight - 20;
  }

  pdf.save(`${baseName(filename)}-checklist.pdf`);
}

/**
 * Build a DOCX with checkboxes from the markdown content and checked state.
 */
export async function exportAsDocx(
  content: string,
  checked: Record<string, boolean>,
  filename: string,
) {
  const lines = content.split("\n");
  let counter = 0;
  const paragraphs: Paragraph[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      const id = `h-${counter++}`;
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      const headingMap = {
        1: "Heading1" as const,
        2: "Heading2" as const,
        3: "Heading3" as const,
        4: "Heading4" as const,
        5: "Heading5" as const,
        6: "Heading6" as const,
      };
      paragraphs.push(
        new Paragraph({
          heading: headingMap[level],
          children: [
            new TextRun({ text: checked[id] ? "\u2611 " : "\u2610 " }),
            new TextRun({ text: headingMatch[2] }),
          ],
        }),
      );
      continue;
    }

    const listMatch = line.match(/^(\s*)[-*]\s+(.*)/);
    if (listMatch) {
      const id = `li-${counter++}`;
      const indent = Math.floor(listMatch[1].length / 2);
      paragraphs.push(
        new Paragraph({
          indent: { left: 360 * (indent + 1) },
          children: [
            new TextRun({ text: checked[id] ? "\u2611 " : "\u2610 " }),
            new TextRun({ text: listMatch[2] }),
          ],
        }),
      );
      continue;
    }

    // Numbered list
    const numMatch = line.match(/^(\s*)\d+\.\s+(.*)/);
    if (numMatch) {
      const id = `li-${counter++}`;
      const indent = Math.floor(numMatch[1].length / 2);
      paragraphs.push(
        new Paragraph({
          indent: { left: 360 * (indent + 1) },
          children: [
            new TextRun({ text: checked[id] ? "\u2611 " : "\u2610 " }),
            new TextRun({ text: numMatch[2] }),
          ],
        }),
      );
      continue;
    }

    if (line.trim() && !line.match(/^>/) && !line.match(/^!\[/)) {
      const id = `p-${counter++}`;
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: checked[id] ? "\u2611 " : "\u2610 " }),
            new TextRun({ text: line.trim() }),
          ],
        }),
      );
      continue;
    }

    if (line.trim() === "") {
      paragraphs.push(new Paragraph({}));
    }
  }

  const doc = new Document({
    sections: [{ children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${baseName(filename)}-checklist.docx`);
}
