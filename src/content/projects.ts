// Projects shown on the monitor: PM case studies, content projects and apps.
// Only real work goes here: no invented apps, users, metrics or results.
// Leave a field out until it's written; pages only render what exists.
//
// To add one: copy an entry, give it a new `slug`, and fill in what you have.
// Order here is the order on the page. `hidden: true` keeps it off the site.

import type { LogoId } from "./logos";
import { showDrafts } from "./site";

export type ProjectKind = "case-study" | "content" | "app";
export type ProjectStatus = "shipped" | "ab-test" | "in progress" | "planned";

export const statusLabels: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  "ab-test": "In production A/B test",
  "in progress": "In progress",
  planned: "Planned",
};

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

// A written-up case study: an ordered list of sections, each made of blocks.
export type Block =
  | { type: "p"; text: string }
  | { type: "bullets"; items: string[] }
  // A short boxed note, e.g. where my work ends and existing systems begin.
  | { type: "note"; label: string; text: string }
  | { type: "quote"; text: string; caption: string }
  // Two or more options side by side; `chosen` marks the one taken.
  | { type: "compare"; options: { title: string; when: string; evidence: string; chosen?: boolean }[] }
  | { type: "flow"; flow: Flow }
  // Columns such as delivered / estimated / not yet known.
  | { type: "columns"; columns: { title: string; items: string[] }[] }
  // Clearly labelled suggestions that are not existing work or metrics.
  | { type: "proposed"; label: string; items: string[] };

// A deliberately high-level before/after flow. Each step can be marked as
// logic I implemented ("mine") or functionality that already existed.
export type Flow = {
  label: string;
  lanes: { title: string; steps: { text: string; owner?: "mine" | "existing" }[] }[];
  legend: { mine: string; existing: string };
};

export type CaseStudy = {
  intro: string;
  role: string;
  // Projections, shown apart from facts with their assumptions beneath.
  // `unit` is set smaller beside the value (e.g. "hrs").
  projected?: { title: string; badge: string; figures: { value: string; unit?: string; label: string }[]; note: string };
  sections: { id: string; title: string; blocks: Block[] }[];
};

export type Project = {
  slug: string;
  kind: ProjectKind;
  title: string;
  summary: string;
  status: ProjectStatus;
  org?: string;
  logo?: LogoId; // see content/logos.ts
  timeline?: string;
  tags: string[];
  caseStudy?: CaseStudy; // the structured write-up; older entries use `sections`
  sections: Partial<Record<Section, string | string[]>>;
  media: string[]; // ids from content/media.ts
  links: { label: string; href: string }[]; // demo, source, write-up
  sample?: boolean; // layout demo only; never shown when drafts are off
  hidden?: boolean;
};

// The Projects page groups entries by kind, in this order. Empty groups are
// not shown.
export const kindLabels: Record<ProjectKind, string> = {
  "case-study": "Product Case Studies",
  app: "Apps & Builds",
  content: "Content & Campaigns",
};

const entries: Project[] = [
  {
    // Facts verified by the owner (2026-10-22). The projected figures are
    // internal estimates awaiting the owner's disclosure review.
    slug: "agoda-voice-routing",
    kind: "case-study",
    title: "Connecting guests directly to properties through Agoda’s AI voice agent",
    summary:
      "Restored a direct property contact option during Agoda’s transition from IVR to voice AI customer service channel, eliminating the need for intermediary support from human agents.",
    status: "ab-test",
    org: "Agoda (Booking Holdings)",
    logo: "agoda",
    timeline: "Jun–Aug 2026",
    tags: ["Product Management", "AI Voice", "Production Experiment"],
    caseStudy: {
      intro:
        "During my Agoda internship, I restored a direct property contact customer experience option that was missing after the move from IVR to conversational voice AI. I reviewed standard operating procedure (SOP) flows, sized demand, compared two implementation approaches, prioritized one, and encoded the JavaScript flow logic before testing it in pre-production and a production A/B test.",
      role: "Technical Product Management Intern",
      projected: {
        title: "Projected impact",
        badge: "Demand-sizing estimates",
        figures: [
          { value: "~72", label: "Eligible cases per day" },
          { value: "12–18", unit: "hrs", label: "Potential daily agent capacity saved" },
          { value: "~$154K", label: "Potential annualized savings" },
        ],
        note: "Projected from demand sizing using internal handling-time and cost assumptions. Actual impact is being evaluated in a production A/B test.",
      },
      sections: [
        {
          id: "missing",
          title: "The missing connection",
          blocks: [
            {
              type: "p",
              text: "Some guests call Agoda about something only their property can help with. A guest might want an extra bed, for example, which can’t be added through the booking platform post-booking. Other calls are property-information questions that neither the AI voice agent nor Agoda’s human support agents can directly answer.",
            },
            {
              type: "p",
              text: "Agoda’s old IVR phone system had a direct route for this: “press 9 to talk to the property.” When Agoda moved to an AI conversational voice agent, launched in Q4 2025, the conversational experience had no equivalent option.",
            },
            {
              type: "p",
              text: "So when the AI couldn’t resolve this type of request, it escalated the call to an Agoda human agent. The agent would spend 10–15 minutes referencing SOPs and attempting to handle the customer request, before eventually redirecting the guest to the property or telling them to contact it. The opportunity was to remove that costly human-agent step by letting guests reach the property directly: a feature called connect-to-property (CTP).",
            },
          ],
        },
        {
          id: "ownership",
          title: "My role & responsibilities",
          blocks: [
            {
              type: "bullets",
              items: [
                "Reviewed and audited the customer-service SOPs.",
                "Sized demand and eligible call volume with SQL.",
                "Ideated solutions and compared two ways to offer the connection.",
                "Encoded the conversational flow logic through an in-house JavaScript-based editor.",
                "Ran simulations and evaluations, then pre-production testing.",
                "Ran production A/B test with 10% of calls offered CTP to test its impact on key metrics (Average Handle Time, Customer DSAT Score, Case Automation Rate).",
              ],
            },
            {
              type: "note",
              label: "Where my work ends",
              text: "The functionality to physically transfer a phone call to a new line already existed; I handled the conversational flow logic and encoding that offers the connection and sends the guest to that existing transfer based on customer responses.",
            },
          ],
        },
        {
          id: "decision",
          title: "Choosing when to offer the connection",
          blocks: [
            {
              type: "p",
              text: "I compared two approaches. The choice came down to discoverability, potential usage, and user experience consistency.",
            },
            {
              type: "compare",
              options: [
                {
                  title: "A. Contextual offer",
                  when: "Offer the connection only after a guest asks for a special request or property information the AI can’t answer.",
                  evidence: "Sizing indicated lower eligible volume for this trigger, due to supply mismatch (customers not knowing the option exists).",
                },
                {
                  title: "B. Upfront offer",
                  when: "Offer the connection proactively at the beginning of the call.",
                  evidence:
                    "Historical IVR usage supported strong demand for a more discoverable option, and it keeps user experience consistent with the old IVR system.",
                  chosen: true,
                },
              ],
            },
            {
              type: "p",
              text: "Aligned with the CX, Developer and Business Teams on proceeding with the upfront offer.",
            },
          ],
        },
        {
          id: "flow",
          title: "The flow I implemented",
          blocks: [
            {
              type: "p",
              text: "At the beginning of the call, the voice AI introduces the option to connect directly to the property alongside the help it can give itself. An illustrative paraphrase, not the exact production script:",
            },
            {
              type: "quote",
              text: "Hi, this is the Agoda digital assistant. I can help with booking information, cancellations, and property information, or connect you directly to your property.",
              caption: "Illustrative paraphrase of the call opening",
            },
            {
              type: "p",
              text: "If a guest asks to speak to the property about an extra-bed request, the flow identifies the intent to talk to property, updates end-stage and logs intent, then uses existing call transfer functionality to connect the guest with the property.",
            },
            {
              type: "flow",
              flow: {
                label: "Simplified flow",
                lanes: [
                  {
                    title: "A-side (without CTP)",
                    steps: [
                      { text: "Guest needs property assistance" },
                      { text: "AI cannot resolve the request" },
                      { text: "Agoda human support" },
                      { text: "Guest redirected to the property" },
                    ],
                  },
                  {
                    title: "B-side (With CTP)",
                    steps: [
                      { text: "Call opening offers a property connection", owner: "mine" },
                      { text: "Guest declares CTP request", owner: "mine" },
                      { text: "Guest call automatically re-routed to property", owner: "existing" },
                    ],
                  },
                ],
                legend: { mine: "Flow logic I implemented", existing: "API call to existing call-transfer" },
              },
            },
          ],
        },
        {
          id: "experiment",
          title: "Production experiment and projected impact",
          blocks: [
            {
              type: "p",
              text: "CTP is running in a production A/B test that compares calls with the feature against calls without it.",
            },
            {
              type: "columns",
              columns: [
                {
                  title: "Delivered",
                  items: [
                    "CTP’s conversational flow logic, implemented in JavaScript and tested before production.",
                    "A production A/B test: calls with CTP and calls without it.",
                  ],
                },
                {
                  title: "Estimated",
                  items: [
                    "~72 eligible cases a day, from demand sizing.",
                    "12–18 agent-hours a day of potential capacity and ~$154K a year in potential savings, using internal handling-time and cost assumptions.",
                    "Presented to the C-suite and adjacent-team PMs to support launch and phased-rollout discussions.",
                  ],
                }
              ],
            },
          ],
        },
        {
          id: "next",
          title: "Future Steps & Handoff",
          blocks: [
            {
              type: "p",
              text: "The production A/B test results will inform CTP’s actual impact on handle time, customer DSAT, and case automation rate.",
            },
            {
              type: "proposed",
              label: "Additional Future Steps",
              items: [
                "Monitor guest re-contact rate for cases that enter the CTP flow -> Informs us whether cases routed to CTP are accurately classified and resolved.",
                "Closely Audit Customer DSAT & Feedback surveys for cases that enter the CTP flow.",
              ],
            },
          ],
        },
      ],
    },
    sections: {},
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
