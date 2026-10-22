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
  // Projections, shown apart from facts with their assumptions beside them.
  projected?: { title: string; figures: { value: string; label: string }[]; note: string };
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
      "Restored a direct-to-property contact option during Agoda’s transition from IVR to conversational AI, reducing the need for an intermediary support handoff.",
    status: "ab-test",
    org: "Agoda (Booking Holdings)",
    logo: "agoda",
    timeline: "Jun–Aug 2026",
    tags: ["Product Management", "AI Voice", "Production Experiment"],
    caseStudy: {
      intro:
        "During my Agoda internship, I restored a direct-to-property contact option that was missing after the move from IVR to conversational AI. I reviewed service flows, sized demand, compared two approaches, and implemented the JavaScript flow logic for a production A/B test.",
      role: "Technical Product Management Intern, Customer Experience AI Voice Automation team",
      projected: {
        title: "Projected impact",
        figures: [
          { value: "~72", label: "eligible cases/day" },
          { value: "12–18", label: "potential agent-hours/day" },
          { value: "~$154K", label: "annualized potential savings" },
        ],
        note: "Estimates from demand sizing using internal handling-time and cost assumptions. Production impact is still being evaluated.",
      },
      sections: [
        {
          id: "missing",
          title: "The missing connection",
          blocks: [
            {
              type: "p",
              text: "Some guests call Agoda about something only their property can help with. A guest might want an extra bed, for example, which can’t be added through the booking platform. Other calls are property-information questions that neither the AI voice agent nor Agoda’s human support agents can answer.",
            },
            {
              type: "p",
              text: "Agoda’s old IVR phone system had a direct route for this: “press 9 to talk to the property.” When Agoda moved to an AI conversational voice agent, launched in Q4 2025, the conversational experience had no equivalent option.",
            },
            {
              type: "p",
              text: "So when the AI couldn’t resolve one of these requests, it escalated the call to an Agoda human agent. The agent would hear the request, then redirect the guest to the property or tell them to contact it. The opportunity was to remove that avoidable handoff by letting guests reach the property directly: a capability I’ll call connect-to-property (CTP).",
            },
          ],
        },
        {
          id: "ownership",
          title: "My ownership",
          blocks: [
            {
              type: "bullets",
              items: [
                "Reviewed and audited the customer-service SOPs.",
                "Sized demand and eligible call volume with SQL.",
                "Ideated solutions and compared two ways to offer the connection.",
                "Implemented the conversational flow logic in JavaScript.",
                "Ran simulations and evaluations, then pre-production testing.",
                "Took CTP into a production A/B test.",
              ],
            },
            {
              type: "note",
              label: "Where my work ends",
              text: "The functionality that physically transfers a phone call to a property already existed; I didn’t build it. My work was the conversational flow logic that offers the connection and sends the guest to that existing transfer.",
            },
          ],
        },
        {
          id: "decision",
          title: "Choosing when to offer the connection",
          blocks: [
            {
              type: "p",
              text: "I compared two approaches. The choice came down to discoverability and potential usage.",
            },
            {
              type: "compare",
              options: [
                {
                  title: "A. Contextual offer",
                  when: "Offer the connection only after a guest asks for a special request or property information the AI can’t answer.",
                  evidence: "Sizing indicated relatively low eligible volume for this trigger.",
                },
                {
                  title: "B. Upfront offer",
                  when: "Offer the connection proactively at the beginning of the call.",
                  evidence:
                    "Historical IVR usage supported demand for a more discoverable option, and it restores a capability familiar from the old IVR.",
                  chosen: true,
                },
              ],
            },
            {
              type: "p",
              text: "The team proceeded with the upfront offer, with approval from the CX team. A design consideration with this approach is that every call’s opening carries one more option.",
            },
          ],
        },
        {
          id: "flow",
          title: "The flow I implemented",
          blocks: [
            {
              type: "p",
              text: "At the beginning of the call, the AI introduces the option to connect directly to the property alongside the help it can give itself. An illustrative paraphrase, not the production script:",
            },
            {
              type: "quote",
              text: "Hi, this is the Agoda digital assistant. I can connect you directly to your property, or help with booking information, cancellations, and property information.",
              caption: "Illustrative paraphrase of the call opening",
            },
            {
              type: "p",
              text: "If a guest asks to speak to the property about an extra-bed request, the flow routes them to the property using the existing transfer functionality. Connecting the call gives the guest a direct line to the property; it doesn’t by itself guarantee that the request is resolved.",
            },
            {
              type: "flow",
              flow: {
                label: "Simplified flow",
                lanes: [
                  {
                    title: "Before",
                    steps: [
                      { text: "Guest needs property assistance" },
                      { text: "AI cannot resolve the request" },
                      { text: "Agoda human support" },
                      { text: "Guest redirected to the property" },
                    ],
                  },
                  {
                    title: "With CTP",
                    steps: [
                      { text: "Call opening offers a property connection", owner: "mine" },
                      { text: "Guest chooses the property", owner: "mine" },
                      { text: "Existing transfer functionality connects the call", owner: "existing" },
                    ],
                  },
                ],
                legend: { mine: "Flow logic I implemented", existing: "Existing functionality, not built by me" },
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
              text: "CTP is running in a production A/B test that compares calls with the feature against calls without it. Results aren’t available to share yet.",
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
                },
                {
                  title: "Not yet known",
                  items: ["The A/B test’s results.", "CTP’s actual effect in production."],
                },
              ],
            },
          ],
        },
        {
          id: "next",
          title: "What remains to learn",
          blocks: [
            {
              type: "p",
              text: "The production A/B test is intended to establish CTP’s actual impact. Until it reports, the figures above remain projections.",
            },
            {
              type: "proposed",
              label: "Proposed follow-up measures (not confirmed experiment metrics)",
              items: [
                "How often offered connections complete the transfer to the property.",
                "Whether human-agent escalations for property requests decrease.",
                "Guest outcomes after reaching the property.",
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
