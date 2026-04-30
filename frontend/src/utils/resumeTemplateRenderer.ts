/**
 * Direct DOCX template renderer — mirrors generate_country_resumes.py exactly.
 * AI is only used to EXTRACT structured data; this file does all formatting.
 * No free-form Markdown involved — structured data → beautiful DOCX every time.
 */
import { Document, Packer, Paragraph, TextRun, BorderStyle, AlignmentType, TabStopType } from 'docx';

// ── Types (mirror Python dataclasses) ─────────────────────────────────────────

export interface WorkEntry {
  company: string;
  location: string;
  dates: string;
  title: string;
  formerTitle?: string;
  bullets: string[];
  industry?: string;
  companySize?: string;
}

export interface EduEntry {
  institution: string;
  degree: string;
  dates: string;
  location?: string;
}

export interface PatentEntry {
  title: string;
  year: string;
  description: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github?: string;
  website?: string;
  location: string;
  dob?: string;
  nationality?: string;
  summary: string;
  work: WorkEntry[];
  projects: WorkEntry[];
  education: EduEntry[];
  skills: Record<string, string>;
  patents: PatentEntry[];
  awards: string[];
  languages: Array<[string, string]>;
  certifications: string[];
}

// ── Colour palette (exact match to Python) ────────────────────────────────────
const NAVY = '1A3C6E';
const LINK = '0563C1';
const GRAY = '555555';
const BLACK = '000000';
const F = 'Calibri';

// ── Sizes in half-points (Python Pt(x) → x*2) ────────────────────────────────
const SZ_NAME    = 44;  // 22pt – name
const SZ_SECTION = 22;  // 11pt – section headings
const SZ_COMPANY = 21;  // 10.5pt – company header
const SZ_ROLE    = 20;  // 10pt – role title
const SZ_BODY    = 19;  // 9.5pt – body text / bullets / skills
const SZ_META    = 18;  // 9pt – meta (industry, company size)

// ── Twip helpers (Python Pt(n) → n*20 twips; Python Inches(n) → n*1440 twips) ─
const pt     = (n: number) => n * 20;
const inches = (n: number) => Math.round(n * 1440);

// ── Low-level paragraph builders ──────────────────────────────────────────────

function nameBlock(name: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: name.toUpperCase(), bold: true, font: F, size: SZ_NAME, color: NAVY })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: pt(2) },
  });
}

function centeredLine(
  text: string,
  opts: { size?: number; color?: string; bold?: boolean; italic?: boolean; after?: number } = {},
): Paragraph {
  return new Paragraph({
    children: [new TextRun({
      text, font: F,
      size: opts.size ?? SZ_BODY,
      color: opts.color ?? BLACK,
      bold: opts.bold,
      italics: opts.italic,
    })],
    alignment: AlignmentType.CENTER,
    spacing: { after: pt(opts.after ?? 0) },
  });
}

/**
 * Empty paragraph with navy bottom border = horizontal section separator line.
 * Mirrors Python's _heading_line().
 */
function sectionLine(spaceBefore = 8): Paragraph {
  return new Paragraph({
    children: [],
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: NAVY, space: 1 } },
    spacing: { before: pt(spaceBefore), after: 0 },
  });
}

/**
 * Section heading: [separator line, heading text] — mirrors Python's _section().
 */
function sec(text: string): Paragraph[] {
  return [
    sectionLine(),
    new Paragraph({
      children: [new TextRun({ text: text.toUpperCase(), bold: true, font: F, size: SZ_SECTION, color: NAVY })],
      spacing: { before: pt(1), after: pt(3) },
    }),
  ];
}

function bodyPara(
  text: string,
  opts: { bold?: boolean; italic?: boolean; color?: string; size?: number; before?: number; after?: number } = {},
): Paragraph {
  return new Paragraph({
    children: [new TextRun({
      text, font: F,
      size: opts.size ?? SZ_BODY,
      bold: opts.bold,
      italics: opts.italic,
      color: opts.color ?? BLACK,
    })],
    spacing: { before: pt(opts.before ?? 0), after: pt(opts.after ?? 2) },
  });
}

/** Bullet paragraph — mirrors Python's _bullet(). */
function bulletPara(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: '\u2022  ', font: F, size: SZ_BODY, color: NAVY }),
      new TextRun({ text, font: F, size: SZ_BODY }),
    ],
    indent: { left: inches(0.25), hanging: 0 },
    spacing: { before: 0, after: pt(1) },
  });
}

/** Skill line: **Category:** values — mirrors Python's _skill_line(). */
function skillLine(cat: string, val: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${cat}: `, bold: true, font: F, size: SZ_BODY }),
      new TextRun({ text: val, font: F, size: SZ_BODY }),
    ],
    spacing: { before: 0, after: 0 },
  });
}

/** Label: value line — mirrors Python's _info_line(). */
function infoLine(label: string, value: string, isLink = false): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, font: F, size: SZ_BODY }),
      new TextRun({ text: value, font: F, size: SZ_BODY, color: isLink ? LINK : BLACK }),
    ],
    spacing: { before: 0, after: 0 },
  });
}

/** Language: level line — mirrors Python's _languages_section(). */
function langLine(lang: string, level: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: `${lang}: `, bold: true, font: F, size: SZ_BODY }),
      new TextRun({ text: level, font: F, size: SZ_BODY }),
    ],
    spacing: { before: 0, after: 0 },
  });
}

/**
 * Company header block (1-3 paragraphs) — mirrors Python's _company() / _company_with_meta().
 *  Line 1: "Company | Location  |  Dates"  (bold, 10.5pt)
 *  Line 2: "Role Title  (formerly OldTitle)"  (italic, 10pt)
 *  Line 3 (optional): "Industry  |  Company Size"  (italic gray, 9pt)
 */
function companyBlock(
  nameWithLoc: string, dates: string,
  title?: string, formerTitle?: string, meta?: string,
): Paragraph[] {
  const out: Paragraph[] = [];

  out.push(new Paragraph({
    children: [new TextRun({ text: `${nameWithLoc}  |  ${dates}`, bold: true, font: F, size: SZ_COMPANY })],
    spacing: { before: pt(6), after: 0 },
  }));

  if (title) {
    const runs: TextRun[] = [new TextRun({ text: title, italics: true, font: F, size: SZ_ROLE })];
    if (formerTitle) {
      runs.push(new TextRun({ text: `  (formerly ${formerTitle})`, italics: true, font: F, size: SZ_ROLE, color: GRAY }));
    }
    out.push(new Paragraph({ children: runs, spacing: { before: pt(1), after: pt(1) } }));
  }

  if (meta) {
    out.push(new Paragraph({
      children: [new TextRun({ text: meta, italics: true, font: F, size: SZ_META, color: GRAY })],
      spacing: { before: 0, after: pt(1) },
    }));
  }

  return out;
}

/**
 * Education row: institution + right-aligned dates, then degree on next line.
 * Mirrors Python's _edu_row().
 */
function eduRow(institution: string, degree: string, dates: string, tabPos = inches(7.0)): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({ text: institution, bold: true, font: F, size: SZ_COMPANY }),
        new TextRun({ text: `\t${dates}`, font: F, size: SZ_BODY, color: GRAY }),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: tabPos }],
      spacing: { before: pt(2), after: 0 },
    }),
    new Paragraph({
      children: [new TextRun({ text: degree, font: F, size: SZ_BODY })],
      spacing: { before: 0, after: 0 },
    }),
  ];
}

/** Patent block — mirrors Python's _patent_block(). */
function patentBlock(pat: PatentEntry): Paragraph[] {
  return [
    new Paragraph({
      children: [
        new TextRun({ text: `Inventor \u2013 ${pat.title}  `, bold: true, font: F, size: SZ_ROLE }),
        new TextRun({ text: `(Filed & Completed, ${pat.year})`, font: F, size: SZ_BODY }),
      ],
      spacing: { before: 0, after: pt(1) },
    }),
    bulletPara(pat.description),
  ];
}

// ── Work / project section helpers ────────────────────────────────────────────

function workSection(entries: WorkEntry[], showMeta = false): Paragraph[] {
  const out: Paragraph[] = [];
  for (const e of entries) {
    const loc = e.location ? ` | ${e.location}` : '';
    const meta = showMeta && (e.industry || e.companySize)
      ? [e.industry, e.companySize].filter(Boolean).join('  |  ')
      : undefined;
    out.push(...companyBlock(`${e.company}${loc}`, e.dates, e.title, e.formerTitle, meta));
    for (const b of e.bullets) out.push(bulletPara(b));
  }
  return out;
}

function projectSection(entries: WorkEntry[]): Paragraph[] {
  const out: Paragraph[] = [];
  for (const e of entries) {
    // Projects: company as title, dates as subtitle (no location usually)
    out.push(...companyBlock(e.company, e.dates));
    for (const b of e.bullets) out.push(bulletPara(b));
  }
  return out;
}

// ── Document factory ──────────────────────────────────────────────────────────

function makeDoc(children: Paragraph[], leftMargin = 0.55, rightMargin = 0.55): Document {
  return new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },  // US Letter (matches python-docx default)
          margin: {
            top:    inches(0.5),
            bottom: inches(0.4),
            left:   inches(leftMargin),
            right:  inches(rightMargin),
          },
        },
      },
      children,
    }],
  });
}

// ── Country builders ──────────────────────────────────────────────────────────

function buildCanada(data: ResumeData): Document {
  const p: Paragraph[] = [];

  p.push(nameBlock(data.name));
  p.push(centeredLine(`${data.phone}  |  ${data.email}  |  ${data.location}`));
  if (data.linkedin) p.push(centeredLine(data.linkedin, { color: LINK }));
  p.push(centeredLine(
    'Open to Relocation to Canada  |  Willing to Obtain Canadian Work Permit / PR',
    { bold: true, color: NAVY, after: 2 },
  ));

  p.push(...sec('Professional Summary'));
  p.push(bodyPara(data.summary, { after: 3 }));

  p.push(...sec('Core Competencies'));
  for (const [c, v] of Object.entries(data.skills)) p.push(skillLine(c, v));

  p.push(...sec('Professional Experience'));
  p.push(...workSection(data.work));

  if (data.projects.length) {
    p.push(...sec('Personal Projects'));
    p.push(...projectSection(data.projects));
  }
  if (data.patents.length) {
    p.push(...sec('Innovation & Patent'));
    for (const pat of data.patents) p.push(...patentBlock(pat));
  }
  if (data.awards.length) {
    p.push(...sec('Honours & Awards'));
    for (const a of data.awards) p.push(bulletPara(a));
  }

  p.push(...sec('Education'));
  for (const e of data.education) {
    p.push(...eduRow(`${e.institution}${e.location ? `, ${e.location}` : ''}`, e.degree, e.dates));
  }

  p.push(...sec('Languages'));
  p.push(bodyPara(data.languages.map(([l, v]) => `${l} (${v})`).join('  |  '), { after: 0 }));

  return makeDoc(p);
}

function buildUK(data: ResumeData): Document {
  const p: Paragraph[] = [];

  p.push(nameBlock(data.name));
  p.push(centeredLine('Curriculum Vitae', { color: GRAY, size: SZ_SECTION, after: 4 }));
  p.push(centeredLine(`${data.phone}  |  ${data.email}  |  ${data.location}`));
  if (data.linkedin) p.push(centeredLine(data.linkedin, { color: LINK, after: 2 }));

  p.push(...sec('Personal Profile'));
  p.push(bodyPara(data.summary, { after: 3 }));

  p.push(...sec('Key Skills'));
  for (const [c, v] of Object.entries(data.skills)) p.push(skillLine(c, v));

  p.push(...sec('Career History'));
  p.push(...workSection(data.work));

  if (data.projects.length) {
    p.push(...sec('Personal Projects'));
    p.push(...projectSection(data.projects));
  }
  if (data.patents.length) {
    p.push(...sec('Innovation & Patent'));
    for (const pat of data.patents) p.push(...patentBlock(pat));
  }

  p.push(...sec('Education & Qualifications'));
  for (const e of data.education) {
    p.push(...eduRow(`${e.institution}${e.location ? `, ${e.location}` : ''}`, e.degree, e.dates, inches(6.4)));
  }

  p.push(...sec('Languages'));
  for (const [lang, level] of data.languages) p.push(langLine(lang, level));

  if (data.awards.length) {
    p.push(...sec('Distinctions & Awards'));
    for (const a of data.awards) p.push(bulletPara(a));
  }

  p.push(bodyPara('References available on request', { italic: true, color: GRAY, after: 0 }));

  return makeDoc(p, 0.6, 0.6);
}

function buildJapan(data: ResumeData): Document {
  const p: Paragraph[] = [];

  p.push(nameBlock(data.name));
  p.push(centeredLine('\u8077\u52d9\u7d4c\u6b74\u66f8  (Shokumu Keirekisho \u2013 Career Summary)', { color: GRAY, after: 4 }));

  p.push(...sec('Personal Details'));
  p.push(infoLine('Full Name', data.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')));
  if (data.dob) p.push(infoLine('Date of Birth', data.dob));
  if (data.nationality) p.push(infoLine('Nationality', data.nationality));
  p.push(infoLine('Current Location', data.location));
  p.push(infoLine('Visa Status', 'Willing to obtain Engineer / Specialist in Humanities / International Services visa'));
  p.push(infoLine('Email', data.email));
  p.push(infoLine('Phone', data.phone));
  if (data.linkedin) p.push(infoLine('LinkedIn', data.linkedin, true));

  p.push(...sec('Career Objective'));
  p.push(bodyPara(data.summary, { after: 3 }));

  p.push(...sec('Technical Skills  (\u6280\u8853\u30b9\u30ad\u30eb)'));
  for (const [c, v] of Object.entries(data.skills)) p.push(skillLine(c, v));

  p.push(...sec('Work Experience  (\u8077\u52d9\u7d4c\u6b74)'));
  p.push(...workSection(data.work, true));

  if (data.projects.length) {
    p.push(...sec('Personal Projects  (\u500b\u4eba\u30d7\u30ed\u30b8\u30a7\u30af\u30c8)'));
    p.push(...projectSection(data.projects));
  }
  if (data.patents.length) {
    p.push(...sec('Innovation & Patent  (\u7279\u8a31)'));
    for (const pat of data.patents) p.push(...patentBlock(pat));
  }

  p.push(...sec('Education  (\u5b66\u6b74)'));
  for (const e of data.education) {
    p.push(...eduRow(`${e.institution}${e.location ? `, ${e.location}` : ''}`, e.degree, e.dates, inches(6.2)));
  }

  p.push(...sec('Language Proficiency  (\u8a9e\u5b66\u529b)'));
  const japanLangs: Array<[string, string]> = [...data.languages, ['Japanese', 'Willing to learn']];
  for (const [lang, level] of japanLangs) p.push(langLine(lang, level));

  if (data.awards.length) {
    p.push(...sec('Honours & Awards  (\u8868\u5f70)'));
    for (const a of data.awards) p.push(bulletPara(a));
  }

  p.push(...sec('Self-PR  (\u81ea\u5df1PR)'));
  p.push(bodyPara(
    'I am a dedicated engineer who values quality, continuous learning, and team collaboration. ' +
    'I have consistently taken ownership of challenging projects, mentored team members, and proactively ' +
    'improved system reliability and security. I respect the importance of team harmony and am committed ' +
    'to adapting to and contributing to Japanese work culture. I am eager to bring my technical expertise ' +
    'and leadership to your organisation.',
    { after: 0 },
  ));

  return makeDoc(p, 0.6, 0.6);
}

function buildATS(data: ResumeData): Document {
  const p: Paragraph[] = [];

  p.push(nameBlock(data.name));
  p.push(centeredLine(`${data.phone}  |  ${data.email}  |  ${data.location}`));
  if (data.linkedin) p.push(centeredLine(data.linkedin, { color: LINK }));
  if (data.github)   p.push(centeredLine(data.github,   { color: LINK, after: 2 }));

  p.push(...sec('Professional Summary'));
  p.push(bodyPara(data.summary, { after: 3 }));

  p.push(...sec('Technical Skills'));
  for (const [c, v] of Object.entries(data.skills)) p.push(skillLine(c, v));

  p.push(...sec('Professional Experience'));
  p.push(...workSection(data.work));

  if (data.projects.length) {
    p.push(...sec('Personal Projects'));
    p.push(...projectSection(data.projects));
  }
  if (data.patents.length) {
    p.push(...sec('Innovation & Patent'));
    for (const pat of data.patents) p.push(...patentBlock(pat));
  }
  if (data.certifications.length) {
    p.push(...sec('Certifications'));
    for (const c of data.certifications) p.push(bulletPara(c));
  }

  p.push(...sec('Education'));
  for (const e of data.education) {
    p.push(...eduRow(`${e.institution}${e.location ? `, ${e.location}` : ''}`, e.degree, e.dates));
  }

  p.push(...sec('Languages'));
  for (const [lang, level] of data.languages) p.push(langLine(lang, level));

  if (data.awards.length) {
    p.push(...sec('Honours & Awards'));
    for (const a of data.awards) p.push(bulletPara(a));
  }

  return makeDoc(p);
}

// ── Public API ─────────────────────────────────────────────────────────────────

/** Coerce any value to string, returning fallback for null/undefined. */
function s(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : (v != null ? String(v) : fallback);
}
/** Coerce any value to an array. */
function a(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

/**
 * Normalise raw AI-returned data into our strict ResumeData schema.
 * Handles every common field-name variation the AI might use
 * (snake_case, camelCase, synonyms, partially-filled, nested objects, etc.)
 */
export function normalizeResumeData(raw: unknown): ResumeData {
  const r = raw as Record<string, unknown>;

  /* ── Flatten common nested wrappers the AI sometimes uses ── */
  // e.g. { personal_information: { name, email, ... }, ... }
  const personal = (
    r.personal_information ?? r.personal_info ?? r.contact_information ??
    r.contact_info ?? r.contact ?? r.personal ?? r.header ?? {}
  ) as Record<string, unknown>;

  /* ── name ── */
  const nameParts = `${s(r.first_name ?? r.firstName ?? personal.first_name ?? personal.firstName ?? '')} ${s(r.last_name ?? r.lastName ?? personal.last_name ?? personal.lastName ?? '')}`.trim();
  const name = s(
    r.name ?? r.full_name ?? r.fullName ?? r.candidate_name ?? r.candidate ??
    personal.name ?? personal.full_name ?? personal.fullName ?? nameParts,
  );

  /* ── contact ── */
  const email    = s(r.email ?? r.email_address ?? personal.email ?? personal.email_address);
  const phone    = s(r.phone ?? r.phone_number ?? r.mobile ?? r.contact_number ?? personal.phone ?? personal.phone_number ?? personal.mobile);
  const linkedin = s(r.linkedin ?? r.linkedIn ?? r.linkedin_url ?? r.linkedin_profile ?? personal.linkedin ?? personal.linkedIn ?? personal.linkedin_url);
  const github   = s(r.github ?? r.github_url ?? r.github_profile ?? personal.github ?? personal.github_url) || undefined;
  const website  = s(r.website ?? r.website_url ?? r.portfolio ?? r.personal_website ?? personal.website ?? personal.portfolio) || undefined;
  const location = s(
    r.location ?? r.address ?? r.city ?? r.current_location ?? r.residence ??
    personal.location ?? personal.address ?? personal.city ?? personal.current_location,
  );
  const dob      = s(r.dob ?? r.date_of_birth ?? r.birth_date ?? r.birthday ?? personal.dob ?? personal.date_of_birth) || undefined;
  const nationality = s(r.nationality ?? r.citizenship ?? personal.nationality ?? personal.citizenship) || undefined;

  /* ── summary ── */
  const summary = s(
    r.summary ?? r.professional_summary ?? r.profile ?? r.personal_profile ??
    r.objective ?? r.career_objective ?? r.about ?? r.bio ?? r.overview ??
    r.executive_summary ?? r.introduction,
  );

  /* ── work ── */
  const rawWork = a(
    r.work ?? r.work_experience ?? r.experience ?? r.employment ??
    r.professional_experience ?? r.career_history ?? r.employment_history,
  );
  const work: WorkEntry[] = rawWork.map((e) => {
    const we = e as Record<string, unknown>;
    const startDate = s(we.start_date ?? we.startDate ?? we.from ?? we.start ?? we.join_date ?? '');
    const endDate   = s(we.end_date ?? we.endDate ?? we.to ?? we.end ?? we.until ?? 'Present');
    const dates = s(
      we.dates ?? we.date_range ?? we.period ?? we.duration ?? we.employment_period ?? we.tenure ??
      (startDate ? `${startDate} – ${endDate}` : ''),
    );
    return {
      company:     s(we.company ?? we.employer ?? we.company_name ?? we.organization ?? we.employer_name ?? we.organisation),
      location:    s(we.location ?? we.city ?? we.place ?? we.office_location ?? ''),
      dates,
      title:       s(we.title ?? we.role ?? we.position ?? we.job_title ?? we.designation ?? we.role_title ?? we.position_title ?? we.occupation),
      formerTitle: s(we.formerTitle ?? we.former_title ?? we.previous_title ?? '') || undefined,
      bullets:     a(
        we.bullets ?? we.responsibilities ?? we.achievements ?? we.bullet_points ??
        we.duties ?? we.key_responsibilities ?? we.accomplishments ?? we.description ??
        we.key_achievements ?? we.contributions,
      ).map(b => s(b)).filter(Boolean),
      industry:    s(we.industry ?? we.sector ?? we.domain ?? '') || undefined,
      companySize: s(we.companySize ?? we.company_size ?? we.team_size ?? '') || undefined,
    };
  });

  /* ── projects ── */
  const rawProjects = a(r.projects ?? r.personal_projects ?? r.side_projects ?? r.project_experience ?? r.portfolio_projects);
  const projects: WorkEntry[] = rawProjects.map((e) => {
    const pe = e as Record<string, unknown>;
    const startDate = s(pe.start_date ?? pe.startDate ?? pe.from ?? pe.start ?? '');
    const endDate   = s(pe.end_date ?? pe.endDate ?? pe.to ?? pe.end ?? '');
    const dates = s(
      pe.dates ?? pe.date_range ?? pe.period ?? pe.year ??
      (startDate ? `${startDate} – ${endDate}`.replace(/\s*–\s*$/, '') : ''),
    );
    return {
      company:  s(pe.company ?? pe.name ?? pe.project_name ?? pe.title ?? pe.project),
      location: s(pe.location ?? ''),
      dates,
      title:    s(pe.title ?? pe.role ?? pe.subtitle ?? pe.tech_stack ?? pe.technologies ?? ''),
      bullets:  a(
        pe.bullets ?? pe.description ?? pe.achievements ?? pe.details ??
        pe.features ?? pe.highlights ?? pe.key_points,
      ).map(b => s(b)).filter(Boolean),
    };
  });

  /* ── education ── */
  const rawEdu = a(r.education ?? r.education_history ?? r.academic_background ?? r.qualifications ?? r.academic_qualifications);
  const education: EduEntry[] = rawEdu.map((e) => {
    const ed = e as Record<string, unknown>;
    const startYear = s(ed.start_year ?? ed.startYear ?? ed.from ?? ed.start ?? '');
    const endYear   = s(ed.end_year ?? ed.endYear ?? ed.graduation_year ?? ed.to ?? ed.end ?? ed.year ?? ed.completion_year ?? '');
    const dates = s(
      ed.dates ?? ed.date_range ?? ed.period ?? ed.year ?? ed.graduation ?? ed.years ??
      (startYear ? `${startYear} – ${endYear}`.trim() : endYear),
    );
    return {
      institution: s(ed.institution ?? ed.school ?? ed.university ?? ed.college ?? ed.name ?? ed.institute ?? ed.academy),
      degree:      s(ed.degree ?? ed.qualification ?? ed.program ?? ed.major ?? ed.field_of_study ?? ed.course ?? ed.programme ?? ed.study),
      dates,
      location:    s(ed.location ?? ed.city ?? ed.country ?? '') || undefined,
    };
  });

  /* ── skills — handle object, array-of-objects, and filter language keys ── */
  const LANG_KEY = /^(language|languages|language\s*skills|language\s*proficiency)$/i;
  let skills: Record<string, string> = {};
  const rawSkillsVal = r.skills ?? r.technical_skills ?? r.skill_categories ?? r.core_competencies ?? r.competencies ?? {};

  if (rawSkillsVal && typeof rawSkillsVal === 'object' && !Array.isArray(rawSkillsVal)) {
    // Standard object map { "Category": "skills..." }
    for (const [k, v] of Object.entries(rawSkillsVal as Record<string, unknown>)) {
      if (LANG_KEY.test(k.trim())) continue;
      skills[k] = Array.isArray(v) ? v.map(String).join(', ') : s(v);
    }
  } else if (Array.isArray(rawSkillsVal)) {
    // Array of { category, skills } objects
    for (const item of rawSkillsVal) {
      const si = item as Record<string, unknown>;
      const cat = s(si.category ?? si.name ?? si.type ?? si.group ?? '');
      if (!cat || LANG_KEY.test(cat)) continue;
      const val = si.skills ?? si.values ?? si.items ?? si.list ?? '';
      skills[cat] = Array.isArray(val) ? val.map(String).join(', ') : s(val);
    }
  }

  /* ── patents ── */
  const rawPatents = a(r.patents ?? r.patent ?? r.innovations ?? r.inventions ?? r.intellectual_property);
  const patents: PatentEntry[] = rawPatents.map((p) => {
    const pat = p as Record<string, unknown>;
    return {
      title:       s(pat.title ?? pat.patent_title ?? pat.name ?? pat.invention ?? pat.patent_name),
      year:        s(pat.year ?? pat.filing_year ?? pat.date ?? pat.filed ?? pat.filing_date ?? ''),
      description: s(pat.description ?? pat.summary ?? pat.details ?? pat.abstract ?? pat.overview ?? ''),
    };
  });

  /* ── awards ── */
  const awards = a(
    r.awards ?? r.honours ?? r.honors ?? r.recognitions ?? r.distinctions ??
    r.achievements ?? r.honors_and_awards,
  ).map(a2 => s(a2)).filter(Boolean);

  /* ── languages — handle tuples, objects, plain strings ── */
  const rawLangs = r.languages ?? r.language_skills ?? r.language_proficiency ?? r.spoken_languages;
  const languages: Array<[string, string]> = a(rawLangs).map((l) => {
    if (Array.isArray(l) && l.length >= 2) return [s(l[0]), s(l[1])] as [string, string];
    if (typeof l === 'object' && l != null) {
      const lo = l as Record<string, unknown>;
      const lang  = s(lo.language ?? lo.name ?? lo.lang ?? lo.tongue ?? Object.values(lo)[0]);
      const level = s(lo.proficiency ?? lo.level ?? lo.fluency ?? lo.proficiency_level ?? lo.competency ?? Object.values(lo)[1] ?? '');
      return [lang, level] as [string, string];
    }
    // plain string "English (Professional)" or "English: Professional" or "English - C1"
    const m = s(l).match(/^([^(:\-]+)[(:–\-]\s*([^)]*)\)?$/);
    return [m?.[1]?.trim() ?? s(l), m?.[2]?.trim() ?? ''] as [string, string];
  }).filter(([lang]) => lang.length > 0);

  /* ── certifications ── */
  const certifications = a(
    r.certifications ?? r.certificates ?? r.certifications_licenses ??
    r.professional_certifications ?? r.credentials,
  ).map(c => s(c)).filter(Boolean);

  return {
    name, email, phone, linkedin, github, website, location, dob, nationality,
    summary, work, projects, education, skills, patents, awards, languages, certifications,
  };
}

/**
 * Generate a country-specific DOCX from structured resume data.
 * Structure is 100% template-driven — no AI involvement in formatting.
 */
export async function generateCountryDocx(data: ResumeData, country: string): Promise<Blob> {
  const key = country.toLowerCase().replace(/[^a-z]/g, '');
  let doc: Document;
  if      (key === 'canada')                    doc = buildCanada(data);
  else if (key === 'unitedkingdom' || key === 'uk') doc = buildUK(data);
  else if (key === 'japan')                     doc = buildJapan(data);
  else                                          doc = buildATS(data);
  return Packer.toBlob(doc);
}
