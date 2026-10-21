// Roles from the owner's résumé, copied without rounding or embellishment.
// The website omits some items that stay on the downloadable PDF.

import type { LogoId } from "./logos";

export type Role = {
  org: string;
  title: string;
  period: string;
  location?: string;
  logo?: LogoId; // see content/logos.ts
  points: string[];
};

// The caption under the Résumé heading.
export const resumeCaption = "Product Management | Consulting | Business Development";

export const professional: Role[] = [
  {
    org: "Agoda (Booking Holdings)",
    logo: "agoda",
    title: "Technical Product Management Intern, Customer Experience AI Voice Automation",
    period: "Jun–Aug 2026",
    location: "Bangkok",
    points: [
      "Audited SOP flows against the AI voice agent's supported intents to identify 3 CX feature gaps; prioritized guest-to-property routing via effort-to-impact trade-off analysis (SQL demand sizing, build-effort estimates).",
      "Owned end-to-end design, development, and delivery of the routing flow, translating user requirements into technical specs and scoping trade-offs with engineering before launch.",
      "Validated impact with A/B tests and KPI dashboards: ~72 cases/day automated, 12–18 agent-hours/day saved (~$154K annualized). Presented to the C-suite and adjacent-team PMs.",
    ],
  },
  {
    org: "Overture XL",
    logo: "overturexl",
    title: "GTM Strategy Analyst",
    period: "Aug–Dec 2025",
    location: "Atlanta",
    points: [
      "Product-market fit, competitive analysis, and white-label GTM strategy for a healthcare SaaS, sizing a $160M obtainable share within a $1.49B serviceable market.",
      "Presented market sizing, business-model trade-offs, and regulatory constraints to the CEO and CTO; co-authored the strategy report client leadership adopted.",
    ],
  },
  {
    org: "Accenture",
    logo: "accenture",
    title: "Technology Consulting Summer Analyst",
    period: "Jun–Aug 2025",
    location: "Bangkok",
    points: [
      "Designed UML system flows for a major Thai bank's debt write-off process during a mainframe migration.",
      "Authored 14 technical specs mapping 200+ fields across 8 staging tables.",
      "Built a Python validation script covering 30+ fields per file, eliminating 100+ hours of manual auditing a month.",
    ],
  },
  {
    org: "Animal Health Experts",
    logo: "animalhealthexperts",
    title: "AI Strategy Consultant",
    period: "Jan–Jun 2025",
    location: "Pittsburgh",
    points: [
      "Analyzed gaps across 7 operational areas for Humane Animal Rescue of Pittsburgh and proposed 3 low-CAPEX AI use cases projected to grow funding from $1.2M to $1.4M.",
      "Delivered an AI strategy and implementation roadmap with specific tool recommendations.",
    ],
  },
];

export const leadership: Role[] = [
  {
    org: "Carnegie Mellon University, Heinz College",
    logo: "cmu",
    title: "Teaching Assistant, Database Design & Development",
    period: "Aug 2026–present",
    points: [
      "Run weekly labs for 110+ students on SQL, MongoDB, PostgreSQL, and schema design; mentor projects built on Duolingo, Hopper, and Instacart cases.",
    ],
  },
  {
    org: "Undergraduate Consulting Club",
    logo: "ucc",
    title: "Senior Consultant",
    period: "Jan 2025–present",
    points: [
      "Lead a cross-functional team of 8 student consultants delivering data-driven recommendations to SME clients.",
    ],
  },
  { org: "Lambda Phi Epsilon", title: "Fundraising Lead", period: "", points: [] },
  { org: "Alpha Kappa Psi", title: "Marketing Lead", period: "", points: [] },
  { org: "Product Management Club", title: "Analyst", period: "", points: [] },
  { org: "Tepper Marketing Association", title: "Consultant", period: "", points: [] },
  { org: "Thai Student Association", title: "Events Lead", period: "", points: [] },
];

export const education = {
  school: "Carnegie Mellon University",
  colleges: "Heinz College & Tepper School of Business",
  logo: "cmu" as LogoId,
  degree:
    "B.S. Information Systems, additional major in Business Administration, minor in AI",
  period: "Expected May 2028",
  coursework: [
    "Database Design & Development",
    "Data Structures & Algorithms",
    "Software Engineering",
    "Machine Learning",
    "Regression Analysis",
    "Valuation & Financial Modeling",
  ],
};

export const awards = [
  "CMU Prod Hacks: 3rd of 300+ participants",
  "WICO Innovation Competition: Gold",
  "World Economic Cup: Bronze Continental Award",
];

// The owner's skills, grouped by what they are.
export const skills = [
  {
    group: "Product & Strategy",
    items: ["Roadmapping", "Market research", "UX research", "Competitive analysis", "KPIs", "OKRs", "Agile"],
  },
  { group: "Technical & Analytical", items: ["Systems design", "GenAI-assisted development", "Data analytics", "DCF modeling"] },
  { group: "Programming", items: ["Python", "JavaScript", "SQL", "R"] },
  { group: "Tools", items: ["PlantUML", "Superset", "Excel", "PowerPoint", "Confluence", "Claude Code"] },
];
