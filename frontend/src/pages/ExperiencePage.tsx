interface Bullet {
  text: string;
}

interface Role {
  company: string;
  period: string;
  title: string;
  formerTitle?: string;
  accentColor: string;
  borderColor: string;
  gradientFrom: string;
  bullets: Bullet[];
}

const roles: Role[] = [
  {
    company: 'OpenText',
    period: 'Jan 2020 – Present',
    title: 'Lead Software Engineer',
    formerTitle: 'formerly Senior Software Engineer',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-600/30',
    gradientFrom: 'from-blue-600/10',
    bullets: [
      {
        text: 'Architected and scaled the JATO UI framework (Angular/React) and backend REST APIs, supporting 50% higher concurrent user loads and reducing API latency by 20%.',
      },
      {
        text: 'Led the platform migration from Cloud Foundry to Google Cloud Platform (GCP), significantly enhancing infrastructure scalability and reliability for Version 3.',
      },
      {
        text: 'Implemented AI-driven automation by building an MCP server (Playwright) and NLP-to-automation client (Python), reducing manual QA effort by 30% and accelerating task execution by 25%.',
      },
      {
        text: 'Spearheaded security compliance by achieving 100% PSMQ compliance across 12 microservices and reducing critical vulnerabilities by 40% using SonarQube, Black Duck, and Fortify.',
      },
      {
        text: 'Mentored 6+ junior engineers through pair programming and standardized code reviews, halving onboarding time and improving overall team code quality by 15%.',
      },
      {
        text: 'Engineered core SaaS capabilities using Java 17, Spring Boot, and GraphQL for 200+ enterprise clients, including implementing the Saga pattern for distributed data consistency.',
      },
      {
        text: 'Optimized system performance via strategic Redis caching and legacy monolith refactoring, and automated end-to-end CI/CD pipelines (GitLab) to improve deployment frequency and reliability.',
      },
    ],
  },
  {
    company: 'LTIMindtree',
    period: 'Jul 2016 – Jan 2020',
    title: 'Senior Software Engineer',
    formerTitle: 'formerly Software Engineer',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-600/30',
    gradientFrom: 'from-emerald-600/10',
    bullets: [
      {
        text: 'Led Agile enhancements as the primary technical point of contact (PoC) for critical cyber and broker data applications, driving feature delivery and team velocity.',
      },
      {
        text: 'Engineered automated monitoring solutions (Java, Shell) for a Fortune 50 client, reducing manual health-check effort by 50% and improving incident response times by 30%.',
      },
      {
        text: 'Developed robust Java backend services and managed high-stakes on-call production support, consistently achieving sub-4-hour resolution times for critical incidents.',
      },
      {
        text: 'Optimized system observability by automating SLA tracking and real-time health dashboards, providing actionable insights for infrastructure management and uptime.',
      },
    ],
  },
];

/** Bolds numbers + percentages + quoted tech terms inline */
function BulletText({ text }: { text: string }) {
  // Split on patterns like "50%", "30%", "6+", "200+", "12", "4-hour", tech names in parens, etc.
  const parts = text.split(/(\d[\d,+\-]*(?:%| microservices| engineers| clients| hours?)?\b)/g);
  return (
    <span>
      {parts.map((part, i) =>
        /^\d/.test(part) ? (
          <span key={i} className="text-white font-semibold">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  );
}

export default function ExperiencePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Experience</h1>
        <p className="text-gray-400 text-base">
          Professional background in full-stack engineering, cloud platforms, and distributed systems.
        </p>
      </div>

      <div className="space-y-8">
        {roles.map((role) => (
          <div
            key={role.company}
            className={`rounded-xl border ${role.borderColor} bg-gradient-to-br ${role.gradientFrom} to-transparent p-6`}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-4">
              <div>
                <h2 className={`text-xl font-bold ${role.accentColor}`}>{role.company}</h2>
                <p className="text-white font-semibold text-base mt-0.5">
                  {role.title}{' '}
                  {role.formerTitle && (
                    <span className="text-gray-400 font-normal text-sm">({role.formerTitle})</span>
                  )}
                </p>
              </div>
              <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full whitespace-nowrap self-start sm:mt-1">
                {role.period}
              </span>
            </div>

            {/* Bullets */}
            <ul className="space-y-2.5">
              {role.bullets.map((bullet, idx) => (
                <li key={idx} className="flex gap-2.5 text-sm text-gray-300 leading-relaxed">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${role.accentColor.replace('text-', 'bg-')}`} />
                  <BulletText text={bullet.text} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
