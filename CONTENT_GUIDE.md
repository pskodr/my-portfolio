# Editing the site

All words, links and media live in `src/content/`. You never need to touch the
artwork, routing or animation to change them. Save the file and the dev server
(`npm run dev`) shows the change.

| To change | Edit |
|---|---|
| Name, welcome card, About intro | `src/content/site.ts` (`profile`, `welcome`) |
| Your photo on the monitor | Put a portrait (about 4:5) in `public/media/` and set `profile.photo` in `src/content/site.ts`, e.g. `{ src: "/media/portrait.jpg", alt: "Phasakorn smiling, outdoors" }`. Until then the screen shows your initials. |
| Monitor introduction | `profile.monitorIntro` in `src/content/site.ts` |
| Contact links (email, LinkedIn, GitHub…) | `src/content/site.ts` (`contactLinks`). Add a line to show a link; add `hidden: true` to hide one. |
| Résumé PDF | Put the PDF in `public/` and set `resumePdf` in `src/content/site.ts`. No download button appears until you do. |
| Experience, leadership, education, skills, awards | `src/content/experience.ts` |
| Projects | `src/content/projects.ts`. Copy an entry, give it a new `slug`, fill in what you have. Order in the file is order on the page. |
| Interest pages (Pokémon, tennis, Barça, food) | `src/content/interests.ts` |
| Songs | `src/content/music.ts` |
| Photos, graphics and videos | Put files in `public/media/`, describe each in `src/content/media.ts`, then list its `id` wherever it should appear: a project's `media`, a gallery collection in `src/content/gallery.ts`, or an interest's `media`. The same photo can appear in several places. |
| Blog posts | `src/content/blog.ts`. The Blogs menu entry appears once there's a post. |
| Menu entries, desk object names and hover labels | `src/content/destinations.ts` (`destinations`, `deskObjects`) |

## Hiding things

- Any project, collection, post or contact link takes `hidden: true`.
- Drafts (the sample project and the dashed "Draft" boxes) all disappear when
  you set `showDrafts = false` in `src/content/site.ts`. Do this before you
  share the site publicly.

## Adding a new interest

1. Add its content to `src/content/interests.ts`.
2. Copy `src/app/tennis/` to `src/app/<new-id>/` and point it at the new content.
3. Add an entry to `destinations` in `src/content/destinations.ts` with
   `group: "beyond"`. It appears in the monitor's "Beyond work" menu. It doesn't
   need an object on the desk.

## Rules of thumb

- Real content only: no invented metrics, results, visits or reviews.
- Never add a GPA or phone number.
- Changing the artwork is a code change: see `scripts/desk-art/` and run
  `npm run art`.
