# Design: the pixel-art desk

Owner brief, 2026-10-20. Replaces the earlier 3D bedroom and full-room concepts.

## Thesis

A nighttime desk drawn as polished pixel art. The monitor is the focal point and
opens the professional portfolio. The objects around it carry the owner's
interests. The art is the scene; everything you read is crisp HTML.

## Scene

- **Canvas:** 480×270 art pixels, scaled so each art pixel lands on whole device
  pixels (`image-rendering: pixelated`). Wide screens cover the viewport; narrow
  ones show the whole desk across the top with a labelled list below.
- **Light:** the monitor's cool glow and an amber light bar on top of it.
  Shading is flat bands from short palette ramps, with thin 2x2 seams between
  them (`tone()` in `scripts/desk-art/lib.mjs`) and no per-pixel noise.
  Objects carry contact shadows on the desk, and the wall objects cast offset
  shadows. Every object has the same 1px darkened silhouette edge.
- **Palette:** charcoal wall `#0f1014`–`#393e4c`, walnut desk, felt mat. Colour
  comes only from the objects: Pikachu yellow (flat, sprite-style, with its own dark outline), Barça garnet and blue, racket sky
  blue, noodles and lime, plus the screen's ink blue.
- **Objects:** jersey (framed, wall left), racket (wall right), monitor (centre,
  ~47% of the width), keyboard and mouse on the mat, Pikachu and Pad Thai at
  front left, headphones on the right, a small welcome card at the front. No person, no extra decoration.
- **Layers:** a background plate plus one PNG per object, each with a yellow
  silhouette outline and a hit mask (`scripts/desk-art/`).

## Interaction

- **Hover / keyboard focus:** a 1-art-pixel `#F5D76E` outline around the active
  object and a Pixelify Sans label, placed so it never covers an object.
  Pointers hit-test the actual pixels. The monitor, keyboard and mouse are one
  "computer" group: hovering any of them outlines all three, with one label
  ("Explore my work") and one keyboard stop.
- **Monitor screen:** real HTML laid over the glass and sized in art pixels:
  a pixel-framed portrait slot, the full name, a short intro, "Explore
  projects", Résumé and Contact.
- **Monitor → /work:** the desk scales toward the screen while the full-screen
  window grows out of the screen's rectangle (0.42s).
- **Interests:** a large centred window (about 86% of the viewport, max
  1240px) over a dimmed desk. A 66ch reading column, with media and what's
  coming in a side column when there is any. Full screen on mobile.
- **Welcome:** a small "HI!" tent card on the desk. Its window opens on a first
  visit, pinned bottom-right with a tail pointing at the card. Closing leaves
  the card; clicking the card or Help reopens it.
- **Returning:** "Back to desk", close, Escape and browser Back all work. Focus
  returns to the object that opened the page.
- **Reduced motion:** no zoom, lift or pop; changes are instant.

## Interface system (`src/app/globals.css`)

- **Window (`.win`):** ink-blue body, 2px stepped frame (notched corners),
  hard 8px drop shadow. **Title bar (`.win-bar`):** Pixelify title, close.
- **Button (`.pbtn`):** the same stepped frame; it presses down 2px. Primary is
  yellow on dark ink. Quiet buttons are used for the desk shortcuts.
- **Type:** Pixelify Sans for page headings (32–40px), section headings
  (22–26px), window titles and short buttons. Geist Mono for navigation
  (15.5px), labels and body text (17px, line height 1.6, 66ch measure; 16.5px
  on phones). Noto Sans Thai covers Thai characters. Fonts are self-hosted
  from `src/fonts/` with their licenses.
- **Content container:** pages in the monitor sit in a centred 760px column
  beside a 272px sidebar, so text never stretches across the screen.
- **Colour:** yellow `#f5d76e` means interactive or selected only. The scene's
  warm light is amber (`#e9a35e`), so the two stay distinct.

## Content rules

Drafts are marked with a dashed frame and a "Draft" tag, and all of them
disappear when `showDrafts` is off. The sample project is labelled as a sample
everywhere it appears. Photos and video are never pixelated.
