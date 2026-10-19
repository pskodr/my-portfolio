// Facts come from the owner's résumé and confirmed answers (see PRODUCT.md).
// Never add a GPA or phone number.

export const profile = {
  name: "Phasakorn Chivatxaranukul",
  shortName: "Phasakorn",
  focus: "Aspiring product manager who builds",
  intro:
    "I study Information Systems and Business at Carnegie Mellon and work on products end to end: sizing the problem, writing the spec, shipping, and measuring.",
  school: "Carnegie Mellon University",
  degree:
    "B.S. Information Systems, additional major in Business Administration, minor in AI",
  graduation: "Expected May 2028",
};

export type ContactLink = {
  label: string;
  value: string;
  href?: string; // leave undefined while the owner hasn't supplied the link
  group: "contact" | "social";
};

export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    value: "to.phasakorn@gmail.com",
    href: "mailto:to.phasakorn@gmail.com",
    group: "contact",
  },
  {
    label: "School email",
    value: "pchivatx@andrew.cmu.edu",
    href: "mailto:pchivatx@andrew.cmu.edu",
    group: "contact",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/phasakorn",
    href: "https://www.linkedin.com/in/phasakorn/",
    group: "contact",
  },
  // Placeholders: add `href` once the owner confirms each account.
  { label: "GitHub", value: "Link coming soon", group: "social" },
  { label: "Instagram", value: "Link coming soon", group: "social" },
  { label: "YouTube", value: "Link coming soon", group: "social" },
  { label: "Podcast", value: "Link coming soon", group: "social" },
];

export const primaryEmail = contactLinks[0];

// Set to a path under /public (e.g. "/resume.pdf") once the owner supplies a PDF
// without a phone number. While null, no download control renders.
export const resumePdf: string | null = null;
