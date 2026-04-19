"""
Generate 3 country-specific resumes for Baljinder Singh:
  1. Canada  – ATS-optimized, Canadian hiring standards
  2. Europe  – Europass-inspired CV, EU hiring norms
  3. Japan   – Formal Shokumukeirekisho style, Japanese hiring culture
"""

from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os

OUTPUT_DIR = r"C:\Users\baljinders\Downloads\Resume"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- Colour palette ---
NAVY   = RGBColor(0x1A, 0x3C, 0x6E)
LINK   = RGBColor(0x05, 0x63, 0xC1)
GRAY   = RGBColor(0x55, 0x55, 0x55)
BLACK  = RGBColor(0x00, 0x00, 0x00)
DARK_RED = RGBColor(0x8B, 0x00, 0x00)

# ============================================================
#  Shared helpers
# ============================================================

def _margins(doc, top=0.5, bot=0.4, left=0.55, right=0.55):
    for s in doc.sections:
        s.top_margin = Inches(top)
        s.bottom_margin = Inches(bot)
        s.left_margin = Inches(left)
        s.right_margin = Inches(right)


def _heading_line(doc, color_hex="1A3C6E", space_before=8):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(0)
    pPr = p._p.get_or_add_pPr()
    pBdr = OxmlElement('w:pBdr')
    bottom = OxmlElement('w:bottom')
    bottom.set(qn('w:val'), 'single')
    bottom.set(qn('w:sz'), '4')
    bottom.set(qn('w:space'), '1')
    bottom.set(qn('w:color'), color_hex)
    pBdr.append(bottom)
    pPr.append(pBdr)


def _section(doc, text, color=NAVY, size=11, space_before=8, line_color="1A3C6E"):
    _heading_line(doc, color_hex=line_color, space_before=space_before)
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(3)
    r = p.add_run(text.upper())
    r.bold = True
    r.font.size = Pt(size)
    r.font.color.rgb = color
    r.font.name = 'Calibri'


def _bullet(doc, text, size=9.5, indent=0.25, after=1):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.left_indent = Inches(indent)
    p.paragraph_format.space_after = Pt(after)
    p.paragraph_format.space_before = Pt(0)
    r = p.add_run(text)
    r.font.size = Pt(size)
    r.font.name = 'Calibri'


def _text(doc, text, size=9.5, bold=False, italic=False, color=None, after=2, before=0, align=None):
    p = doc.add_paragraph()
    if align:
        p.alignment = align
    p.paragraph_format.space_before = Pt(before)
    p.paragraph_format.space_after = Pt(after)
    r = p.add_run(text)
    r.bold = bold
    r.italic = italic
    r.font.size = Pt(size)
    r.font.name = 'Calibri'
    if color:
        r.font.color.rgb = color
    return p


def _company(doc, name, dates, title=None, former_title=None):
    """Company | dates on one line, then optional title line with progression."""
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    p.paragraph_format.space_after = Pt(0)
    r1 = p.add_run(f"{name} | {dates}")
    r1.bold = True
    r1.font.size = Pt(10.5)
    r1.font.name = 'Calibri'
    
    # Add title with former_title if provided
    if title:
        p_title = doc.add_paragraph()
        p_title.paragraph_format.space_before = Pt(1)
        p_title.paragraph_format.space_after = Pt(1)
        r_title = p_title.add_run(title)
        r_title.italic = True
        r_title.font.size = Pt(10)
        r_title.font.name = 'Calibri'
        if former_title:
            r_former = p_title.add_run(f" (formerly {former_title})")
            r_former.italic = True
            r_former.font.size = Pt(10)
            r_former.font.name = 'Calibri'
            r_former.font.color.rgb = GRAY


def _role(doc, title, dates=""):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(1)
    ts = p.paragraph_format.tab_stops
    ts.add_tab_stop(Inches(7.0), WD_TAB_ALIGNMENT.RIGHT)
    r1 = p.add_run(title)
    r1.italic = True
    r1.font.size = Pt(10)
    r1.font.name = 'Calibri'
    if dates:
        r2 = p.add_run(f"\t{dates}")
        r2.font.size = Pt(9)
        r2.font.name = 'Calibri'
        r2.font.color.rgb = GRAY


def _skill_line(doc, cat, val, size=9.5):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.space_before = Pt(0)
    r1 = p.add_run(f"{cat}: ")
    r1.bold = True
    r1.font.size = Pt(size)
    r1.font.name = 'Calibri'
    r2 = p.add_run(val)
    r2.font.size = Pt(size)
    r2.font.name = 'Calibri'


# ============================================================
#  1.  CANADA  –  ATS-optimised, 2-page max
# ============================================================
def create_canada():
    doc = Document()
    _margins(doc)
    style = doc.styles['Normal']
    style.font.name = 'Calibri'
    style.font.size = Pt(10)
    style.paragraph_format.space_after = Pt(0)

    # --- Name ---
    h = doc.add_paragraph()
    h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    h.paragraph_format.space_after = Pt(2)
    r = h.add_run("BALJINDER SINGH")
    r.bold = True; r.font.size = Pt(22); r.font.color.rgb = NAVY; r.font.name = 'Calibri'

    # --- Contact ---
    c = doc.add_paragraph()
    c.alignment = WD_ALIGN_PARAGRAPH.CENTER
    c.paragraph_format.space_after = Pt(0)
    r = c.add_run("+91 98158 11510  |  baljindersinghcse@gmail.com  |  Bangalore, India")
    r.font.size = Pt(9.5); r.font.name = 'Calibri'

    c2 = doc.add_paragraph()
    c2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    c2.paragraph_format.space_after = Pt(0)
    r = c2.add_run("linkedin.com/in/baljinder-singh-013b4311b")
    r.font.size = Pt(9.5); r.font.name = 'Calibri'; r.font.color.rgb = LINK

    # Relocation / Work-auth line
    c3 = doc.add_paragraph()
    c3.alignment = WD_ALIGN_PARAGRAPH.CENTER
    c3.paragraph_format.space_after = Pt(2)
    r = c3.add_run("Open to Relocation to Canada  |  Willing to Obtain Canadian Work Permit / PR")
    r.bold = True; r.font.size = Pt(9.5); r.font.name = 'Calibri'; r.font.color.rgb = NAVY

    # --- Summary ---
    _section(doc, "Professional Summary")
    _text(doc,
        "Results-driven Lead Full Stack Software Engineer with 9+ years building and scaling enterprise SaaS platforms. "
        "Expert in Java 17/Spring Boot backends, Angular/React frontends, and cloud-native development (GCP, AWS, Kubernetes). "
        "Delivered 35% performance gains, eliminated 40% of critical vulnerabilities, and built AI-powered automation tools. "
        "Patent holder for an AI-driven autonomous UI testing framework. Eager to contribute to Canada\u2019s thriving tech ecosystem.", size=9.5, after=3)

    # --- Core Competencies (keyword-rich for Canadian ATS) ---
    _section(doc, "Core Competencies")
    _skill_line(doc, "Languages & Frameworks", "Java 17, Python, Spring Boot, FastAPI, Node.js, Hibernate, Angular, React, TypeScript, JavaScript, GraphQL, HTML5/CSS3")
    _skill_line(doc, "Cloud & DevOps", "AWS, Terraform, Google Cloud Platform (GCP), Kubernetes, Docker, Cloud Foundry, Okta, GitLab CI/CD, Jenkins, Maven, Git")
    _skill_line(doc, "Data & Messaging", "PostgreSQL, Oracle SQL, MySQL, Cassandra, XDB, DynamoDB, Redis, Kafka, RabbitMQ")
    _skill_line(doc, "Architecture", "Microservices, RESTful APIs, Saga Pattern, Event-Driven Design, Distributed Systems")
    _skill_line(doc, "Testing & Quality", "JUnit, Mockito, Karma, Integration Testing, E2E Testing, SonarQube")
    _skill_line(doc, "AI & Automation", "MCP Server/Client, Playwright, Ollama, Aviator (OpenText AI), Langchain, Langraph, LLM Orchestration")
    _skill_line(doc, "Security & Compliance", "Black Duck, Burp Suite, Fortify, PSMQ, OWASP Best Practices")
    _skill_line(doc, "Design & Methodology", "Figma (Design Reference), Agile/Scrum, Code Reviews, Architectural Decision Records, Mentoring")

    # --- Experience ---
    _section(doc, "Professional Experience")

    _company(doc, "OpenText | Bangalore, India", "Mar 2023 – Present", "Lead Software Engineer", "Senior Software Engineer")
    _bullet(doc, "Architected CC4E Chatbot (Electron + Spring Boot MCP + FastAPI); 100+ daily conversations; MCP protocol & Playwright automation.")
    _bullet(doc, "Led JATO V2→V3 migration: AngularJS to Angular 17/Spring Boot; 50% capacity increase; Cloud Foundry→GCP migration.")
    _bullet(doc, "100% PSMQ compliance; 40% vulnerability reduction; 35% performance improvement via Redis caching; mentored 6+ engineers.")

    _company(doc, "Oracle | Bangalore, India", "Jan 2022 – Feb 2023", "Senior Member of Technical Staff")
    _bullet(doc, "SAR & Journals modules for FCCS cloud platform; audit-compliant RESTful services for Fortune 500 clients; 85%+ code coverage.")

    _company(doc, "OpenText | Bangalore, India", "Jan 2020 – Jan 2022", "Senior Software Engineer")
    _bullet(doc, "V2 platform on Cloud Foundry (12 microservices, 99.9% uptime); Saga pattern; 200+ enterprise customers.")

    _company(doc, "LTIMindtree (formerly Mindtree) | Bangalore, India", "Jul 2016 – Jan 2020", "Senior Software Engineer", "Software Engineer")
    _bullet(doc, "Enterprise backend services (Java, Spring Boot); automated SLA dashboards and server health-checks; <4-hour production issue resolution.")

    # --- Personal Projects ---
    _section(doc, "Personal Projects")
    
    _company(doc, "AI-Powered System Design Interview Platform", "Full Stack (React 18 + Spring Boot 3.3.5)")
    _bullet(doc, "Full-stack: React 18 + Spring Boot 3.3.5 (Hexagonal Architecture) with LangChain4j, Ollama, Gemini API; WebSocket real-time sync & FSM interview flow.")
    _bullet(doc, "Tech stack: PostgreSQL + Flyway, Redis caching, Prometheus/Grafana observability, TailwindCSS, React Flow.")
    
    _company(doc, "Basalt: AI Chat + RAG Platform", "Full Stack (Java 21 + Spring Boot 3.2.5)")
    _bullet(doc, "Java 21 + Spring Boot 3.2.5 backend with Spring AI, streaming SSE; PDF RAG pipeline via pgvector + semantic chunking; Ollama & Pollinations.ai integration.")
    _bullet(doc, "Angular 17 frontend with ngx-markdown; Docker Compose deployment; full-stack AI chat with local LLM inference.")

    # --- Patent ---
    _section(doc, "Innovation & Patent")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(1)
    r = p.add_run("Inventor \u2013 Agentic AI-driven UI Testing Framework ")
    r.bold = True; r.font.size = Pt(10); r.font.name = 'Calibri'
    r2 = p.add_run("(Filed & Completed, 2025)")
    r2.font.size = Pt(9.5); r2.font.name = 'Calibri'
    _bullet(doc, "Designed an LLM-powered autonomous UI testing framework (MCP + Playwright), reducing manual testing by 70% and accelerating releases by 25%.")

    # --- Awards (condensed for 2-page fit) ---
    _section(doc, "Honours & Awards")
    _bullet(doc, "Recognition awards: Put Customers First (2026), Tackle Challenges Head On (2025), Be Deserving of Trust (2023) – leadership & collaborative contributions.")

    # --- Education ---
    _section(doc, "Education")
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2); p.paragraph_format.space_after = Pt(0)
    ts = p.paragraph_format.tab_stops
    ts.add_tab_stop(Inches(7.0), WD_TAB_ALIGNMENT.RIGHT)
    r = p.add_run("Chandigarh University"); r.bold = True; r.font.size = Pt(10); r.font.name = 'Calibri'
    r2 = p.add_run("\tJun 2012 \u2013 Jul 2016"); r2.font.size = Pt(9.5); r2.font.name = 'Calibri'; r2.font.color.rgb = GRAY
    _text(doc, "Bachelor of Engineering, Computer Science", size=9.5, after=0)

    # --- Languages ---
    _section(doc, "Languages")
    _text(doc, "English (Professional)  |  Hindi (Native)  |  Punjabi (Native)", size=9.5, after=0)

    path = os.path.join(OUTPUT_DIR, "Baljinder_Singh_Canada.docx")
    doc.save(path)
    print(f"[CANADA] {path}")


# ============================================================
#  2.  EUROPE  –  Europass-inspired CV
# ============================================================
def create_europe():
    doc = Document()
    _margins(doc, top=0.5, bot=0.4, left=0.6, right=0.6)
    style = doc.styles['Normal']
    style.font.name = 'Calibri'; style.font.size = Pt(10)
    style.paragraph_format.space_after = Pt(0)

    # --- Name ---
    h = doc.add_paragraph()
    h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    h.paragraph_format.space_after = Pt(2)
    r = h.add_run("BALJINDER SINGH")
    r.bold = True; r.font.size = Pt(22); r.font.color.rgb = NAVY; r.font.name = 'Calibri'

    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub.paragraph_format.space_after = Pt(4)
    r = sub.add_run("CURRICULUM VITAE")
    r.font.size = Pt(11); r.font.name = 'Calibri'; r.font.color.rgb = GRAY

    # --- Personal Information (EU standard) ---
    _section(doc, "Personal Information", line_color="1A3C6E")
    info = [
        ("Email", "baljindersinghcse@gmail.com"),
        ("Phone", "+91 98158 11510"),
        ("Location", "Bangalore, India \u2013 Open to relocation across Europe (EU Blue Card eligible)"),
        ("LinkedIn", "linkedin.com/in/baljinder-singh-013b4311b"),
        ("Nationality", "Indian"),
        ("Date of Birth", "20 March 1993"),
    ]
    for label, val in info:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(0); p.paragraph_format.space_before = Pt(0)
        r1 = p.add_run(f"{label}: "); r1.bold = True; r1.font.size = Pt(9.5); r1.font.name = 'Calibri'
        r2 = p.add_run(val); r2.font.size = Pt(9.5); r2.font.name = 'Calibri'
        if label == "LinkedIn":
            r2.font.color.rgb = LINK

    # --- Personal Profile ---
    _section(doc, "Personal Profile")
    _text(doc,
        "Lead Full Stack Software Engineer with over 9 years of experience in enterprise SaaS development, "
        "microservices architecture, and cloud-native platforms. Expert in Java 17/Spring Boot backends, "
        "Angular/React frontends, and GCP/AWS/Kubernetes ecosystems. Delivered measurable results: "
        "35% performance improvements, 40% vulnerability reduction, and AI-powered automation tools. "
        "Patent holder for an innovative AI-driven UI testing framework. "
        "Seeking to contribute to Europe\u2019s dynamic technology landscape.", size=9.5, after=3)

    # --- Key Skills & Competencies ---
    _section(doc, "Key Skills & Competencies")
    _skill_line(doc, "Programming", "Java 17, Python, TypeScript, JavaScript, SQL, FastAPI, Node.js, Shell Scripting")
    _skill_line(doc, "Frameworks", "Spring Boot, Hibernate, Angular, React, GraphQL, Bootstrap")
    _skill_line(doc, "Cloud & Infrastructure", "AWS, Terraform, Google Cloud Platform, Kubernetes, Docker, Cloud Foundry, Okta")
    _skill_line(doc, "DevOps & CI/CD", "GitLab CI/CD, Jenkins, Maven, Git, GitHub, GitLab")
    _skill_line(doc, "Databases", "PostgreSQL, Oracle SQL, MySQL, Cassandra, XDB, DynamoDB, Redis")
    _skill_line(doc, "Messaging & Integration", "Kafka, RabbitMQ, RESTful APIs, Microservices, Saga Pattern")
    _skill_line(doc, "Testing & Quality Assurance", "JUnit, Mockito, Karma, SonarQube, Integration & E2E Testing")
    _skill_line(doc, "AI & Automation", "MCP Server/Client, Playwright, Ollama, Aviator (OpenText AI), Langchain, Langraph, LLM Orchestration")
    _skill_line(doc, "Security", "Black Duck, Burp Suite, Fortify, PSMQ Compliance, OWASP")
    _skill_line(doc, "Design & Soft Skills", "Figma (Design Reference), Team Leadership, Mentoring, Cross-cultural Collaboration")

    # --- Work Experience ---
    _section(doc, "Work Experience")

    _company(doc, "OpenText | Bangalore, India", "March 2023 – Present", "Lead Software Engineer", "Senior Software Engineer")
    _bullet(doc, "Architected CC4E Chatbot (Electron + Spring Boot MCP + FastAPI); 100+ daily conversations; MCP protocol & Playwright automation.")
    _bullet(doc, "Led JATO V2→V3 migration: AngularJS to Angular 17/Spring Boot; 50% capacity increase; Cloud Foundry→GCP migration.")
    _bullet(doc, "100% PSMQ compliance; 40% vulnerability reduction; 35% performance improvement; mentored 6+ engineers.")

    _company(doc, "Oracle | Bangalore, India", "January 2022 – February 2023", "Senior Member of Technical Staff")
    _bullet(doc, "SAR & Journals modules for FCCS cloud platform; audit-compliant RESTful services for Fortune 500 clients; 85%+ code coverage.")

    _company(doc, "OpenText | Bangalore, India", "January 2020 – January 2022", "Senior Software Engineer")
    _bullet(doc, "V2 platform on Cloud Foundry (12 microservices, 99.9% uptime); Saga pattern; 200+ enterprise customers.")

    _company(doc, "LTIMindtree (formerly Mindtree) | Bangalore, India", "July 2016 – January 2020", "Senior Software Engineer", "Software Engineer")
    _bullet(doc, "Enterprise backend services (Java, Spring Boot); automated SLA dashboards and server health-checks; <4-hour production issue resolution.")

    # --- Personal Projects ---
    _section(doc, "Personal Projects")
    
    _company(doc, "AI-Powered System Design Interview Platform", "Full Stack (React 18 + Spring Boot 3.3.5)")
    _bullet(doc, "Full-stack: React 18 + Spring Boot 3.3.5 (Hexagonal Architecture) with LangChain4j, Ollama, Gemini API; WebSocket real-time sync & FSM interview flow.")
    _bullet(doc, "Tech stack: PostgreSQL + Flyway, Redis caching, Prometheus/Grafana observability, TailwindCSS, React Flow.")
    
    _company(doc, "Basalt: AI Chat + RAG Platform", "Full Stack (Java 21 + Spring Boot 3.2.5)")
    _bullet(doc, "Java 21 + Spring Boot 3.2.5 backend with Spring AI, streaming SSE; PDF RAG pipeline via pgvector + semantic chunking; Ollama & Pollinations.ai integration.")
    _bullet(doc, "Angular 17 frontend with ngx-markdown; Docker Compose deployment; full-stack AI chat with local LLM inference.")

    # --- Innovation & Patent ---
    _section(doc, "Innovation & Patent")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(1)
    r = p.add_run("Inventor \u2013 Agentic AI-driven UI Testing Framework "); r.bold = True; r.font.size = Pt(10); r.font.name = 'Calibri'
    r2 = p.add_run("(Filed & Completed, 2025)"); r2.font.size = Pt(9.5); r2.font.name = 'Calibri'
    _bullet(doc, "Designed an LLM-powered autonomous UI testing framework (MCP + Playwright), reducing manual testing by 70% and accelerating releases by 25%.")

    # --- Education ---
    _section(doc, "Education")
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2); p.paragraph_format.space_after = Pt(0)
    ts = p.paragraph_format.tab_stops; ts.add_tab_stop(Inches(6.4), WD_TAB_ALIGNMENT.RIGHT)
    r = p.add_run("Chandigarh University, India"); r.bold = True; r.font.size = Pt(10); r.font.name = 'Calibri'
    r2 = p.add_run("\tJune 2012 \u2013 July 2016"); r2.font.size = Pt(9.5); r2.font.name = 'Calibri'; r2.font.color.rgb = GRAY
    _text(doc, "Bachelor of Engineering in Computer Science", size=9.5, after=0)

    # --- Languages (critical for EU) ---
    _section(doc, "Languages")
    langs = [
        ("English", "Professional working proficiency (C1)"),
        ("Hindi", "Native proficiency"),
        ("Punjabi", "Native proficiency"),
    ]
    for lang, level in langs:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(0); p.paragraph_format.space_before = Pt(0)
        r1 = p.add_run(f"{lang}: "); r1.bold = True; r1.font.size = Pt(9.5); r1.font.name = 'Calibri'
        r2 = p.add_run(level); r2.font.size = Pt(9.5); r2.font.name = 'Calibri'

    # --- Honours & Awards ---
    _section(doc, "Honours & Awards")
    awards = [
        "Put Customers First (Feb 2026) \u2013 Resolved critical customer issues; led xPlore storage upgrade validation.",
        "Tackle Challenges Head On (Dec 2025) \u2013 Outstanding teamwork and collaborative contribution.",
        "Be Deserving of Trust (Oct 2023) \u2013 Resolved QatarGas escalation under pressure.",
        "Own the Outcome (Mar 2023) \u2013 3-year Supplier Exchange V1\u2192V2 migration; datacenter retirement & cost savings.",
        "Additional awards: Dec 2021, Mar 2021, Aug 2020 \u2013 Production support, proactive escalation resolution, code coverage.",
    ]
    for a in awards:
        _bullet(doc, a)

    # --- GDPR Note ---
    _text(doc, "", size=6, after=0)
    _text(doc,
        "I hereby authorise the processing of my personal data pursuant to the European General Data "
        "Protection Regulation (EU) 2016/679 and applicable local legislation.",
        size=8, italic=True, color=GRAY, after=0, before=4)

    path = os.path.join(OUTPUT_DIR, "Baljinder_Singh_Europe_CV.docx")
    doc.save(path)
    print(f"[EUROPE] {path}")


# ============================================================
#  3.  JAPAN  –  Shokumukeirekisho-style (English)
# ============================================================
def create_japan():
    doc = Document()
    _margins(doc, top=0.5, bot=0.4, left=0.6, right=0.6)
    style = doc.styles['Normal']
    style.font.name = 'Calibri'; style.font.size = Pt(10)
    style.paragraph_format.space_after = Pt(0)

    # --- Name ---
    h = doc.add_paragraph()
    h.alignment = WD_ALIGN_PARAGRAPH.CENTER
    h.paragraph_format.space_after = Pt(2)
    r = h.add_run("BALJINDER SINGH")
    r.bold = True; r.font.size = Pt(22); r.font.color.rgb = NAVY; r.font.name = 'Calibri'

    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub.paragraph_format.space_after = Pt(4)
    r = sub.add_run("\u8077\u52D9\u7D4C\u6B74\u66F8  (Shokumu Keirekisho \u2013 Career Summary)")
    r.font.size = Pt(10); r.font.name = 'Calibri'; r.font.color.rgb = GRAY

    # --- Personal Details (expected in Japan) ---
    _section(doc, "Personal Details", line_color="1A3C6E")
    details = [
        ("Full Name", "Baljinder Singh"),
        ("Date of Birth", "20 March 1993"),
        ("Nationality", "Indian"),
        ("Current Location", "Bangalore, India"),
        ("Visa Status", "Willing to obtain Engineer/Specialist in Humanities/International Services visa"),
        ("Email", "baljindersinghcse@gmail.com"),
        ("Phone", "+91 98158 11510"),
        ("LinkedIn", "linkedin.com/in/baljinder-singh-013b4311b"),
    ]
    for label, val in details:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(0); p.paragraph_format.space_before = Pt(0)
        r1 = p.add_run(f"{label}: "); r1.bold = True; r1.font.size = Pt(9.5); r1.font.name = 'Calibri'
        r2 = p.add_run(val); r2.font.size = Pt(9.5); r2.font.name = 'Calibri'
        if label == "LinkedIn":
            r2.font.color.rgb = LINK

    # --- Career Objective (valued in Japan) ---
    _section(doc, "Career Objective")
    _text(doc,
        "Lead Full Stack Software Engineer with 9+ years of experience in enterprise SaaS development, "
        "microservices architecture, and cloud-native platforms. Seeking to contribute strong expertise in "
        "Java 17, Spring Boot, Angular, React, and GCP/AWS to a forward-thinking organisation in Japan. "
        "Committed to continuous improvement (Kaizen), team harmony, and delivering high-quality, "
        "maintainable software. Eager to adapt to Japan\u2019s collaborative work culture.", size=9.5, after=3)

    # --- Technical Skills ---
    _section(doc, "Technical Skills (\u6280\u8853\u30B9\u30AD\u30EB)")
    _skill_line(doc, "Programming Languages", "Java 17, Python, TypeScript, JavaScript, SQL, FastAPI, Node.js, Shell Scripting")
    _skill_line(doc, "Frameworks & Libraries", "Spring Boot, Hibernate, Angular, React, GraphQL, Bootstrap, SCSS")
    _skill_line(doc, "Cloud & Infrastructure", "AWS, Terraform, Google Cloud Platform (GCP), Kubernetes, Docker, Cloud Foundry, Okta")
    _skill_line(doc, "CI/CD & DevOps", "GitLab CI/CD, Jenkins, Maven, Git, GitHub")
    _skill_line(doc, "Databases", "PostgreSQL, Oracle SQL, MySQL, Cassandra, XDB, DynamoDB, Redis")
    _skill_line(doc, "Messaging & Integration", "Kafka, RabbitMQ, Event-Driven Architecture, Distributed Systems")
    _skill_line(doc, "Testing", "JUnit, Mockito, Karma, Integration Testing, End-to-End Testing")
    _skill_line(doc, "AI & Automation", "MCP Server/Client, Playwright, Ollama, Aviator (OpenText AI), Langchain, Langraph, LLM Orchestration")
    _skill_line(doc, "Security Tools", "SonarQube, Black Duck, Burp Suite, Fortify, PSMQ Compliance")
    _skill_line(doc, "Design & Methodology", "Figma (Design Reference), Agile/Scrum, Code Reviews")

    # --- Work Experience (Chronological, detailed \u2013 Japanese style) ---
    _section(doc, "Work Experience (\u8077\u52D9\u7D4C\u6B74)")

    # OpenText (Current, 2nd stint)
    _company(doc, "OpenText Corporation | Bangalore, India", "March 2023 – Present", "Lead Software Engineer", "Senior Software Engineer")
    _text(doc, "Industry: Enterprise Information Management  |  Company Size: 15,000+ employees", size=9, italic=True, color=GRAY, after=1, before=0)
    _bullet(doc, "Architected CC4E Chatbot (Electron + Spring Boot MCP + FastAPI); 100+ daily conversations; MCP protocol & Playwright automation.")
    _bullet(doc, "Led JATO V2→V3 migration: AngularJS to Angular 17/Spring Boot; 50% capacity increase; Cloud Foundry→GCP migration.")
    _bullet(doc, "100% PSMQ compliance; 40% vulnerability reduction; 35% performance improvement; mentored 6+ engineers.")

    # Oracle
    _company(doc, "Oracle Corporation | Bangalore, India", "January 2022 – February 2023", "Senior Member of Technical Staff")
    _text(doc, "Industry: Enterprise Cloud Software  |  Company Size: 140,000+ employees", size=9, italic=True, color=GRAY, after=1, before=0)
    _bullet(doc, "SAR & Journals modules for FCCS cloud platform; audit-compliant RESTful services for Fortune 500 clients; 85%+ code coverage.")

    # OpenText (1st stint)
    _company(doc, "OpenText Corporation | Bangalore, India", "January 2020 – January 2022", "Senior Software Engineer")
    _text(doc, "Industry: Enterprise Information Management  |  Company Size: 15,000+ employees", size=9, italic=True, color=GRAY, after=1, before=0)
    _bullet(doc, "V2 platform on Cloud Foundry (12 microservices, 99.9% uptime); Saga pattern; 200+ enterprise customers.")

    # Mindtree
    _company(doc, "LTIMindtree (formerly Mindtree) | Bangalore, India", "July 2016 – January 2020", "Senior Software Engineer", "Software Engineer")
    _text(doc, "Industry: IT Services & Consulting  |  Company Size: 30,000+ employees", size=9, italic=True, color=GRAY, after=1, before=0)
    _bullet(doc, "Enterprise backend services (Java, Spring Boot); automated SLA dashboards and server health-checks; <4-hour production issue resolution.")

    # --- Personal Projects ---
    _section(doc, "Personal Projects (\u500B\u4EBA\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8)")
    
    _company(doc, "AI-Powered System Design Interview Platform", "Full Stack (React 18 + Spring Boot 3.3.5)")
    _bullet(doc, "Full-stack: React 18 + Spring Boot 3.3.5 (Hexagonal Architecture) with LangChain4j, Ollama, Gemini API; WebSocket real-time sync & FSM interview flow.")
    _bullet(doc, "Tech stack: PostgreSQL + Flyway, Redis caching, Prometheus/Grafana observability, TailwindCSS, React Flow.")
    
    _company(doc, "Basalt: AI Chat + RAG Platform", "Full Stack (Java 21 + Spring Boot 3.2.5)")
    _bullet(doc, "Java 21 + Spring Boot 3.2.5 backend with Spring AI, streaming SSE; PDF RAG pipeline via pgvector + semantic chunking; Ollama & Pollinations.ai integration.")
    _bullet(doc, "Angular 17 frontend with ngx-markdown; Docker Compose deployment; full-stack AI chat with local LLM inference.")

    # --- Innovation & Patent ---
    _section(doc, "Innovation & Patent (\u7279\u8A31)")
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(1)
    r = p.add_run("Inventor \u2013 Agentic AI-driven UI Testing Framework "); r.bold = True; r.font.size = Pt(10); r.font.name = 'Calibri'
    r2 = p.add_run("(Filed & Completed, 2025)"); r2.font.size = Pt(9.5); r2.font.name = 'Calibri'
    _bullet(doc, "Designed an LLM-powered autonomous UI testing framework (MCP + Playwright), reducing manual testing by 70% and accelerating releases by 25%.")

    # --- Education ---
    _section(doc, "Education (\u5B66\u6B74)")
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2); p.paragraph_format.space_after = Pt(0)
    ts = p.paragraph_format.tab_stops; ts.add_tab_stop(Inches(6.2), WD_TAB_ALIGNMENT.RIGHT)
    r = p.add_run("Chandigarh University, India"); r.bold = True; r.font.size = Pt(10); r.font.name = 'Calibri'
    r2 = p.add_run("\tJune 2012 \u2013 July 2016"); r2.font.size = Pt(9.5); r2.font.name = 'Calibri'; r2.font.color.rgb = GRAY
    _text(doc, "Bachelor of Engineering in Computer Science", size=9.5, after=0)

    # --- Language Proficiency (very important in Japan) ---
    _section(doc, "Language Proficiency (\u8A9E\u5B66\u529B)")
    langs = [
        ("English", "Business level (fluent) \u2013 Daily use in multinational teams"),
        ("Hindi", "Native"),
        ("Punjabi", "Native"),
        ("Japanese", "Willing to learn"),
    ]
    for lang, level in langs:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(0); p.paragraph_format.space_before = Pt(0)
        r1 = p.add_run(f"{lang}: "); r1.bold = True; r1.font.size = Pt(9.5); r1.font.name = 'Calibri'
        r2 = p.add_run(level); r2.font.size = Pt(9.5); r2.font.name = 'Calibri'

    # --- Honours & Awards ---
    _section(doc, "Honours & Awards (\u8868\u5F70)")
    awards = [
        "Put Customers First (Feb 2026) \u2013 Resolved critical customer issues; led xPlore storage upgrade validation.",
        "Tackle Challenges Head On (Dec 2025) \u2013 Outstanding teamwork and collaborative contribution.",
        "Be Deserving of Trust (Oct 2023) \u2013 Resolved QatarGas escalation under pressure.",
        "Own the Outcome (Mar 2023) \u2013 Led 3-year Supplier Exchange V1\u2192V2 platform migration.",
        "Additional awards in 2021 and 2020 for production support and code quality improvement.",
    ]
    for a in awards:
        _bullet(doc, a)

    # --- Self-PR (unique to Japan) ---
    _section(doc, "Self-PR (\u81EA\u5DF1PR)")
    _text(doc,
        "I am a dedicated engineer who values quality, continuous learning, and team collaboration. "
        "Throughout my career, I have consistently taken ownership of challenging projects, mentored "
        "team members, and proactively improved system reliability and security. I believe in the "
        "importance of harmony within teams and am committed to adapting to and respecting Japanese "
        "work culture. I am eager to bring my technical expertise and leadership experience to contribute "
        "to your organisation\u2019s success.",
        size=9.5, after=0)

    path = os.path.join(OUTPUT_DIR, "Baljinder_Singh_Japan.docx")
    doc.save(path)
    print(f"[JAPAN]  {path}")


# ============================================================
#  Run all
# ============================================================
if __name__ == "__main__":
    create_canada()
    create_europe()
    create_japan()
    print("\nAll 3 country-specific resumes generated successfully!")
