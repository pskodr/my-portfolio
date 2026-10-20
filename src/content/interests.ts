// Interest pages, opened from objects on the desk or from "Beyond work" on the
// monitor. Write in your own words; never invent rankings, results, visits,
// reviews or personal history.
//
// `media` lists ids from content/media.ts. `planned` lists what's coming; it's
// shown as a clearly marked draft and hidden when drafts are off.

export type Interest = {
  title: string;
  lede: string;
  body: string[];
  media: string[];
  planned: { title: string; note: string }[];
};

export const pokemon: Interest = {
  title: "Competitive Pokémon",
  lede: "I play VGC doubles: the official competitive format, where each player has two Pokémon on the field at a time.",
  body: [
    "With two Pokémon active on each side, every turn is a small puzzle. My opponent is trying to read me as hard as I'm trying to read them.",
    "What I enjoy most is the anticipation. It feels a lot like chess: predicting the options my opponent has, and planning a turn or two ahead. A choice I make on one turn shapes what's possible on the next.",
    "Team-building is its own creative outlet. There are endless combinations of roles and synergies, and lots of room for approaches nobody expects.",
    "When I lose, I go back through the game. Sometimes my preparation had a gap or I misjudged a turn; sometimes the matchup was rough or the randomness didn't go my way. Telling those apart is how I get better.",
  ],
  media: [],
  planned: [
    { title: "Team breakdowns", note: "Teams I've built and the thinking behind each slot." },
    { title: "Screenshots", note: "Moments from games worth looking at." },
    { title: "Reflections", note: "What I took away from sets, wins and losses." },
  ],
};

export const tennis: Interest = {
  title: "Tennis",
  lede: "Tennis is how I de-stress.",
  body: [
    "Time on court clears my head better than almost anything. I'm around a 4–5 UTR, and I like that there's always another part of my game to improve.",
    "I'm working on a playing style that feels like my own, and enjoying the process of getting there.",
  ],
  media: [],
  planned: [
    { title: "Photos", note: "From the court." },
    { title: "Match and practice clips", note: "With notes on what I'm working on." },
    { title: "Reflections", note: "How my game is developing." },
  ],
};

export const barcelona: Interest = {
  title: "Soccer & FC Barcelona",
  lede: "I've supported FC Barcelona since 2015.",
  body: [
    "Luis Suárez is my favorite player of all time. These days, my favorite is Pedri.",
    "I got to see the team in person at the Daegu FC vs. FC Barcelona preseason match.",
  ],
  media: [],
  planned: [
    { title: "Daegu FC vs. FC Barcelona", note: "Photos and video from the match." },
    { title: "Memories", note: "Moments that made me a fan." },
  ],
};

export const food: Interest = {
  title: "Food & exploring",
  lede: "I'm from Thailand, and Thai food will always be my favorite.",
  body: [
    "I also love Japanese, Italian, Indian, and plenty of other cuisines.",
    "Some of my favorite days are spent café and restaurant hopping, trying somewhere new and ordering something I haven't had before.",
  ],
  media: [],
  planned: [
    { title: "Food photos", note: "What I've been eating." },
    { title: "Café visits", note: "Places worth the trip." },
    { title: "Restaurant notes and video reviews", note: "Short, honest takes." },
  ],
};
