import { useState } from 'react';
import { resumeApi, type CreateResumePayload, type WorkExperiencePayload, type EducationEntryPayload } from '../api/resumeApi';
import { downloadDocx, downloadPdf, extractCandidateName } from '../utils/resumeExport';
import { extractTextFromFile } from '../utils/resumeParser';

// ── Types ────────────────────────────────────────────────────────────────────

interface WorkExperience extends WorkExperiencePayload {
  id: string;
}

interface EducationEntry extends EducationEntryPayload {
  id: string;
}

interface ResumeFormData {
  fullName: string;
  email: string;
  phone: string;
  linkedIn: string;
  github: string;
  website: string;
  country: string;
  pages: number;
  summary: string;
  oldResume: string;
  workExperience: WorkExperience[];
  education: EducationEntry[];
  skills: string[];
  certifications: string[];
  languages: string[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const COUNTRIES = [
  { value: 'United States', label: '🇺🇸 United States' },
  { value: 'United Kingdom', label: '🇬🇧 United Kingdom' },
  { value: 'Canada', label: '🇨🇦 Canada' },
  { value: 'Australia', label: '🇦🇺 Australia' },
  { value: 'India', label: '🇮🇳 India' },
  { value: 'Germany', label: '🇩🇪 Germany' },
  { value: 'Japan', label: '🇯🇵 Japan' },
  { value: 'Singapore', label: '🇸🇬 Singapore' },
  { value: 'UAE', label: '🇦🇪 UAE / Dubai' },
  { value: 'Netherlands', label: '🇳🇱 Netherlands' },
  { value: 'Other', label: '🌍 Other' },
];

// Countries for the dedicated export tab (matching Python generator + country-specific notes)
const EXPORT_COUNTRIES = [
  { value: 'Canada',         label: '🇨🇦 Canada',       note: 'ATS-optimized · PR/work-permit note' },
  { value: 'United Kingdom', label: '🇬🇧 UK',            note: 'CV format · formal British English' },
  { value: 'Japan',          label: '🇯🇵 Japan',          note: 'Shokumukeirekisho · kaizen tone' },
  { value: 'ATS',            label: '📄 ATS Resume',     note: 'Universal · keyword-rich · clean' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => crypto.randomUUID();

const emptyWork = (): WorkExperience => ({
  id: uid(), company: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '',
});

const emptyEdu = (): EducationEntry => ({
  id: uid(), institution: '', degree: '', field: '', location: '', startDate: '', endDate: '', gpa: '',
});

const DEFAULT_FORM: ResumeFormData = {
  fullName: '', email: '', phone: '', linkedIn: '', github: '', website: '',
  country: 'United States', pages: 1, summary: '', oldResume: '',
  workExperience: [emptyWork()],
  education: [emptyEdu()],
  skills: [], certifications: [], languages: [],
};

// ── Shared style constants ────────────────────────────────────────────────────

const inputCls =
  'w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20';
const textareaCls = `${inputCls} resize-none`;
const btnPrimary =
  'px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
const btnSecondary =
  'px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-700/60">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

function TagInput({
  tags, onChange, placeholder,
}: { tags: string[]; onChange: (tags: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState('');

  const addTag = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed && !tags.includes(trimmed)) onChange([...tags, trimmed]);
    setInput('');
  };

  return (
    <div className="flex flex-wrap gap-1.5 p-2 bg-gray-800/50 border border-gray-600 rounded-lg min-h-[42px] cursor-text">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-primary/20 text-primary border border-primary/30"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="ml-0.5 hover:text-red-400 leading-none"
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input); }
          else if (e.key === 'Backspace' && !input && tags.length > 0) onChange(tags.slice(0, -1));
        }}
        onBlur={() => { if (input.trim()) addTag(input); }}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent text-sm text-white placeholder-gray-500 outline-none"
      />
    </div>
  );
}

function PagePicker({ value, onChange }: { value: number; onChange: (p: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3].map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
            value === p
              ? 'bg-primary text-white border-primary'
              : 'bg-gray-800/50 text-gray-300 border-gray-600 hover:border-gray-400'
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

function ResumePreview({
  content, onCopy, copied,
}: { content: string; onCopy: () => void; copied: boolean }) {
  const [docxLoading, setDocxLoading] = useState(false);
  const candidateName = extractCandidateName(content);

  const handleDocx = async () => {
    setDocxLoading(true);
    try {
      await downloadDocx(content, candidateName);
    } finally {
      setDocxLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-200">Generated Resume</h3>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            onClick={() => downloadPdf(content, candidateName)}
            className={btnSecondary}
            title="Opens a print dialog — choose 'Save as PDF'"
          >
            ⬇ PDF
          </button>
          <button onClick={handleDocx} disabled={docxLoading} className={btnSecondary}>
            {docxLoading ? 'Generating…' : '⬇ DOCX'}
          </button>
          <button onClick={onCopy} className={btnSecondary}>
            {copied ? '✓ Copied!' : 'Copy MD'}
          </button>
        </div>
      </div>
      <pre className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-sm text-gray-200 whitespace-pre-wrap font-mono overflow-auto">
        {content}
      </pre>
    </div>
  );
}

// ── Country Export Mode ────────────────────────────────────────────────────────

function CountryExportMode() {
  const [resumeText, setResumeText]     = useState('');
  const [selectedCountry, setSelected]  = useState('');
  const [jobDescription, setJd]         = useState('');
  const [pages, setPages]               = useState(2);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [generating, setGenerating]     = useState(false);
  const [error, setError]               = useState('');
  const [successCountry, setSuccess]    = useState('');

  const canGenerate = resumeText.trim().length > 0 && selectedCountry.length > 0 && !generating;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploadLoading(true);
    setError('');
    try {
      const text = await extractTextFromFile(file);
      setResumeText(text);
    } catch (err) {
      setError(`Could not read file: ${(err as Error).message}`);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleGenerate = async () => {
    setError('');
    setSuccess('');
    setGenerating(true);
    try {
      const { data } = await resumeApi.createResume({
        fullName: '', email: '', phone: '', linkedIn: '', github: '', website: '',
        country: selectedCountry,
        pages,
        summary: jobDescription ? `Tailor keywords from this JD: ${jobDescription.slice(0, 400)}` : '',
        oldResume: resumeText,
        workExperience: [],
        education: [],
        skills: [],
        certifications: [],
        languages: [],
      });
      const name = data.resume.match(/^#\s+(.*)/m)?.[1]?.trim() ?? 'Resume';
      await downloadDocx(data.resume, `${name}_${selectedCountry.replace(/\s+/g, '_')}`);
      setSuccess(selectedCountry);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message ?? 'Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">

      {/* Upload / paste */}
      <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-700/60">
          Step 1 — Upload Your Existing Resume
        </h3>
        <div className="flex items-center gap-3 mb-3">
          <label className={`${uploadLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${btnPrimary}`}>
            {uploadLoading ? 'Reading…' : '📎 Upload Resume (.docx, .txt)'}
            <input type="file" accept=".txt,.md,.text,.docx" className="hidden"
              disabled={uploadLoading} onChange={handleUpload} />
          </label>
          {resumeText && (
            <button type="button" onClick={() => { setResumeText(''); setSuccess(''); }}
              className="text-xs text-red-400 hover:text-red-300">✕ Clear</button>
          )}
          {resumeText && !uploadLoading && (
            <span className="text-xs text-green-400">✓ Resume loaded ({resumeText.length.toLocaleString()} chars)</span>
          )}
        </div>
        <textarea
          className={`${textareaCls} font-mono text-xs`}
          rows={resumeText ? 6 : 3}
          value={resumeText}
          onChange={(e) => { setResumeText(e.target.value); setSuccess(''); }}
          placeholder="…or paste your resume text here (plain text or Markdown)"
        />
      </div>

      {/* Country cards */}
      <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-700/60">
          Step 2 — Choose Target Country
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EXPORT_COUNTRIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => { setSelected(c.value); setSuccess(''); }}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${
                selectedCountry === c.value
                  ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <span className="text-2xl">{c.label.split(' ')[0]}</span>
              <span className="text-xs font-semibold leading-tight">{c.label.split(' ').slice(1).join(' ')}</span>
              <span className="text-[10px] text-gray-500 leading-tight">{c.note}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Optional JD + pages */}
      <div className="bg-gray-800/30 rounded-xl border border-gray-700 p-5">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pb-1 border-b border-gray-700/60">
          Step 3 — Options
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs text-gray-400 mb-1">Job Description (optional — for keyword tailoring)</label>
            <textarea
              className={`${textareaCls} text-xs`}
              rows={4}
              value={jobDescription}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste job description to get keywords woven into the resume…"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Number of Pages</label>
            <PagePicker value={pages} onChange={setPages} />
            <p className="text-[10px] text-gray-500 mt-2">
              AI adjusts content density to fit the target page count.
            </p>
          </div>
        </div>
      </div>

      {/* Generate button */}
      {error && (
        <p className="text-red-400 text-sm p-3 bg-red-400/10 rounded-lg border border-red-400/20">{error}</p>
      )}

      {successCountry && (
        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-sm font-semibold text-green-400">
              {successCountry} resume downloaded!
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              AI formatted it for the {successCountry} job market and saved it as a DOCX file.
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`${btnSecondary} ml-auto shrink-0`}
          >
            ↻ Re-download
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={`${btnPrimary} w-full py-4 text-base font-semibold`}
      >
        {generating
          ? `Generating ${pages}-page ${selectedCountry} resume…`
          : selectedCountry
            ? `⬇ Generate & Download ${selectedCountry} Resume (DOCX)`
            : '⬇ Generate & Download Resume (select a country above)'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        AI reads your resume, re-formats it with {selectedCountry || 'country'}-specific conventions, and downloads a DOCX file instantly.
      </p>
    </div>
  );
}

// ── Create Mode ────────────────────────────────────────────────────────────────

function CreateMode() {
  const [form, setForm] = useState<ResumeFormData>(DEFAULT_FORM);
  const [generatedResume, setGeneratedResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const setField = <K extends keyof ResumeFormData>(key: K, value: ResumeFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const updateWork = (id: string, key: keyof WorkExperience, value: unknown) =>
    setForm((f) => ({
      ...f,
      workExperience: f.workExperience.map((w) => (w.id === id ? { ...w, [key]: value } : w)),
    }));

  const updateEdu = (id: string, key: keyof EducationEntry, value: unknown) =>
    setForm((f) => ({
      ...f,
      education: f.education.map((e) => (e.id === id ? { ...e, [key]: value } : e)),
    }));

  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    try {
      const payload: CreateResumePayload = {
        ...form,
        workExperience: form.workExperience.map(({ id: _id, ...rest }) => rest),
        education: form.education.map(({ id: _id, ...rest }) => rest),
      };
      const { data } = await resumeApi.createResume(payload);
      setGeneratedResume(data.resume);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message ?? 'Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyResume = () => {
    navigator.clipboard.writeText(generatedResume).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto px-6 py-6">
      {/* ── Form column ── */}
      <div className="overflow-auto">

        {/* Old Resume */}
        <Section title="Existing Resume (Optional)">
          <p className="text-xs text-gray-500 mb-2">
            Upload your current resume — AI will read it and regenerate it fully. Form fields below become optional.
          </p>
          <div className="flex items-center gap-2 mb-2">
            <label className={`${uploadLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${btnSecondary}`}>
              {uploadLoading ? 'Reading file…' : '📎 Upload Resume (.pdf, .docx, .txt, .md)'}
              <input
                type="file"
                accept=".txt,.md,.text,.docx,.pdf"
                className="hidden"
                disabled={uploadLoading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  e.target.value = '';
                  setUploadLoading(true);
                  setError('');
                  try {
                    const text = await extractTextFromFile(file);
                    setField('oldResume', text);
                  } catch (err) {
                    setError(`Could not read file: ${(err as Error).message}`);
                  } finally {
                    setUploadLoading(false);
                  }
                }}
              />
            </label>
            {form.oldResume && (
              <button type="button" onClick={() => setField('oldResume', '')} className="text-xs text-red-400 hover:text-red-300">
                ✕ Clear
              </button>
            )}
            {form.oldResume && !uploadLoading && (
              <span className="text-xs text-green-400">✓ Resume loaded — form fields below are optional</span>
            )}
          </div>
          {form.oldResume && (
            <div className="mb-2 p-3 rounded-lg bg-primary/10 border border-primary/30 text-xs text-primary">
              Your uploaded resume will be used as the source of truth. Fill in additional details below only if you want to supplement or override specific sections.
            </div>
          )}
          <textarea
            className={`${textareaCls} font-mono`}
            rows={6}
            value={form.oldResume}
            onChange={(e) => setField('oldResume', e.target.value)}
            placeholder="…or paste your existing resume here (plain text or Markdown)"
          />
        </Section>

        {/* Personal Info */}
        {!form.oldResume && (
        <Section title="Personal Information">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name *">
              <input className={inputCls} value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} placeholder="Jane Smith" />
            </Field>
            <Field label="Email *">
              <input className={inputCls} type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="jane@example.com" />
            </Field>
            <Field label="Phone">
              <input className={inputCls} value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
            </Field>
            <Field label="LinkedIn">
              <input className={inputCls} value={form.linkedIn} onChange={(e) => setField('linkedIn', e.target.value)} placeholder="linkedin.com/in/janesmith" />
            </Field>
            <Field label="GitHub">
              <input className={inputCls} value={form.github} onChange={(e) => setField('github', e.target.value)} placeholder="github.com/janesmith" />
            </Field>
            <Field label="Website">
              <input className={inputCls} value={form.website} onChange={(e) => setField('website', e.target.value)} placeholder="janesmith.dev" />
            </Field>
          </div>
        </Section>
        )}

        {/* Resume Settings */}
        <Section title="Resume Settings">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Target Country *">
              <select className={inputCls} value={form.country} onChange={(e) => setField('country', e.target.value)}>
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Number of Pages">
              <PagePicker value={form.pages} onChange={(p) => setField('pages', p)} />
            </Field>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Country-specific formatting (photo, DOB, length, tone) will be applied automatically.
          </p>
        </Section>

        {/* Summary */}
        {!form.oldResume && (
        <Section title="Professional Summary">
          <textarea
            className={textareaCls}
            rows={3}
            value={form.summary}
            onChange={(e) => setField('summary', e.target.value)}
            placeholder="Results-driven engineer with 5+ years building scalable distributed systems..."
          />
        </Section>
        )}

        {/* Work Experience */}
        {!form.oldResume && (
        <Section title="Work Experience">
          {form.workExperience.map((exp, i) => (
            <div key={exp.id} className="mb-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500 font-medium">Position {i + 1}</span>
                {form.workExperience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setField('workExperience', form.workExperience.filter((w) => w.id !== exp.id))}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Field label="Job Title">
                  <input className={inputCls} value={exp.role} onChange={(e) => updateWork(exp.id, 'role', e.target.value)} placeholder="Senior Software Engineer" />
                </Field>
                <Field label="Company">
                  <input className={inputCls} value={exp.company} onChange={(e) => updateWork(exp.id, 'company', e.target.value)} placeholder="Acme Corp" />
                </Field>
                <Field label="Location">
                  <input className={inputCls} value={exp.location} onChange={(e) => updateWork(exp.id, 'location', e.target.value)} placeholder="New York, NY" />
                </Field>
                <Field label="Start Date">
                  <input className={inputCls} value={exp.startDate} onChange={(e) => updateWork(exp.id, 'startDate', e.target.value)} placeholder="Jan 2022" />
                </Field>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateWork(exp.id, 'current', e.target.checked)}
                    className="rounded"
                  />
                  Currently working here
                </label>
                {!exp.current && (
                  <div className="flex-1">
                    <input
                      className={inputCls}
                      value={exp.endDate}
                      onChange={(e) => updateWork(exp.id, 'endDate', e.target.value)}
                      placeholder="End Date (e.g., Dec 2023)"
                    />
                  </div>
                )}
              </div>
              <Field label="Achievements / Responsibilities">
                <textarea
                  className={textareaCls}
                  rows={3}
                  value={exp.description}
                  onChange={(e) => updateWork(exp.id, 'description', e.target.value)}
                  placeholder={'• Led migration to microservices, cutting latency by 40%\n• Built REST APIs handling 1M+ req/day with Spring Boot'}
                />
              </Field>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setField('workExperience', [...form.workExperience, emptyWork()])}
            className={btnSecondary}
          >
            + Add Position
          </button>
        </Section>
        )}

        {/* Education */}
        {!form.oldResume && (
        <Section title="Education">
          {form.education.map((edu, i) => (
            <div key={edu.id} className="mb-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500 font-medium">Education {i + 1}</span>
                {form.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setField('education', form.education.filter((e) => e.id !== edu.id))}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Institution">
                  <input className={inputCls} value={edu.institution} onChange={(e) => updateEdu(edu.id, 'institution', e.target.value)} placeholder="MIT" />
                </Field>
                <Field label="Degree">
                  <input className={inputCls} value={edu.degree} onChange={(e) => updateEdu(edu.id, 'degree', e.target.value)} placeholder="Bachelor of Science" />
                </Field>
                <Field label="Field of Study">
                  <input className={inputCls} value={edu.field} onChange={(e) => updateEdu(edu.id, 'field', e.target.value)} placeholder="Computer Science" />
                </Field>
                <Field label="Location">
                  <input className={inputCls} value={edu.location} onChange={(e) => updateEdu(edu.id, 'location', e.target.value)} placeholder="Cambridge, MA" />
                </Field>
                <Field label="Start">
                  <input className={inputCls} value={edu.startDate} onChange={(e) => updateEdu(edu.id, 'startDate', e.target.value)} placeholder="Sep 2018" />
                </Field>
                <Field label="End / Expected">
                  <input className={inputCls} value={edu.endDate} onChange={(e) => updateEdu(edu.id, 'endDate', e.target.value)} placeholder="May 2022" />
                </Field>
                <div className="col-span-2">
                  <Field label="GPA (optional)">
                    <input className={inputCls} value={edu.gpa} onChange={(e) => updateEdu(edu.id, 'gpa', e.target.value)} placeholder="3.8 / 4.0" />
                  </Field>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setField('education', [...form.education, emptyEdu()])}
            className={btnSecondary}
          >
            + Add Education
          </button>
        </Section>
        )}

        {/* Skills — always visible, labelled differently based on mode */}
        <Section title={form.oldResume ? 'Extra Skills to Add (Optional)' : 'Skills'}>
          <Field label={form.oldResume ? 'Skills to weave in — press Enter or comma to add' : 'Technical Skills — press Enter or comma to add each skill'}>
            <TagInput tags={form.skills} onChange={(v) => setField('skills', v)} placeholder="Java, Spring Boot, React, AWS..." />
          </Field>
        </Section>

        {/* Additional */}
        <Section title="Additional">
          <div className="grid grid-cols-1 gap-3">
            <Field label="Certifications — press Enter to add">
              <TagInput tags={form.certifications} onChange={(v) => setField('certifications', v)} placeholder="AWS Solutions Architect, Oracle Java SE..." />
            </Field>
            <Field label="Languages Spoken — press Enter to add">
              <TagInput tags={form.languages} onChange={(v) => setField('languages', v)} placeholder="English (Native), Spanish (Intermediate)..." />
            </Field>
          </div>
        </Section>

        {error && (
          <p className="text-red-400 text-sm mb-4 p-3 bg-red-400/10 rounded-lg border border-red-400/20">{error}</p>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || uploadLoading || (!form.oldResume.trim() && (!form.fullName.trim() || !form.email.trim()))}
          className={`${btnPrimary} w-full py-3 text-base`}
        >
          {loading ? 'Generating Resume…' : `Generate ${form.pages}-Page ATS-Friendly Resume for ${form.country}`}
        </button>
      </div>

      {/* ── Preview column ── */}
      <div className="lg:sticky lg:top-6 self-start max-h-[calc(100vh-120px)] flex flex-col">
        {generatedResume ? (
          <ResumePreview content={generatedResume} onCopy={copyResume} copied={copied} />
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-10 text-center h-64">
            <div className="text-5xl mb-3">📄</div>
            <p className="text-gray-400 text-sm">Fill in the form and click Generate</p>
            <p className="text-gray-500 text-xs mt-2">
              Formatted for {form.country} · {form.pages} page{form.pages > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Update Mode ───────────────────────────────────────────────────────────────

function UpdateMode() {
  const [existingResume, setExistingResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [pages, setPages] = useState(1);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [skillsReady, setSkillsReady] = useState(false);
  const [updatedResume, setUpdatedResume] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    setError('');
    setAnalyzeLoading(true);
    setSkillsReady(false);
    setExtractedSkills([]);
    setSelectedSkills(new Set());
    setUpdatedResume('');
    try {
      const { data } = await resumeApi.analyzeJobDescription(jobDescription);
      setExtractedSkills(data.skills);
      setSelectedSkills(new Set(data.skills)); // pre-select all
      setSkillsReady(true);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message ?? 'Failed to analyze job description. Please try again.');
    } finally {
      setAnalyzeLoading(false);
    }
  };

  const handleUpdate = async () => {
    setError('');
    setUpdateLoading(true);
    setUpdatedResume('');
    try {
      const { data } = await resumeApi.updateResume({
        existingResume,
        selectedSkills: Array.from(selectedSkills),
        jobDescription,
        pages,
      });
      setUpdatedResume(data.resume);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message ?? 'Failed to update resume. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const toggleSkill = (skill: string) =>
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      next.has(skill) ? next.delete(skill) : next.add(skill);
      return next;
    });

  const copyResume = () => {
    navigator.clipboard.writeText(updatedResume).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto px-6 py-6">
      {/* ── Left: inputs ── */}
      <div className="overflow-auto">

        {/* Step 1 */}
        <Section title="Step 1 — Upload or Paste Your Current Resume">
          <div className="flex items-center gap-2 mb-2">
            <label className={`${uploadLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${btnSecondary}`}>
              {uploadLoading ? 'Reading file…' : '📎 Upload Resume (.pdf, .docx, .txt, .md)'}
              <input
                type="file"
                accept=".txt,.md,.text,.docx,.pdf"
                className="hidden"
                disabled={uploadLoading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  e.target.value = '';
                  setUploadLoading(true);
                  setError('');
                  try {
                    const text = await extractTextFromFile(file);
                    setExistingResume(text);
                  } catch (err) {
                    setError(`Could not read file: ${(err as Error).message}`);
                  } finally {
                    setUploadLoading(false);
                  }
                }}
              />
            </label>
            {existingResume && (
              <button type="button" onClick={() => setExistingResume('')} className="text-xs text-red-400 hover:text-red-300">
                ✕ Clear
              </button>
            )}
            {existingResume && !uploadLoading && (
              <span className="text-xs text-green-400">✓ Resume loaded</span>
            )}
          </div>
          <textarea
            className={`${textareaCls} font-mono`}
            rows={10}
            value={existingResume}
            onChange={(e) => setExistingResume(e.target.value)}
            placeholder="…or paste your existing resume here (plain text or Markdown)"
          />
        </Section>

        {/* Step 2 */}
        <Section title="Step 2 — Paste the Job Description">
          <textarea
            className={textareaCls}
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here…"
          />
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzeLoading || !jobDescription.trim() || !existingResume.trim()}
            className={`${btnPrimary} mt-3 w-full`}
          >
            {analyzeLoading ? 'Analyzing Job Description…' : 'Analyze Job Description'}
          </button>
        </Section>

        {/* Step 3 — Skill checkboxes */}
        {skillsReady && (
          <Section title="Step 3 — Select Skills to Incorporate">
            <p className="text-xs text-gray-400 mb-3">
              AI extracted these skills from the job description. Select what to add to your resume.
            </p>
            <div className="flex gap-2 mb-3">
              <button type="button" onClick={() => setSelectedSkills(new Set(extractedSkills))} className={btnSecondary + ' text-xs'}>
                Select All
              </button>
              <button type="button" onClick={() => setSelectedSkills(new Set())} className={btnSecondary + ' text-xs'}>
                Deselect All
              </button>
              <span className="ml-auto text-xs text-gray-500 self-center">
                {selectedSkills.size} / {extractedSkills.length} selected
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-72 overflow-auto pr-1">
              {extractedSkills.map((skill) => (
                <label
                  key={skill}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-sm select-none ${
                    selectedSkills.has(skill)
                      ? 'bg-primary/10 border-primary/40 text-white'
                      : 'bg-gray-800/30 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSkills.has(skill)}
                    onChange={() => toggleSkill(skill)}
                    className="rounded accent-primary shrink-0"
                  />
                  <span className="truncate">{skill}</span>
                </label>
              ))}
            </div>
          </Section>
        )}

        {/* Step 4 — Pages + Generate */}
        {skillsReady && (
          <Section title="Step 4 — Resume Settings &amp; Generate">
            <Field label="Number of Pages">
              <PagePicker value={pages} onChange={setPages} />
            </Field>

            {error && (
              <p className="text-red-400 text-sm mt-3 p-3 bg-red-400/10 rounded-lg border border-red-400/20">{error}</p>
            )}

            <button
              type="button"
              onClick={handleUpdate}
              disabled={updateLoading || selectedSkills.size === 0}
              className={`${btnPrimary} mt-4 w-full py-3 text-base`}
            >
              {updateLoading
                ? 'Generating Updated Resume…'
                : `Generate ${pages}-Page Updated Resume (${selectedSkills.size} skills)`}
            </button>
          </Section>
        )}
      </div>

      {/* ── Right: preview ── */}
      <div className="lg:sticky lg:top-6 self-start max-h-[calc(100vh-120px)] flex flex-col">
        {updatedResume ? (
          <ResumePreview content={updatedResume} onCopy={copyResume} copied={copied} />
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-10 text-center h-64">
            <div className="text-5xl mb-3">✏️</div>
            <p className="text-gray-400 text-sm">Paste your resume and a job description, then select the skills you want to add.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ResumePage() {
  const [mode, setMode] = useState<'create' | 'update' | 'export'>('export');

  return (
    <div className="h-full flex flex-col">
      {/* Header / tab bar */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-700 bg-surface-light shrink-0">
        <h1 className="text-sm font-bold text-white mr-4">Resume Builder</h1>
        {(['export', 'create', 'update'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              mode === m ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {m === 'export' ? '🌍 Country Export' : m === 'create' ? '📄 Create Resume' : '✏️ Update by Job Description'}
          </button>
        ))}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-auto">
        {mode === 'export' ? <CountryExportMode /> : mode === 'create' ? <CreateMode /> : <UpdateMode />}
      </div>
    </div>
  );
}
