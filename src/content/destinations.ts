// Every place on the site, in one list. The monitor's menu and the objects on
// the desk both point here, so they always open the same content.
//
// To add an interest: add its content, a page under src/app/<id>/, and an
// entry below with group "beyond". It appears in the monitor's "Beyond work"
// menu and on the Personal Interests overview; it doesn't need an object on
// the desk.

import { publishedPosts } from "./blog";

export type Destination = {
  id: string;
  title: string; // menu label
  href: string;
  group: "work" | "beyond";
  hidden?: boolean;
};

export const destinations: Destination[] = [
  { id: "home", title: "Home", href: "/work", group: "work" },
  { id: "projects", title: "Projects", href: "/work/projects", group: "work" },
  { id: "resume", title: "Résumé", href: "/work/resume", group: "work" },
  { id: "blog", title: "Blogs", href: "/work/blog", group: "work", hidden: publishedPosts.length === 0 },
  { id: "interests", title: "Personal Interests", href: "/work/interests", group: "work" },
  { id: "gallery", title: "Gallery", href: "/work/gallery", group: "work" },
  { id: "contact", title: "Contact Me", href: "/work/contact", group: "work" },
  { id: "pokemon", title: "Pokémon", href: "/pokemon", group: "beyond" },
  { id: "tennis", title: "Tennis", href: "/tennis", group: "beyond" },
  { id: "barcelona", title: "FC Barcelona", href: "/barcelona", group: "beyond" },
  { id: "music", title: "Music", href: "/music", group: "beyond" },
  { id: "food", title: "Food & Exploring", href: "/food", group: "beyond" },
];

export const visibleDestinations = destinations.filter((d) => !d.hidden);
export const destination = (id: string) => destinations.find((d) => d.id === id)!;

// Objects on the desk: what each is called, the label shown on hover or
// focus, and where it leads. `id` matches the artwork's group (see
// scripts/desk-art): the monitor, keyboard and mouse are one "computer" group.
export type DeskObject = { id: string; name: string; label: string; href?: string; action?: "welcome" };

export const deskObjects: DeskObject[] = [
  { id: "computer", name: "Computer", label: "Explore my work", href: "/work" },
  { id: "pikachu", name: "Pikachu plush", label: "Pokémon & strategy", href: "/pokemon" },
  { id: "racket", name: "Tennis racket", label: "My tennis game", href: "/tennis" },
  { id: "jersey", name: "FC Barcelona jersey", label: "Being a Barça fan", href: "/barcelona" },
  { id: "headphones", name: "Headphones", label: "What I'm listening to", href: "/music" },
  { id: "padthai", name: "Pad Thai", label: "Food & exploring", href: "/food" },
  { id: "card", name: "Welcome card", label: "Welcome guide", action: "welcome" },
];

// Quiet shortcuts on the desk for visitors who want the essentials fast.
export const shortcuts = [
  { label: "Work", href: "/work/projects" },
  { label: "Résumé", href: "/work/resume" },
  { label: "Contact", href: "/work/contact" },
];
