# Design: the pixel-art desk

Owner brief, 2026-10-20. Replaces the earlier 3D bedroom and full-room concepts.

## Thesis

A nighttime desk drawn as polished pixel art. The monitor is the focal point and
opens the professional portfolio. The objects around it carry the owner's
interests. The art is the scene; everything you read is crisp HTML.

## Scene

- **Canvas:** 480×270 art pixels (`image-rendering: pixelated`), always shown
  whole: scale = min(available width / 480, available height / 270) in the
  space below the shortcut bar (safe areas included), centred, with the dark
  background filling any spare room. The scale snaps to whole device pixels
  unless that would shrink the scene by more than 12%. Narrow, portrait or very
  short windows (under 820px wide, portrait, or under 480px tall) use the
  compact layout: the scene as an overview under the bar, with every
  destination listed beneath it. The fit re-runs on any resize, rotation, zoom
  or mobile toolbar change.
- **Monitor screen density:** the full intro and links from scale 2.9; below
  that, the name and "Explore projects"; below 1.8, the name only. Text never
  shrinks past reading size.
- **Light:** the monitor's soft warm-ivory glow and an amber light bar on top of it.
  Shading is flat bands from short palette ramps, with thin 2x2 seams between
  them (`tone()` in `scripts/desk-art/lib.mjs`) and no per-pixel noise.
  Objects carry contact shadows on the desk, and the wall objects cast offset
  shadows. Every object has the same 1px darkened silhouette edge.
- **Palette:** charcoal wall `#0f1014`–`#393e4c`, walnut desk, felt mat. Colour
  comes only from the objects: Pikachu yellow (flat, sprite-style, with its own dark outline), Barça garnet and blue, racket sky
  blue, noodles and lime, plus the monitor's ivory screen.
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

Outside is dark, inside is light: the desk keeps its night palette; every
content surface (the monitor screen, the full-screen monitor, interest
windows, the welcome window) uses warm ivory.

- **Palette tokens:**

  | Token | Value | Use |
  |---|---|---|
  | `--ivory` | `#f5f2e9` | Main background, window bodies |
  | `--paper` | `#fffdf7` | Cards, drafts, secondary buttons, row hover |
  | `--stone` | `#e8e3d7` | Sidebar, title bars, notes |
  | `--stone-2` | `#ddd7c8` | Hover on stone |
  | `--text` | `#242424` | Primary text (14:1 on ivory) |
  | `--text-2` | `#59564f` | Secondary text (6.6:1) |
  | `--text-3` | `#625e55` | Metadata (5.1:1 on stone) |
  | `--edge` | `#cfc7b6` | Window frames |
  | `--edge-strong` | `#8a8273` | Control frames (3.4:1 on ivory) |
  | `--link-line` | `#b8931f` | Link underlines |
  | `--accent` | `#f5d76e` | Primary fills, selected nav, small markers |
  | `--focus` | `#242424` | Focus ring on light surfaces (yellow over the desk) |

- **Yellow is never the only signal on ivory.** Primary buttons are yellow
  with a charcoal frame and charcoal text. Selected navigation is a yellow
  fill plus a charcoal caret, an edge bar and a heavier weight. Markers carry
  a 1px frame. Links are charcoal with a gold underline.
- **Window (`.win`):** ivory body, 2px stepped frame (notched corners), soft
  hard-edged drop shadow. **Title bar (`.win-bar`):** stone, Pixelify title,
  close.
- **Button (`.pbtn`):** stepped frame that presses down 2px. Default: paper
  fill, grey frame; hover darkens the frame to charcoal over a faint yellow
  tint. Primary: yellow. Quiet (title bars): stone. Scene (`.pbtn-scene`, the
  desk shortcuts): dark translucent fill with ivory text, turning yellow on
  hover, because it sits on the dark artwork. Disabled: stone fill, grey text.
- **Desk labels** stay dark with yellow text: they belong to the scene.
- **Type:** Pixelify Sans for page headings (32–40px), section headings
  (22–26px), window titles and short buttons. Geist Mono for navigation
  (15.5px), labels and body text (17px, line height 1.6, 66ch measure; 16.5px
  on phones). Noto Sans Thai covers Thai characters. Fonts are self-hosted
  from `src/fonts/` with their licenses.
- **Content container:** pages in the monitor sit in a centred 760px column
  beside a 272px stone sidebar, so text never stretches across the screen.
- **Ambient light:** the scene's warm light is amber (`#e9a35e`) and the
  screen's spill is a muted cream, both distinct from the `#f5d76e` hover
  highlight.

## Content rules

Drafts are marked with a dashed frame and a "Draft" tag, and all of them
disappear when `showDrafts` is off. The sample project is labelled as a sample
everywhere it appears. Photos and video are never pixelated.
