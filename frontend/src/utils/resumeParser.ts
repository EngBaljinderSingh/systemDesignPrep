import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Use new URL() so Vite bundles the worker locally — avoids CDN fetch failures
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Extract plain text from an uploaded file (.txt, .md, .docx, .pdf).
 * Returned string is the raw resume text ready to pass to the AI.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

  // ── Plain text / Markdown ─────────────────────────────────────────────────
  if (ext === 'txt' || ext === 'md' || ext === 'text') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) ?? '');
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  }

  // ── Word document ─────────────────────────────────────────────────────────
  if (ext === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    if (result.messages.some((m: { type: string }) => m.type === 'error')) {
      console.warn('mammoth warnings:', result.messages);
    }
    return result.value.trim();
  }

  // ── PDF ───────────────────────────────────────────────────────────────────
  if (ext === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pageTexts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const lines = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      pageTexts.push(lines);
    }
    return pageTexts.join('\n\n').trim();
  }

  throw new Error(`Unsupported file type: .${ext}`);
}
