import { marked } from 'marked';
import { Document, Packer, Paragraph, TextRun, BorderStyle, AlignmentType, TabStopType } from 'docx';

// ── Color palette (matches Python generate_country_resumes.py) ────────────────
const NAVY  = '1A3C6E';
const GRAY  = '555555';
const LINK  = '0563C1';
const BLACK = '000000';

// ── Font & size constants (half-points, so ×2 of pt value) ──────────────────
const FONT         = 'Calibri';
const NAME_SIZE    = 44;  // 22pt – large centered name
const SECTION_SIZE = 22;  // 11pt – section headings
const COMPANY_SIZE = 21;  // 10.5pt – company / institution header
const ROLE_SIZE    = 20;  // 10pt – role title
const BODY_SIZE    = 19;  // 9.5pt – body / bullets / skills
const CONTACT_SIZE = 19;  // 9.5pt – contact block

// A4 content width: 11906 − 792 − 792 = 10322 twips  (right-align tab)
const RIGHT_TAB = 10322;

/** Regex matching any date token */
const DATE_RE = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|Present|\d{4})\b/i;

// ── Helpers ───────────────────────────────────────────────────────────────────

function stripInline(text: string): string {
  return text
    .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1');
}

/** Parse inline **bold**, *italic*, ***bold+italic*** into TextRun[]. */
function parseInline(
  text: string,
  opts: { italic?: boolean; bold?: boolean; size?: number; color?: string } = {},
): TextRun[] {
  const size  = opts.size  ?? BODY_SIZE;
  const color = opts.color ?? BLACK;
  const parts = text.split(/(\*{1,3}[^*]+\*{1,3})/);
  return parts.filter(p => p.length > 0).map(part => {
    if (/^\*\*\*(.+)\*\*\*$/.test(part))
      return new TextRun({ text: part.slice(3, -3), bold: true, italics: true, font: FONT, size, color });
    if (/^\*\*(.+)\*\*$/.test(part))
      return new TextRun({ text: part.slice(2, -2), bold: true, italics: opts.italic ?? false, font: FONT, size, color });
    if (/^\*(.+)\*$/.test(part))
      return new TextRun({ text: part.slice(1, -1), italics: true, font: FONT, size, color });
    return new TextRun({ text: part, bold: opts.bold, italics: opts.italic, font: FONT, size, color });
  });
}

/** Detect "Left Part | Date" or "Left Part — Date" patterns. */
function detectRoleDateLine(line: string): { role: string; date: string } | null {
  const pipeMatch = line.match(/^(.+?)\s*\|\s*([^|]+)$/);
  if (pipeMatch && DATE_RE.test(pipeMatch[2]))
    return { role: pipeMatch[1].trim(), date: pipeMatch[2].trim() };
  const dashMatch = line.match(/^(.+?)\s*[—–]\s*(.+)$/);
  if (dashMatch && DATE_RE.test(dashMatch[2]))
    return { role: dashMatch[1].trim(), date: dashMatch[2].trim() };
  return null;
}

// ── Core Markdown → Paragraph[] converter ────────────────────────────────────

function markdownToDocxParagraphs(md: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const lines = md.split('\n');

  /**
   * inHeader = true after we see H1, until we see the first H2.
   * All non-blank lines in this window are rendered as centered contact lines.
   */
  let inHeader = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // ── Blank line ──────────────────────────────────────────────────────────
    if (!line) {
      if (!inHeader) paragraphs.push(new Paragraph({ spacing: { after: 30 } }));
      continue;
    }

    // ── H1 — candidate name ─────────────────────────────────────────────────
    const h1 = line.match(/^#\s+(.*)/);
    if (h1) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({
          text: stripInline(h1[1]).toUpperCase(),
          bold: true, font: FONT, size: NAME_SIZE, color: NAVY,
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
      }));
      inHeader = true;
      continue;
    }

    // ── H2 — section heading with navy underline ────────────────────────────
    const h2 = line.match(/^##\s+(.*)/);
    if (h2) {
      inHeader = false;
      paragraphs.push(new Paragraph({
        children: [new TextRun({
          text: stripInline(h2[1]).toUpperCase(),
          bold: true, font: FONT, size: SECTION_SIZE, color: NAVY,
        })],
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: NAVY, space: 1 } },
        spacing: { before: 160, after: 60 },
      }));
      continue;
    }

    // ── H3 — company / institution header ──────────────────────────────────
    const h3 = line.match(/^###\s+(.*)/);
    if (h3) {
      inHeader = false;
      paragraphs.push(new Paragraph({
        children: [new TextRun({
          text: stripInline(h3[1]),
          bold: true, font: FONT, size: COMPANY_SIZE, color: NAVY,
        })],
        spacing: { before: 140, after: 20 },
      }));
      continue;
    }

    // ── H4 ──────────────────────────────────────────────────────────────────
    const h4 = line.match(/^####\s+(.*)/);
    if (h4) {
      inHeader = false;
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: stripInline(h4[1]), bold: true, font: FONT, size: BODY_SIZE })],
        spacing: { before: 80, after: 20 },
      }));
      continue;
    }

    // ── Contact block (lines between H1 and first H2) ───────────────────────
    if (inHeader) {
      const isLink  = /linkedin|github|http/i.test(line);
      const isBadge = /open to|visa|work permit|work pass|willing to obtain|relocation|eligible/i.test(line);
      const textColor = isLink ? LINK : isBadge ? NAVY : GRAY;
      paragraphs.push(new Paragraph({
        children: [new TextRun({
          text: stripInline(line),
          font: FONT, size: CONTACT_SIZE, color: textColor,
          bold: isBadge,
        })],
        alignment: AlignmentType.CENTER,
        spacing: { after: isBadge ? 60 : 20 },
      }));
      continue;
    }

    // ── Horizontal rule ─────────────────────────────────────────────────────
    if (/^[-*_]{3,}$/.test(line)) {
      paragraphs.push(new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'AAAAAA', space: 4 } },
        spacing: { after: 80 },
      }));
      continue;
    }

    // ── Bullet ──────────────────────────────────────────────────────────────
    const bullet = line.match(/^[-*•]\s+(.*)/);
    if (bullet) {
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({ text: '•  ', font: FONT, size: BODY_SIZE, color: NAVY }),
          ...parseInline(bullet[1], { size: BODY_SIZE }),
        ],
        indent: { left: 360, hanging: 0 },
        spacing: { after: 20 },
      }));
      continue;
    }

    // ── Skills line — **Category:** value1, value2 ──────────────────────────
    const skillLine = line.match(/^\*\*([^*:]+):\*\*\s*(.*)/);
    if (skillLine) {
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({ text: `${skillLine[1]}: `, bold: true, font: FONT, size: BODY_SIZE }),
          new TextRun({ text: skillLine[2], font: FONT, size: BODY_SIZE }),
        ],
        spacing: { after: 20 },
      }));
      continue;
    }

    // ── Role + Date line — **Senior Engineer** | Mar 2023 – Present ─────────
    const roleDate = detectRoleDateLine(line);
    if (roleDate) {
      paragraphs.push(new Paragraph({
        children: [
          ...parseInline(roleDate.role, { italic: true, size: ROLE_SIZE, color: BLACK }),
          new TextRun({ text: '\t', font: FONT, size: BODY_SIZE }),
          ...parseInline(roleDate.date, { italic: true, size: BODY_SIZE, color: GRAY }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
        spacing: { before: 20, after: 30 },
      }));
      continue;
    }

    // ── Regular paragraph ────────────────────────────────────────────────────
    paragraphs.push(new Paragraph({
      children: parseInline(line, { size: BODY_SIZE }),
      spacing: { after: 50 },
    }));
  }

  return paragraphs;
}


// ── HTML post-processing for PDF ─────────────────────────────────────────────

/**
 * Enrich the HTML produced by `marked` with semantic CSS classes so the
 * print stylesheet can apply proper layout (centered contact, flex role/date).
 */
function postProcessResumeHtml(html: string): string {
  // 1. Center the contact-info paragraph immediately after <h1>
  html = html.replace(/(<\/h1>\s*)<p>/, '$1<p class="contact-line">');

  // 2. Detect role+date paragraphs:
  //    <p> containing <strong>…</strong> … | … date …
  //    Wrap left and right parts in spans for flex layout.
  html = html.replace(/<p>(.*?)<\/p>/gs, (_match, inner: string) => {
    if (!DATE_RE.test(inner)) return `<p>${inner}</p>`;
    // Must have a pipe separator
    const pipeIdx = inner.lastIndexOf('|');
    if (pipeIdx < 1) return `<p>${inner}</p>`;
    // Only treat as role line if left side contains bold or italic text
    const left = inner.slice(0, pipeIdx).trim();
    const right = inner.slice(pipeIdx + 1).trim();
    if (!/<strong>|<em>/.test(left)) return `<p>${inner}</p>`;
    return `<p class="role-line"><span class="rl-role">${left}</span><span class="rl-date">${right}</span></p>`;
  });

  return html;
}

// ── Public exports ────────────────────────────────────────────────────────────

export function extractCandidateName(content: string): string {
  const match = content.match(/^#\s+(.*)/m);
  return match ? stripInline(match[1]).trim() : 'Resume';
}

export async function downloadDocx(content: string, candidateName: string): Promise<void> {
  const paragraphs = markdownToDocxParagraphs(content);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            // A4: 11906 × 16838 twips  |  margins match Python script (inches→twips ×1440)
            size: { width: 11906, height: 16838 },
            margin: { top: 720, bottom: 576, left: 792, right: 792 },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(candidateName || 'Resume').replace(/\s+/g, '_')}_Resume.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadPdf(content: string, candidateName: string): void {
  const rawHtml = String(marked.parse(content));
  const html = postProcessResumeHtml(rawHtml);
  const fileName = `${(candidateName || 'Resume').replace(/\s+/g, '_')}_Resume`;

  const printHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${fileName}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: Calibri, 'Segoe UI', Arial, sans-serif;
      font-size: 10.5pt;
      color: #000;
      line-height: 1.38;
      padding: 0.65in 0.8in;
      max-width: 8.5in;
      margin: 0 auto;
    }

    /* ── Name ── */
    h1 {
      font-size: 22pt;
      font-weight: 700;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 3px;
    }

    /* ── Contact info line (immediately after h1) ── */
    .contact-line {
      text-align: center;
      font-size: 10pt;
      color: #111;
      margin-bottom: 10px;
    }
    .contact-line a { color: #111; text-decoration: none; }

    /* ── Section headings ── */
    h2 {
      font-size: 10.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1.5px solid #000;
      margin-top: 13px;
      margin-bottom: 4px;
      padding-bottom: 2px;
    }

    /* ── Company / Institution ── */
    h3 {
      font-size: 10.5pt;
      font-weight: 700;
      text-transform: uppercase;
      margin-top: 8px;
      margin-bottom: 1px;
    }

    /* ── Sub-role heading (h4) ── */
    h4 {
      font-size: 10.5pt;
      font-weight: 600;
      margin: 4px 0 1px;
    }

    /* ── Role + Date flex row ── */
    .role-line {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin: 1px 0 3px;
    }
    .rl-role { font-style: italic; }
    .rl-date { font-style: italic; white-space: nowrap; padding-left: 8px; }

    /* ── Regular paragraphs ── */
    p { margin: 2px 0; }

    /* ── Bullets ── */
    ul { padding-left: 1.3em; margin: 2px 0 5px; list-style-type: disc; }
    li { margin: 1.5px 0; line-height: 1.38; }

    /* ── Inline styles ── */
    a { color: #000; text-decoration: none; }
    strong { font-weight: 700; }
    em { font-style: italic; }
    hr { border: none; border-top: 1.5px solid #000; margin: 8px 0; }

    /* ── Print settings ── */
    @media print {
      body { padding: 0.5in 0.65in; }
      @page { margin: 0; size: letter; }
      h2, h3 { page-break-after: avoid; }
      .role-line, li { page-break-inside: avoid; }
    }
  </style>
</head>
<body>${html}</body>
</html>`;

  const printWindow = window.open('', '_blank', 'width=900,height=750');
  if (!printWindow) {
    alert('Please allow pop-ups to download the PDF, then try again.');
    return;
  }
  printWindow.document.write(printHtml);
  printWindow.document.close();
  // Short delay to let the browser render before opening print dialog
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 400);
}
