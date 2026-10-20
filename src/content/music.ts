// Favorite songs, shown in the phone-style library opened from the headphones.
//
// `spotifyId` is the track id from an official Spotify link
// (open.spotify.com/track/<id>). Leave it out until the exact recording is
// verified; songs without one show no player or link. `note` flags anything
// still to confirm (it's never shown on the site).

export type Song = {
  title: string;
  artist: string;
  spotifyId?: string;
  note?: string;
};

export const songs: Song[] = [
  { title: "DAY ONE", artist: "PUN" },
  { title: "Soft Spot", artist: "keshi" },
  { title: "BLEED", artist: "The Kid LAROI" },
  { title: "YUKON", artist: "Justin Bieber" },
  { title: "กรุงเทพมหานคร", artist: "YOUNGOHM" },
  { title: "JoyRide", artist: "CORTIS" },
  { title: "Always", artist: "Daniel Caesar" },
  { title: "luther", artist: "Kendrick Lamar, SZA" },
  { title: "Eastside", artist: "benny blanco, Halsey, Khalid" },
];
