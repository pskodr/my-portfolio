// Projects shown on the monitor: PM case studies, content projects and apps.
// Only real work goes here: no invented apps, users, metrics or results.
// Leave a field out until it's written; pages only render what exists.
//
// To add one: copy an entry, give it a new `slug`, and fill in what you have.
// Order here is the order on the page. `hidden: true` keeps it off the site.

import { showDrafts } from "./site";

export type ProjectKind = "case-study" | "content" | "app";
export type ProjectStatus = "shipped" | "in progress" | "planned";

export type Section =
  | "audience"
  | "problem"
  | "role"
  | "collaborators"
  | "constraints"
  | "research"
  | "decisions"
  | "tradeoffs"
  | "solution"
  | "outcomes"
  | "learnings"
  | "next";

export const sectionTitles: Record<Section, string> = {
  audience: "Audience",
  problem: "Problem",
  role: "My role",
  collaborators: "Collaborators",
  constraints: "Constraints",
  research: "Research & evidence",
  decisions: "Key decisions",
  tradeoffs: "Trade-offs",
  solution: "Solution",
  outcomes: "Outcomes & feedback",
  learnings: "What I learned",
  next: "Next steps",
};

export type Project = {
  slug: string;
  kind: ProjectKind;
  title: string;
  summary: string;
  status: ProjectStatus;
  org?: string;
  timeline?: string;
  tags: string[];
  sections: Partial<Record<Section, string | string[]>>;
  media: string[]; // ids from content/media.ts
  links: { label: string; href: string }[]; // demo, source, write-up
  sample?: boolean; // layout demo only; never shown when drafts are off
  hidden?: boolean;
};

export const kindLabels: Record<ProjectKind, string> = {
  "case-study": "PM case study",
  content: "Content project",
  app: "App",
};

const entries: Project[] = [
  {
    slug: "agoda-voice-routing",
    kind: "case-study",
    title: "Guest-to-property routing for an AI voice agent",
    summary:
      "Found three customer-experience gaps in Agoda's AI voice agent, picked the one worth building, shipped it end to end, and measured the result.",
    status: "shipped",
    org: "Agoda (Booking Holdings)",
    timeline: "Jun–Aug 2026",
    tags: ["AI voice", "Customer experience", "Internship"],
    sections: {
      role: "Technical Product Management Intern on the Customer Experience AI Voice Automation team. I owned the design, development, and delivery of the guest-to-property routing flow.",
      problem:
        "The AI voice agent didn't cover every flow in the customer-service SOPs. Auditing those flows against the agent's supported intents surfaced 3 CX feature gaps.",
      research: ["Sized demand for each gap with SQL.", "Gathered build-effort estimates for each option."],
      decisions: [
        "Prioritized guest-to-property routing using an effort-to-impact trade-off analysis.",
        "Translated user requirements into technical specs.",
      ],
      tradeoffs: "Scoped trade-offs with the engineering team before launch.",
      solution: "A guest-to-property routing flow for Agoda's AI voice agent.",
      outcomes: [
        "Validated with A/B tests and KPI dashboards.",
        "Automates ~72 cases a day, saving 12–18 agent-hours a day (~$154K annualized).",
        "Presented to the C-suite and adjacent-team PMs to inform the launch and phased rollout.",
      ],
    },
    media: [],
    links: [],
  },
  {
    slug: "sample-project",
    kind: "app",
    sample: true,
    title: "Sample project",
    summary:
      "A placeholder that shows how a project page is laid out. It isn't real work and disappears when drafts are turned off.",
    status: "planned",
    timeline: "Timeline goes here",
    tags: ["Sample"],
    sections: {
      audience: "Who the product is for.",
      problem: "The problem, in the user's words where possible.",
      role: "What I owned, and who I worked with.",
      decisions: ["A decision and the reason for it.", "Another decision, with the alternative I passed on."],
      outcomes: "Real outcomes or feedback only, once they exist.",
      next: "What I'd do next.",
    },
    media: [],
    links: [],
  },
];

export const projects = entries.filter((p) => !p.hidden && (showDrafts || !p.sample));

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
