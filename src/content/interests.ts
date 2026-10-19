// Personal-interest pages. Write in your own words; don't force PM analogies.
// `body` undefined renders as a clearly marked "coming soon" block.
// Never invent rankings, results, or personal history.

export type InterestSection = { title: string; body?: string | string[] };
export type FutureArea = { title: string; note: string };

export type InterestPage = {
  title: string;
  lede: string;
  facts: string[];
  sections: InterestSection[];
  future: FutureArea[];
  photos: { src: string; alt: string; caption?: string }[];
};

export const pokemon: InterestPage = {
  title: "Pokémon VGC doubles",
  lede: "The competitive doubles format: build a team of six, bring four, and outthink the player across from you.",
  facts: ["Competitive play: top 1%"],
  sections: [
    { title: "Why I enjoy it" },
    { title: "Team-building" },
    { title: "Strategy" },
    { title: "Favorite teams" },
    { title: "What playing has taught me" },
  ],
  future: [
    { title: "Team breakdowns", note: "Teams I've built, with the reasoning behind each slot." },
    { title: "Practice journal", note: "Notes from sets: what worked, what didn't." },
  ],
  photos: [],
};

export const soccer: InterestPage = {
  title: "Soccer & FC Barcelona",
  lede: "Watching Barça, playing 5-a-side, and the occasional FIFA match.",
  facts: ["Plays 5-a-side", "FC Barcelona supporter"],
  sections: [
    { title: "How I got into soccer" },
    { title: "FC Barcelona" },
    { title: "Playing" },
    { title: "Watching" },
  ],
  future: [
    { title: "Favorite moments", note: "Matches and moments worth remembering." },
    { title: "Short reflections", note: "Thoughts after big games." },
  ],
  photos: [],
};
