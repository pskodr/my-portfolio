// Projects shown on the computer. Only real work goes here: no invented apps,
// users, metrics, or achievements. Leave a field undefined until it's written;
// layouts only render the fields that exist.

export type CaseStudySection =
  | "problem"
  | "audience"
  | "role"
  | "constraints"
  | "research"
  | "decisions"
  | "tradeoffs"
  | "solution"
  | "outcomes"
  | "learnings";

export const caseStudySectionTitles: Record<CaseStudySection, string> = {
  problem: "Problem",
  audience: "Audience",
  role: "My role",
  constraints: "Constraints",
  research: "Research",
  decisions: "Decisions",
  tradeoffs: "Trade-offs",
  solution: "Solution",
  outcomes: "Outcomes",
  learnings: "Learnings",
};

export type Metric = { value: string; label: string };

export type CaseStudy = {
  kind: "case-study";
  slug: string;
  title: string;
  org: string;
  period: string;
  summary: string;
  tags: string[];
  metrics?: Metric[];
  sections: Partial<Record<CaseStudySection, string | string[]>>;
};

export type AppStatus = "idea" | "in progress" | "beta" | "live";

export type AppEntry = {
  kind: "app";
  slug: string;
  title: string;
  summary: string;
  status: AppStatus;
  tags: string[];
  screenshots: { src: string; alt: string }[];
  demoUrl?: string;
  sourceUrl?: string;
  sections: Partial<Record<CaseStudySection, string | string[]>>;
};

export type Project = CaseStudy | AppEntry;

export const caseStudies: CaseStudy[] = [
  {
    kind: "case-study",
    slug: "agoda-voice-routing",
    title: "Guest-to-property routing for an AI voice agent",
    org: "Agoda (Booking Holdings)",
    period: "Jun–Aug 2026",
    summary:
      "Found three customer-experience gaps in Agoda's AI voice agent, picked the one worth building, shipped it end to end, and measured the result.",
    tags: ["AI voice", "Customer experience", "Internship"],
    metrics: [
      { value: "~72", label: "cases automated per day" },
      { value: "12–18", label: "agent-hours saved per day" },
      { value: "~$154K", label: "annualized savings" },
    ],
    sections: {
      role: "Technical Product Management Intern on the Customer Experience AI Voice Automation team. I owned the design, development, and delivery of the guest-to-property routing flow.",
      problem:
        "The AI voice agent didn't cover every flow in the customer-service SOPs. Auditing those flows against the agent's supported intents surfaced 3 CX feature gaps.",
      research: [
        "Sized demand for each gap with SQL.",
        "Gathered build-effort estimates for each option.",
      ],
      decisions: [
        "Prioritized guest-to-property routing using an effort-to-impact trade-off analysis.",
        "Translated user requirements into technical specs.",
      ],
      tradeoffs:
        "Scoped trade-offs with the engineering team before launch.",
      solution:
        "A guest-to-property routing flow for Agoda's AI voice agent.",
      outcomes: [
        "Validated with A/B tests and KPI dashboards.",
        "Automates ~72 cases a day, saving 12–18 agent-hours a day (~$154K annualized).",
        "Presented to the C-suite and adjacent-team PMs to inform the launch and phased rollout.",
      ],
    },
  },
];

// Apps the owner builds. None are shipped yet; add entries here as they exist.
export const apps: AppEntry[] = [];

// Future ideas, kept modest and clearly labeled. Add only ideas the owner has written up.
export const experiments: { title: string; note: string }[] = [];

export const allProjects: Project[] = [...caseStudies, ...apps];

export const getProject = (slug: string) => allProjects.find((p) => p.slug === slug);
