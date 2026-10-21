// Who I am, the welcome card, and how to reach me.
// Facts come from the owner's résumé and confirmed answers (see PRODUCT.md).
// Never add a GPA or phone number.

// Drafts: sample projects and "coming soon" placeholders. Set to false before
// the public release; every draft-only entry and empty slot disappears.
export const showDrafts = true;

export const profile = {
  name: "Phasakorn Chivatxaranukul",
  shortName: "Phasakorn",
  intro:
    "Hey! I'm Phasakorn, a product builder & business enthusiast studying Information Systems & Business at Carnegie Mellon University.",
  school: "Carnegie Mellon University",
  degree: "B.S. Information Systems, additional major in Business Administration, minor in AI",
  graduation: "Expected May 2028",
  // Not shown at present: the monitor previews Home (photo, name, My Projects).
  // Kept so the wording is not lost.
  monitorIntro:
    "Product builder studying Information Systems & Business at Carnegie Mellon. I like finding the problem worth solving, shipping the fix, and measuring what changed.",
  // Your portrait, on Home and the monitor. The file lives in /public/media
  // (2:3, metadata removed). Set to null to show a placeholder instead.
  photo: {
    src: "/media/professional-image.jpg",
    width: 1200,
    height: 1800,
    alt: "Phasakorn Chivatxaranukul in a dark suit and red tie, arms crossed, in a bright atrium",
  } as { src: string; width: number; height: number; alt: string } | null,
};

// Home: phrases in the bio set in bold (the first also gets a one-time yellow
// underline), the education row, and the organisations under "Previously at"
// (ids from content/logos.ts).
export const home = {
  emphasis: ["product builder", "Information Systems & Business", "Carnegie Mellon University"],
  education: { logo: "cmu", text: "B.S. Information Systems, Additional Major in Business Administration" },
  previouslyAt: ["agoda", "accenture"],
} as const;

export const welcome = {
  hint: "Everything on the desk is clickable: the monitor holds my work, the rest is what I love outside it.",
  primary: "Explore my work",
  secondary: "Explore freely",
};

export type ContactLink = {
  label: string;
  value: string;
  href: string;
  icon: string; // pixel icon in /media/icons
  hidden?: boolean;
};

// The caption on the Contact Me page.
export const contactCaption = "Let’s talk product, building ideas, or shared interests!";

// Add a link here and it appears on the Contact page. Set `hidden: true` to
// keep one without showing it.
export const contactLinks: ContactLink[] = [
  { label: "Email", value: "to.phasakorn@gmail.com", href: "mailto:to.phasakorn@gmail.com", icon: "gmail" },
  // CMU's Andrew mail runs on Google Workspace (Gmail).
  { label: "School email", value: "pchivatx@andrew.cmu.edu", href: "mailto:pchivatx@andrew.cmu.edu", icon: "gmail" },
  { label: "LinkedIn", value: "linkedin.com/in/phasakorn", href: "https://www.linkedin.com/in/phasakorn/", icon: "linkedin" },
  { label: "GitHub", value: "github.com/pskodr", href: "https://github.com/pskodr", icon: "github" },
];

export const primaryEmail = contactLinks[0];

// The résumé PDF for "Download Résumé": put it in /public (e.g.
// "/Phasakorn_Chivatxaranukul_Resume.pdf") and set the path here. It must not
// show a phone number or GPA (see PRODUCT.md). While null, no download link
// renders (a marked draft placeholder shows while drafts are on).
export const resumePdf: string | null = null;
export const resumeFilename = "Phasakorn_Chivatxaranukul_Resume.pdf";
