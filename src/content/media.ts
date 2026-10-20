// One library of photos, graphics and videos. Projects, the gallery and the
// interest pages refer to items here by id, so a photo is described once and
// can appear in several places.
//
// Put files in /public/media/ and reference them as "/media/<file>".
// Real photos and videos are shown as-is (never pixelated).

export type MediaItem = {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string; // what's in it, for screen readers (images) or a title (videos)
  width: number;
  height: number;
  poster?: string; // video still
  caption?: string;
  context?: string; // where and when
  contribution?: string; // what I did
};

export const media: MediaItem[] = [
  // Example:
  // {
  //   id: "lpe-spring-recruitment",
  //   type: "image",
  //   src: "/media/lpe-spring-recruitment.jpg",
  //   alt: "Recruitment graphic in the chapter's colours",
  //   width: 1080,
  //   height: 1350,
  //   caption: "Spring recruitment announcement",
  //   context: "Lambda Phi Epsilon Instagram",
  //   contribution: "Design and copy",
  // },
];

export const getMedia = (ids: string[]) =>
  ids.map((id) => media.find((m) => m.id === id)).filter((m): m is MediaItem => !!m);
