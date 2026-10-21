# Design: the pixel-art desk

Owner brief, 2026-10-20. Replaces the earlier 3D bedroom and full-room concepts.

## Thesis

A close-up of a warm bedroom workspace at early evening, drawn as polished pixel art. The monitor is the focal point and
opens the professional portfolio. The objects around it carry the owner's
interests. The art is the scene; everything you read is crisp HTML.

## Scene

- **Canvas:** a fullscreen workspace, laid out per window by
  `src/components/desk/layout.ts`. The wall and desk surface are one wide plate
  that always reaches every edge (its light is radial around the monitor and
  settles to flat bands, so wherever the window crops it there is no seam).
  The monitor stays centred and sets the scale: as large as possible while
  every object stays fully visible below the shortcut bar. Spare width spreads
  the side objects outward (up to a cap, so the group stays together); in short
  windows the wall objects drop and the front objects move back before
  anything shrinks. Decorative wall, desk and floor crop freely; objects never
  do, and art is never stretched. The scale snaps to whole device pixels when
  that costs under 10%. Narrow, portrait or very short windows (under 820px
  wide, portrait, or under 480px tall) use the compact layout: the scene, only
  as tall as its objects, with every destination listed beneath. Phones in
  portrait use a stacked arrangement: jersey and racket on the wall above the
  monitor, the Poké Ball group, Pad Thai, headphones and the card in a row in front of the
  keyboard. The layout re-runs on any resize, rotation, zoom or toolbar change.
- **Monitor screen density:** portrait, name and "My Projects" from scale 1.5;
  below that (phones), portrait and name only. Text never shrinks past
  reading size.
- **Light:** one soft, neutral-gold wash of early-evening daylight from the
  window at the left, over wall and desk; a modest glow on the wall behind the monitor; the light
  bar's warm light rising a little up the wall; and the monitor's light on
  the desk just in front of it. Three bands at most per light, with short
  ordered (4x4) dithering only where bands meet. The wall has faint vertical
  panel seams (a dark line with a lit edge, every 96 art pixels). All of it stays lower in contrast and saturation than the objects,
  and nothing decorative is yellow or outlined, so it never reads as
  clickable.
  Shading is flat bands from short palette ramps, with thin 2x2 seams between
  them (`tone()` in `scripts/desk-art/lib.mjs`) and no per-pixel noise.
  Objects carry their own contact shadows on the desk, and the wall objects
  cast offset shadows. Every object has the same 1px darkened silhouette edge.
- **Palette:** a warm bedroom workspace: mushroom/taupe wall
  `#3d312a`–`#8a7565`, matte honey-wood desk `#40291b`–`#a87a53` (no
  reflections), dark felt mat.
  Colour comes only from the objects: Poké Ball red and white, Barça garnet
  and blue, racket sky blue, noodles and lime, plus the monitor's ivory
  screen. The notebook (slate) and pen (warm grey) stay muted.
- **Objects and labels** (each group is one destination, one keyboard stop
  and one shared outline):
  - Monitor, keyboard and mouse: "Explore my work".
  - Poké Ball, closed notebook and pen, front left: "Pokémon & Strategy".
  - Framed jersey (number 22, about 17% smaller than before) with a small
    soccer ball on a shallow ledge beneath, wall left: "Soccer & FC Barcelona".
  - Racket with a tennis ball in a small wall cup, wall right: "Tennis".
  - Headphones resting on a slim walnut stand (cups 20% shorter), right:
    "What I'm listening to". The stand's outline is quieter than the
    headphones'.
  - Pad Thai: "Food & Café Hopping". Welcome card: "Welcome guide".
  - Decoration: a narrow window with a simple dusk view and a light linen
    curtain, pinned to the left edge of the visible scene so it crops
    naturally, with one faint band of window light on the wall. It shows
    whenever it fits beside the jersey (hidden in the tightest layouts). No
    outline, label, cursor, hit area or keyboard stop. No person, plant,
    bed or other props.
- **Outlines:** a 1-art-pixel yellow ring with a dark ring outside it, so
  highlights read on light wall and wood as well as dark objects.
- **Layers:** the background plate (wall, desk surface, mat and the
  computer's shadows), a desk-front strip placed under the front objects, a
  flat floor, decoration, then one PNG per object with its own shadow, a
  yellow silhouette outline and a hit mask (`scripts/desk-art/`). Objects move with their
  shadows, outlines, hit masks and labels.

## Interaction

- **Hover / keyboard focus:** a 1-art-pixel `#F5D76E` outline around the active
  object and a Pixelify Sans label, placed so it never covers an object.
  Pointers hit-test the actual pixels. The monitor, keyboard and mouse are one
  "computer" group: hovering any of them outlines all three, with one label
  ("Explore my work") and one keyboard stop.
- **Monitor screen:** real HTML laid over the glass and sized in art pixels:
  a preview of Home. One group, centred below the title bar and about 84% of
  the screen's width: the framed portrait (4:5 crop, head and shoulders) on
  the left; the full name on two lines and the "My Projects" button,
  left-aligned, on the right.
- **Monitor → /work:** the desk scales toward the screen while the full-screen
  window grows out of the screen's rectangle (0.42s). It opens on Home.
- **Computer pages, one purpose each:** Home (who I am: portrait, name, bio
  with three phrases in bold and a one-time yellow underline under "product
  builder", then "Right now": one CMU education row and "Previously at" logos
  for Agoda and Accenture), Projects (my work), Résumé (qualifications and
  experience), Personal Interests (an index of the interest pages), Gallery
  (visual media; "Coming Soon :)" until there is some), Contact Me (ways to
  reach me). Home's actions are ranked:
  "My Projects" is the yellow primary button, "Read My Résumé" a standard
  button, and Personal Interests, Gallery and Contact Me quieter underlined
  links with a small yellow marker. The portrait keeps its 2:3 shape in a
  stepped frame on a paper mat, beside the introduction on wide columns and
  above it on narrow ones.
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

The desk keeps its own muted, warm palette; every
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
