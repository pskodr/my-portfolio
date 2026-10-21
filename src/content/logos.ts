// Organisation logos for the Résumé, made by scripts/build-logos.mjs from the
// originals in assets/logos/ (sources and terms in ASSET_CREDITS.md). Each is
// shown whole inside a round badge: `width` and `height` are the file's size,
// used to fit the logo inside the circle without cropping. `bg` is the badge
// colour behind it.

export type Logo = { src: string; alt: string; width: number; height: number; bg: string };

export const logos = {
  agoda: { src: "/media/logos/agoda.png", alt: "Agoda logo", width: 192, height: 98, bg: "#ffffff" },
  overturexl: { src: "/media/logos/overturexl.png", alt: "OvertureXL logo", width: 192, height: 161, bg: "#ffffff" },
  accenture: { src: "/media/logos/accenture.png", alt: "Accenture logo", width: 192, height: 51, bg: "#ffffff" },
  animalhealthexperts: {
    src: "/media/logos/animalhealthexperts.png",
    alt: "Animal Health Experts logo",
    width: 96,
    height: 192,
    bg: "#fafafa", // matches the illustration's own paper background
  },
  cmu: { src: "/media/logos/cmu.png", alt: "Carnegie Mellon University logo", width: 192, height: 123, bg: "#c41230" },
  ucc: { src: "/media/logos/ucc.png", alt: "Undergraduate Consulting Club logo", width: 192, height: 140, bg: "#ffffff" },
} satisfies Record<string, Logo>;

export type LogoId = keyof typeof logos;
