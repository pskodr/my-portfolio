# Editing the site

All words, links and media live in `src/content/`. You never need to touch the
artwork, routing or animation to change them. Save the file and the dev server
(`npm run dev`) shows the change.

| To change | Edit |
|---|---|
| Name, bio (Home and welcome card), welcome card | `src/content/site.ts` (`profile`, `welcome`) |
| Your photo (Home and the monitor) | `public/media/professional-image.jpg`, set in `profile.photo` in `src/content/site.ts` with its width, height and alt text. To replace it, export a 2:3 JPEG with location and camera metadata removed and update those fields. Set `photo` to `null` to show a placeholder. |
| Monitor introduction | `profile.monitorIntro` in `src/content/site.ts` |
| Contact links (email, LinkedIn, GitHub…) | `src/content/site.ts` (`contactLinks`). Add a line to show a link; add `hidden: true` to hide one. |
| Résumé PDF | Put the PDF in `public/` and set `resumePdf` in `src/content/site.ts` (the download is saved as `resumeFilename`). It must not show your phone number or GPA. Until it is set, "Download Résumé" appears only as a marked draft. |
| Experience, leadership, education, skills, awards, the Résumé caption | `src/content/experience.ts`. A role with no bullet points shows in the compact leadership grid. Each skill group is a heading and a list of chips. |
| Organisation logos on the Résumé | Put the original in `assets/logos/`, add it to `scripts/build-logos.mjs` and run `npm run logos`, then add it to `src/content/logos.ts` (size from the script's output) and set `logo` on the role. Record its source in `ASSET_CREDITS.md`. |
| Personal Interests rows | `icon` and `summary` on each "beyond" entry in `src/content/destinations.ts`; the caption is `interestsCaption`. Icons are drawn in `scripts/build-icons.mjs` (`npm run icons`). |
| Contact Me caption and icons | `contactCaption` and each link's `icon` in `src/content/site.ts`. |
| Projects | `src/content/projects.ts`. Copy an entry, give it a new `slug`, fill in what you have. Order in the file is order on the page. |
| Interest pages (Pokémon, tennis, Barça, food) | `src/content/interests.ts` |
| Songs | `src/content/music.ts` |
| Home: bold phrases in the bio, the education row, "Previously at" | `home` in `src/content/site.ts` (`emphasis` must match the bio's wording exactly; logos are ids from `src/content/logos.ts`). |
| Gallery caption and "Coming Soon" | `galleryCaption` and `galleryComingSoon` in `src/content/gallery.ts`. Set `galleryComingSoon` to `false` to show the collections. |
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
