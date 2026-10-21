// Gallery: photos, graphics and videos, grouped into collections. Media lives
// in content/media.ts; collections list ids, so the same photo can also appear
// on an interest page without being described twice.

// The Gallery page's caption. While `galleryComingSoon` is true, the page shows
// only the caption and a "Coming Soon :)" note; set it to false to show the
// collections below.
export const galleryCaption = "A little more of my life, in photos, videos, and memories.";
export const galleryComingSoon = true;

export type Collection = {
  slug: string;
  title: string;
  summary: string;
  context?: string; // who it was for
  contribution?: string; // what I did
  media: string[];
  hidden?: boolean;
};

export const collections: Collection[] = [
  {
    slug: "lambda-phi-epsilon",
    title: "Lambda Phi Epsilon",
    summary: "Social posts, graphics and videos for the chapter.",
    media: [],
  },
];
