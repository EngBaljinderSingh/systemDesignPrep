package com.systemdesignprep.infrastructure.web;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.systemdesignprep.infrastructure.ai.LangChainAiAdapter;
import com.systemdesignprep.infrastructure.web.dto.AnalyzeJobDescriptionRequest;
import com.systemdesignprep.infrastructure.web.dto.CreateResumeRequest;
import com.systemdesignprep.infrastructure.web.dto.UpdateResumeRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/resume")
public class ResumeController {

    private static final Logger log = LoggerFactory.getLogger(ResumeController.class);

    private final LangChainAiAdapter ai;
    private final ObjectMapper objectMapper;

    public ResumeController(LangChainAiAdapter ai, ObjectMapper objectMapper) {
        this.ai = ai;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createResume(@Valid @RequestBody CreateResumeRequest req) {
        boolean hasOldResume = req.oldResume() != null && !req.oldResume().isBlank();
        if (!hasOldResume) {
            boolean missingName = req.fullName() == null || req.fullName().isBlank();
            boolean missingEmail = req.email() == null || req.email().isBlank();
            if (missingName || missingEmail) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Full name and email are required when not uploading an existing resume."));
            }
        }
        String prompt = buildCreateResumePrompt(req);
        String resume = ai.generateRawResponse(prompt);
        return ResponseEntity.ok(Map.of("resume", resume));
    }

    @PostMapping("/analyze-jd")
    public ResponseEntity<Map<String, Object>> analyzeJobDescription(
            @Valid @RequestBody AnalyzeJobDescriptionRequest req) {
        String prompt = buildAnalyzeJdPrompt(req.jobDescription());
        String response = ai.generateRawResponse(prompt);
        List<String> skills = parseSkillsList(response);
        return ResponseEntity.ok(Map.of("skills", skills));
    }

    @PostMapping("/update")
    public ResponseEntity<Map<String, String>> updateResume(@Valid @RequestBody UpdateResumeRequest req) {
        String prompt = buildUpdateResumePrompt(req);
        String resume = ai.generateRawResponse(prompt);
        return ResponseEntity.ok(Map.of("resume", resume));
    }

    // ── Prompt builders ──────────────────────────────────────────────────────

    private String buildCreateResumePrompt(CreateResumeRequest req) {
        String countryGuidance = getCountryGuidance(req.country());
        String workSection = formatWorkExperience(req.workExperience());
        String educationSection = formatEducation(req.education());
        String skillsSection = req.skills() != null ? String.join(", ", req.skills()) : "";
        String certSection = req.certifications() != null ? String.join(", ", req.certifications()) : "";
        String langSection = req.languages() != null ? String.join(", ", req.languages()) : "";

        boolean hasOldResume = req.oldResume() != null && !req.oldResume().isBlank();
        String baseInstruction = hasOldResume
                ? "Rewrite and significantly improve the provided existing resume"
                : "Create a professional, ATS-optimized resume";
        String oldResumeSection = hasOldResume
                ? """

                **Existing Resume (primary source of truth):**
                Use every piece of factual data below — company names, dates, role titles, technologies, \
                achievements, metrics. Do NOT invent or remove anything. Rewrite bullets to be strong and \
                metrics-driven. Preserve all real numbers (%%, x, ms, users, team size). Apply country \
                formatting conventions and the section structure required below.

                ```
                %s
                ```
                """.formatted(req.oldResume())
                : "";

        return """
                You are an expert resume writer who closely mirrors the output quality of a professional \
                DOCX resume generator. You have deep knowledge of hiring practices in %s.

                %s

                %s in Markdown format for the following candidate. Produce output that matches the \
                structure, tone, and density of a hand-crafted professional resume — NOT a generic AI \
                summary.

                **Candidate Information:**
                - Full Name: %s
                - Email: %s
                - Phone: %s
                - LinkedIn: %s
                - GitHub: %s
                - Website: %s
                - Summary/Objective: %s

                **Work Experience:**
                %s

                **Education:**
                %s

                **Skills:** %s

                **Certifications:** %s

                **Languages:** %s
                %s
                **Formatting Rules (follow exactly):**
                1. Line 1: `# CANDIDATE NAME` (uppercase, centred by convention)
                2. Line 2: contact info on one line — phone · email · location · LinkedIn
                3. `## PROFESSIONAL SUMMARY` (or country-equivalent heading) — 3-4 tight sentences
                4. `## CORE COMPETENCIES` or `## TECHNICAL SKILLS` — grouped as `**Category:** val1, val2`
                5. `## PROFESSIONAL EXPERIENCE` — each role as:
                   `### Company Name | Location`
                   `**Role Title** | Start – End`
                   bullet list with `- ` prefix, strong action verbs, quantified wins
                6. `## PERSONAL PROJECTS` if any
                7. `## INNOVATION & PATENTS` if any
                8. `## EDUCATION`
                9. `## LANGUAGES`
                10. `## HONOURS & AWARDS` if any
                11. Country-specific footer lines (visa status, GDPR notice, references) — see guidance

                **Quality Rules:**
                - Target %d page(s): calibrate bullet density accordingly (2-3 bullets per role for 1-page; 4-6 for 2-page)
                - Every bullet MUST start with a strong past-tense action verb (Architected, Led, Delivered, Reduced, Built)
                - Every bullet MUST contain at least one metric, percentage, or concrete outcome where the source data has one
                - Skills section: preserve ALL technologies from the source resume verbatim
                - Do NOT add fictional achievements, companies, or dates
                - Do NOT truncate real experience — keep all roles from the source
                - Use `**bold**` for company names and role titles; `*italic*` for dates/locations
                - No tables, no columns, no images, no HTML

                Output ONLY the resume Markdown. No preamble, no commentary, no explanations.
                """.formatted(
                req.country(), countryGuidance, baseInstruction,
                req.fullName(), req.email(),
                req.phone() != null ? req.phone() : "",
                req.linkedIn() != null ? req.linkedIn() : "",
                req.github() != null ? req.github() : "",
                req.website() != null ? req.website() : "",
                req.summary() != null ? req.summary() : "",
                workSection, educationSection,
                skillsSection, certSection, langSection,
                oldResumeSection, req.pages()
        );
    }

    private String buildAnalyzeJdPrompt(String jd) {
        return """
                Analyze the following job description and extract all technical skills, tools, frameworks, \
                methodologies, certifications, and domain keywords a candidate should highlight in their resume.

                Job Description:
                %s

                Return ONLY a JSON array of strings — no other text, no markdown code fences, no explanations.
                Example: ["Java", "Spring Boot", "Microservices", "AWS", "Docker", "Kubernetes", "REST APIs", "Agile"]

                Include:
                - Programming languages
                - Frameworks, libraries, and tools
                - Cloud platforms and DevOps tooling
                - Methodologies (Agile, Scrum, TDD, CI/CD, etc.)
                - Domain-specific keywords
                - Soft skills explicitly mentioned in the JD

                Return ONLY the JSON array.
                """.formatted(jd);
    }

    private String buildUpdateResumePrompt(UpdateResumeRequest req) {
        String skills = String.join(", ", req.selectedSkills());
        String jdContext = req.jobDescription() != null && !req.jobDescription().isBlank()
                ? "**Target Job Description:**\n" + req.jobDescription() + "\n\n"
                : "";

        return """
                You are an expert resume writer and ATS optimization specialist.

                %sUpdate the resume below to naturally incorporate these selected skills and keywords: %s

                **Current Resume:**
                %s

                **Instructions:**
                1. Generate a %d-page resume
                2. Weave the selected skills naturally into existing experience bullets, the skills section, \
                and the summary — do NOT just list them awkwardly
                3. Maintain the original structure and Markdown formatting
                4. Enhance existing bullets with the new skills only where contextually appropriate
                5. Add any skills not already present to the Skills section
                6. Preserve all original content — only enhance, never remove experience
                7. Use ATS-friendly formatting: standard headings, no tables or graphics
                8. Keep all additions authentic and professional

                Output ONLY the updated resume in Markdown. No explanations.
                """.formatted(jdContext, skills, req.existingResume(), req.pages());
    }

    // ── Country-specific ATS guidance ────────────────────────────────────────

    private String getCountryGuidance(String country) {
        return switch (country.toUpperCase().trim()) {
            case "UNITED STATES", "US", "USA" -> """
                    **US Resume Guidelines:**
                    - Do NOT include: photo, date of birth, marital status, nationality, or gender
                    - 1 page for <10 years experience; 2 pages for senior roles
                    - Start every bullet with a strong action verb (Led, Designed, Built, Optimized)
                    - Quantify all achievements (e.g., "reduced latency by 40%", "managed team of 8")
                    - Date format: Jan 2023
                    - No "Curriculum Vitae" label — candidate name at the top, large and bold""";
            case "UNITED KINGDOM", "UK", "GB" -> """
                    **UK CV Guidelines:**
                    - Called a CV, not a resume. Label the document "Curriculum Vitae" as a subtitle under the name.
                    - Do NOT include: photo, date of birth, or nationality
                    - 2 pages is the norm
                    - Section order: Personal Profile → Key Skills → Career History → Personal Projects → \
                    Education & Qualifications → Languages → Distinctions & Awards
                    - Personal Profile: 3–4 sentences, formal British English
                    - Use UK English spelling: organised, analysed, optimise, programme, colour
                    - Career History: company | dates on one bold line; role title italic below
                    - End the CV with a line: "References available on request"
                    - Date format: January 2023""";
            case "CANADA", "CA" -> """
                    **Canadian Resume Guidelines:**
                    - Do NOT include: photo, SIN number, date of birth, or marital status
                    - 1–2 pages; clean reverse-chronological format
                    - Include a badge / note line after contact info: \
                    "Open to Relocation to Canada | Willing to Obtain Canadian Work Permit / PR"
                    - Section order: Professional Summary → Core Competencies → Professional Experience → \
                    Personal Projects → Innovation & Patents → Honours & Awards → Education → Languages
                    - Professional Summary: 3-4 sentences, ATS-optimised, quantified wins
                    - Core Competencies: grouped skill lines (bold category: values)
                    - Professional Experience: company | location | dates bold; role title italic; bullets quantified
                    - Highlight bilingual skills (English/French) prominently if applicable
                    - Date format: Mar 2023 – Present""";
            case "JAPAN" -> """
                    **Japan Shokumu Keirekisho Guidelines:**
                    - Document subtitle: "職務経歴書  (Shokumu Keirekisho – Career Summary)"
                    - Include a Personal Details section: Full Name, Date of Birth, Nationality, \
                    Current Location, Visa Status ("Willing to obtain Engineer / Specialist in Humanities visa"), \
                    Email, Phone, LinkedIn
                    - Section headings use both English and Japanese: \
                    "Technical Skills (技術スキル)", "Work Experience (職務経歴)", \
                    "Personal Projects (個人プロジェクト)", "Innovation & Patent (特許)", \
                    "Education (学歴)", "Language Proficiency (語学力)", "Honours & Awards (表彰)"
                    - Section: "Career Objective" (not "Summary") — formal, kaizen-mindset tone
                    - Work Experience: show company industry and size (e.g., "Enterprise Information Management | 15,000+ employees")
                    - Add Japanese as a language: "Japanese – Willing to learn"
                    - End with a "Self-PR (自己PR)" section: emphasise team harmony (wa), quality mindset, \
                    long-term commitment, and eagerness to contribute to Japanese work culture
                    - Tone: formal, humble, team-oriented — avoid boastful language
                    - Date format: March 2023 – Present""";
            case "ATS" -> """
                    **Universal ATS-Optimized Resume Guidelines:**
                    - Clean, single-column layout — no tables, no columns, no graphics
                    - Section order: Professional Summary → Technical Skills → Professional Experience → \
                    Personal Projects → Patents → Certifications → Education → Languages → Awards
                    - Professional Summary: 3-4 sentences packed with high-value keywords
                    - Technical Skills: flat grouped list — bold category colon values, all technologies visible to ATS
                    - Every bullet starts with action verb, contains metric, avoids soft adjectives
                    - Include ALL technologies and tools from the source resume — keyword density matters
                    - Standard headings only (no fancy names) so parsers recognise them
                    - No abbreviations in section headings (spell out "Professional Experience", not "Exp.")
                    - Date format: Mar 2023 – Present""";
            case "AUSTRALIA", "AU" -> """
                    **Australian Resume Guidelines:**
                    - Do NOT include: photo (unless creative/media) or date of birth
                    - 2–3 pages typical
                    - Include a badge: "Open to Relocation to Australia | Willing to Obtain TSS / Skilled Worker Visa"
                    - Include a Key Skills or Core Competencies section near the top
                    - Australian English spelling
                    - Referees: state "References available on request"
                    - Date format: January 2023""";
            case "INDIA", "IN" -> """
                    **Indian Resume Guidelines:**
                    - 2–3 pages acceptable
                    - Career Objective section at the top is standard
                    - Can include: date of birth, gender, marital status, nationality
                    - Include academic percentages or CGPA prominently
                    - List all technical skills in a dedicated section
                    - Include languages known
                    - Date format: June 2016 – July 2020""";
            case "GERMANY", "DE" -> """
                    **German Lebenslauf Guidelines:**
                    - Include: date of birth, place of birth, nationality, marital status
                    - Strictly reverse-chronological order
                    - Date format: DD.MM.YYYY
                    - Precise, factual language — avoid marketing language
                    - Hobbies/Interests section (Hobbys) expected""";
            case "SINGAPORE", "SG" -> """
                    **Singapore Resume Guidelines:**
                    - Include nationality and work pass / PR status if relevant
                    - 2 pages standard
                    - Education grades/CAP important
                    - LinkedIn URL is appreciated""";
            case "UAE", "DUBAI" -> """
                    **UAE / Dubai Resume Guidelines:**
                    - Include nationality and visa/work permit status
                    - 2–3 pages acceptable
                    - Career Objective at the top
                    - Language proficiency prominently listed
                    - Arabic language skills highlighted as a significant asset""";
            default -> """
                    **General International Resume Guidelines:**
                    - Professional format with clearly labelled sections
                    - Reverse-chronological work history
                    - ATS-friendly: standard headings, no graphics or tables
                    - Quantify achievements where possible
                    - 1–2 pages for most roles""";
        };
    }

    // ── Formatters ────────────────────────────────────────────────────────────

    private String formatWorkExperience(List<CreateResumeRequest.WorkExperience> experiences) {
        if (experiences == null || experiences.isEmpty()) return "(none provided)";
        StringBuilder sb = new StringBuilder();
        for (CreateResumeRequest.WorkExperience exp : experiences) {
            sb.append("- ").append(exp.role()).append(" at ").append(exp.company());
            if (exp.location() != null && !exp.location().isBlank()) {
                sb.append(", ").append(exp.location());
            }
            String end = exp.current() ? "Present" : (exp.endDate() != null ? exp.endDate() : "");
            sb.append(" (").append(exp.startDate() != null ? exp.startDate() : "").append(" – ").append(end).append(")\n");
            if (exp.description() != null && !exp.description().isBlank()) {
                sb.append("  Achievements/Description: ").append(exp.description()).append("\n");
            }
        }
        return sb.toString();
    }

    private String formatEducation(List<CreateResumeRequest.EducationEntry> educationList) {
        if (educationList == null || educationList.isEmpty()) return "(none provided)";
        StringBuilder sb = new StringBuilder();
        for (CreateResumeRequest.EducationEntry edu : educationList) {
            sb.append("- ").append(edu.degree() != null ? edu.degree() : "").append(" in ")
              .append(edu.field() != null ? edu.field() : "")
              .append(" — ").append(edu.institution() != null ? edu.institution() : "");
            if (edu.location() != null && !edu.location().isBlank()) {
                sb.append(", ").append(edu.location());
            }
            sb.append(" (").append(edu.startDate() != null ? edu.startDate() : "").append(" – ")
              .append(edu.endDate() != null ? edu.endDate() : "").append(")");
            if (edu.gpa() != null && !edu.gpa().isBlank()) {
                sb.append(" | GPA: ").append(edu.gpa());
            }
            sb.append("\n");
        }
        return sb.toString();
    }

    private List<String> parseSkillsList(String response) {
        String trimmed = response.trim();
        int start = trimmed.indexOf('[');
        int end = trimmed.lastIndexOf(']');
        if (start != -1 && end > start) {
            try {
                return objectMapper.readValue(trimmed.substring(start, end + 1),
                        new TypeReference<List<String>>() {});
            } catch (Exception e) {
                log.warn("Failed to parse skills JSON array, falling back to line split: {}", e.getMessage());
            }
        }
        return Arrays.stream(trimmed.split("[,\n]+"))
                .map(s -> s.trim().replaceAll("^[\"\\-*•\\d.]+\\s*", "").replaceAll("\"$", "").trim())
                .filter(s -> !s.isBlank())
                .collect(Collectors.toList());
    }
}
