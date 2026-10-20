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
  // Shown on the monitor. Keep it to two or three short sentences.
  monitorIntro:
    "Product builder studying Information Systems & Business at Carnegie Mellon. I like finding the problem worth solving, shipping the fix, and measuring what changed.",
  // Your portrait for the monitor. Put the file in /public (e.g. "/media/portrait.jpg",
  // roughly 4:5) and fill this in. While null, a clearly marked placeholder shows.
  photo: null as { src: string; alt: string } | null,
};

export const welcome = {
  hint: "Everything on the desk is clickable: the monitor holds my work, the rest is what I love outside it.",
  primary: "Explore my work",
  secondary: "Explore freely",
};

export type ContactLink = {
  label: string;
  value: string;
  href: string;
  hidden?: boolean;
};

// Add a link here and it appears on the Contact page. Set `hidden: true` to
// keep one without showing it.
export const contactLinks: ContactLink[] = [
  { label: "Email", value: "to.phasakorn@gmail.com", href: "mailto:to.phasakorn@gmail.com" },
  { label: "School email", value: "pchivatx@andrew.cmu.edu", href: "mailto:pchivatx@andrew.cmu.edu" },
  { label: "LinkedIn", value: "linkedin.com/in/phasakorn", href: "https://www.linkedin.com/in/phasakorn/" },
  { label: "GitHub", value: "github.com/pskodr", href: "https://github.com/pskodr" },
];

export const primaryEmail = contactLinks[0];

// Put the PDF in /public (e.g. "/resume.pdf", without a phone number) and set
// the path here. While null, no download button renders.
export const resumePdf: string | null = null;
