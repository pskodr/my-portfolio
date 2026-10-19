// The objects in the room and where they lead. Section routes map back to the
// object the camera should focus on.

export type RoomObjectId = "computer" | "soccer" | "pokemon" | "camera" | "avatar";

export type RoomObject = {
  id: RoomObjectId;
  label: string;
  hint: string;
  href: string;
};

export const roomObjects: RoomObject[] = [
  { id: "computer", label: "Computer", hint: "Work, résumé & contact", href: "/computer" },
  { id: "soccer", label: "Ball & Barça jersey", hint: "Soccer & FC Barcelona", href: "/soccer" },
  { id: "pokemon", label: "Pikachu & Switch", hint: "Pokémon VGC doubles", href: "/pokemon" },
  { id: "camera", label: "Camera", hint: "Content creation", href: "/creative" },
  { id: "avatar", label: "Me", hint: "About", href: "/about" },
];

export const siteNav = [
  { label: "Work", href: "/computer/projects" },
  { label: "About", href: "/about" },
  { label: "Résumé", href: "/computer/resume" },
  { label: "Contact", href: "/computer/contact" },
];

export function focusForPath(pathname: string): RoomObjectId | null {
  if (pathname.startsWith("/computer")) return "computer";
  if (pathname.startsWith("/soccer")) return "soccer";
  if (pathname.startsWith("/pokemon")) return "pokemon";
  if (pathname.startsWith("/creative")) return "camera";
  if (pathname.startsWith("/about")) return "avatar";
  return null;
}
