// Content-creation gallery. `status` separates published work from experiments.
// Leave fields undefined until real details exist; never invent results or a title.

export type Media =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; title: string };

export type CreativeEntry = {
  slug: string;
  title: string;
  client: string;
  format: string;
  status: "published" | "experiment";
  placeholder?: boolean; // true while the owner hasn't supplied the work itself
  summary: string;
  audience?: string;
  goal?: string;
  direction?: string;
  contribution?: string;
  results?: string;
  media: Media[];
  link?: string;
};

export const creativeEntries: CreativeEntry[] = [
  {
    slug: "lambda-phi-epsilon-social",
    title: "Lambda Phi Epsilon social media",
    client: "Lambda Phi Epsilon",
    format: "Posts, graphics & video",
    status: "published",
    placeholder: true,
    summary: "Social content for the chapter. Posts and details are on their way.",
    media: [],
  },
  {
    slug: "podcast",
    title: "Podcast",
    client: "Personal",
    format: "Audio / video podcast",
    status: "published",
    placeholder: true,
    summary: "A podcast I host. Episodes and links coming soon.",
    media: [],
  },
  {
    slug: "lifestyle-vlog",
    title: "Lifestyle vlog",
    client: "Personal",
    format: "Video",
    status: "experiment",
    placeholder: true,
    summary: "Personal lifestyle vlogging. Clips coming soon.",
    media: [],
  },
];

export const getCreativeEntry = (slug: string) => creativeEntries.find((e) => e.slug === slug);
