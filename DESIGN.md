---
name: Phasakorn Chivatxaranukul · Portfolio
description: A dark charcoal bedroom diorama in 3D where real objects are the navigation, and every destination is a readable HTML panel.
colors:
  ink-black: "#0d0e10"
  panel-charcoal: "#121316"
  raised-charcoal: "#1a1c20"
  hairline: "rgb(236 235 230 / 0.12)"
  hairline-strong: "rgb(236 235 230 / 0.22)"
  bone: "#ecebe6"
  bone-dim: "#b6b4ad"
  ash: "#8b8a84"
  monitor-cool: "#a9c7ff"
  monitor-cool-hover: "#c2d7ff"
  pika-yellow: "#f2c94c"
  barca-blue-lifted: "#6f9fe0"
  room-plaster: "#56575c"
  room-plaster-side: "#5a5b60"
  room-oak: "#43362d"
  room-walnut: "#2c2522"
  room-desk-oak: "#4a3a2f"
  room-rug-wool: "#3d3b39"
  room-duvet: "#3a4350"
  room-linen: "#8a867f"
  room-curtain: "#3b3a38"
  room-hardware: "#1c1d20"
  room-screen-black: "#0f1012"
  room-night-glass: "#121a2b"
  jersey-blau: "#004d98"
  jersey-grana: "#a50044"
  jersey-pinstripe: "#edbb00"
  plush-yellow: "#f6d24f"
  light-ceiling: "#ecdfcc"
  light-lamp: "#ffb46b"
  light-bed-spill: "#ffcf8f"
  light-moon: "#9fb2e0"
  light-key: "#d9d4cc"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(30px, 3vw, 40px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.022em"
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(26px, 2.4vw, 34px)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.018em"
  title:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 650
    lineHeight: 1.3
  lede:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  body-long:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.3
  meta:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  focus: "6px"
  chip: "9px"
  card: "12px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 2.6vw, 32px)"
  header: "64px"
  header-mobile: "56px"
  stack: "40px"
  section: "14px"
  row: "18px"
  panel-top: "36px"
  panel-bottom: "72px"
components:
  button-primary:
    backgroundColor: "{colors.monitor-cool}"
    textColor: "{colors.ink-black}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.monitor-cool-hover}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  back-link:
    textColor: "{colors.bone}"
    rounded: "{rounded.pill}"
    padding: "0 15px 0 12px"
    height: "40px"
  site-nav-item:
    textColor: "{colors.bone-dim}"
    rounded: "{rounded.pill}"
    padding: "7px 13px"
  site-nav-item-active:
    textColor: "{colors.bone}"
  object-link:
    textColor: "{colors.bone}"
    rounded: "{rounded.card}"
    padding: "7px 12px 7px 8px"
    height: "48px"
  panel:
    backgroundColor: "{colors.panel-charcoal}"
    textColor: "{colors.bone}"
    width: "50vw"
  object-label:
    backgroundColor: "{colors.ink-black}"
    textColor: "{colors.bone}"
    rounded: "{rounded.chip}"
    padding: "7px 11px 8px"
  os-side-item:
    textColor: "{colors.bone-dim}"
    rounded: "{rounded.chip}"
    padding: "0 12px"
    height: "40px"
  file-row:
    textColor: "{colors.bone}"
    padding: "10px 12px"
    height: "64px"
  tag:
    textColor: "{colors.bone-dim}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  empty-state:
    textColor: "{colors.bone}"
    rounded: "{rounded.card}"
    padding: "18px 20px"
---

# Design System: Phasakorn Chivatxaranukul · Portfolio

## Overview

**Creative North Star: "The Lamplit Room"**

The site is the owner's bedroom at night, built as a three-quarter cutaway diorama in React Three Fiber and held at an angled, mostly fixed camera. Charcoal plaster, smoked oak, a wool rug and matte fabrics sit in soft low light from a ceiling fill, a warm desk lamp and nightstand lamp, moonlight through the window, and the cool spill of the monitor. Colour enters the room only through the objects the visitor can use: the blaugrana jersey, the yellow plush, the cool monitor. Everything else is muted so those objects read as the navigation.

Over the room sits a quiet HTML layer: near-black, glass-free panels with bone text, one grotesk, and hairline dividers. Every object leads to a panel that is ordinary, readable, linkable HTML; the 3D never carries content the HTML does not also carry. The monitor's cool white is the HTML layer's single accent, so focus, links and the active state all feel lit by the same screen. Interest pages swap that accent for their object's own colour.

The system is dense but calm: a recruiter can skip the room entirely through the menu, and nothing moves unless the visitor asks it to.

**Key Characteristics:**
- A real room as the navigation; four objects plus the seated figure, each with one destination.
- Low, warm-and-cool practical lighting; colour only from the objects.
- Flat near-black HTML panels with 1px hairlines, no shadows, no blur.
- One variable grotesk (Schibsted Grotesk) at weights 400 to 700, including 550 and 650.
- One accent per panel: monitor-cool by default, the object's colour on interest pages.
- Motion only on request (hover, click, back); a faint monitor shimmer is the only ambient movement.

## Colors

A charcoal-and-bone neutral field, with colour carried by three objects and one cool screen light.

### Primary
- **Monitor Cool** (`monitor-cool`): The light of the screen. In 3D it is the monitor's spill light and the PC tower's LED; in HTML it is the accent: focus outline, text selection, the primary button, the product-focus line under the name, active sidebar icons, bullet dashes, link and row hover. Its hover step is **Monitor Cool Hover** (`monitor-cool-hover`), used only on the primary button. Translucent tints of it (7% to 12% fill, 28% to 45% border) mark lit and hovered rows.

### Secondary
- **Pika Yellow** (`pika-yellow`): The Pokémon panel's accent, set by swapping the panel's accent variable. Its 3D source is the plush (`plush-yellow`).
- **Barça Blue, Lifted** (`barca-blue-lifted`): The soccer panel's accent, a lifted tint of the jersey's blau so it reads on near-black. Its 3D source is the jersey stripes (`jersey-blau`, `jersey-grana`) with a gold pinstripe (`jersey-pinstripe`) at each seam.

### Neutral
- **Ink Black** (`ink-black`): The page, the WebGL clear colour, the fog, the header strip, the object label fill (at 92%) and the text on Monitor Cool.
- **Panel Charcoal** (`panel-charcoal`): Every section panel, including the computer window.
- **Raised Charcoal** (`raised-charcoal`): Media frames in the creative gallery.
- **Bone** (`bone`): Primary text and headings.
- **Bone Dim** (`bone-dim`): Secondary text: ledes, summaries, nav items at rest, label column headings.
- **Ash** (`ash`): Meta text, dates, kinds, chevrons, placeholder values.
- **Hairline** (`hairline`) and **Hairline Strong** (`hairline-strong`): Bone at 12% and 22%. Hairline divides rows and panel edges; Hairline Strong outlines pill controls, tags, and the dashed placeholder frames.

### The room palette
- **Plaster** (`room-plaster`, `room-plaster-side`): The back and left walls, a procedural speckled plaster at roughness 0.95. Lit low, they render as charcoal.
- **Smoked Oak** (`room-oak`): Midpoint of the procedural plank floor (hue 24, 16 to 24% saturation, 19 to 25% lightness, dark seams), roughness 0.72.
- **Walnut and Desk Oak** (`room-walnut`, `room-desk-oak`): Bed frame, nightstand, shelf and the desk top.
- **Wool, Duvet, Linen, Curtain** (`room-rug-wool`, `room-duvet`, `room-linen`, `room-curtain`): Matte fabrics at roughness 1, each with a seeded noise texture. The rug carries a cream double border and a faint chevron field.
- **Hardware** (`room-hardware`): Desk legs, lamp arm, camera body, chair base; near-black with 0.4 to 0.6 metalness.
- **Screen Black** (`room-screen-black`) and **Night Glass** (`room-night-glass`): The monitor bezel and the window, which glows faintly blue (emissive #2a3c61 at 0.55).

### Lighting roles
- **Ambient and hemisphere:** ambient #b4b2ae at 0.7; hemisphere sky #9a9a9e over ground #2e2622 at 0.85. They hold the shadows open so nothing goes to pure black.
- **Ceiling fill** (`light-ceiling`): one warm point light just out of frame above the room centre.
- **Practical lamps** (`light-lamp`): the desk lamp and nightstand lamp, warm amber with a glowing shade or bulb.
- **Bed spill** (`light-bed-spill`): a short warm point over the bed so the plush's yellow lands.
- **Moonlight** (`light-moon`): the only shadow-casting light, through the window on the left wall, soft PCF shadows.
- **Key** (`light-key`): a soft spot from the open side of the diorama, full penumbra.
- **Monitor spill** (`monitor-cool`): a point light in front of the screen, intensity 3.2 at rest.

### Named Rules
**The Objects Carry the Colour Rule.** Architecture, furniture and fabrics stay muted (saturation low, roughness high). Saturated colour belongs only to the interactive objects and the monitor's light. A new object earns colour by being navigable.

**The One Accent Per Panel Rule.** A panel has exactly one accent: monitor-cool by default, or its object's colour on an interest page via the accent swap. Never mix two accents in one panel.

## Typography

**Display Font:** Schibsted Grotesk (with system-ui, sans-serif), loaded through next/font as a variable font.
**Body Font:** Schibsted Grotesk, the same family.

**Character:** One sturdy, slightly editorial grotesk carries everything; hierarchy comes from weight (400, 500, 550, 600, 650, 700) and tight negative tracking on large sizes, not from a second face.

### Hierarchy
- **Display** (700, clamp 30 to 40px, 1.05, -0.022em): The owner's name on the home view only; 26px on mobile. Balanced wrap.
- **Headline** (700, clamp 26 to 34px, 1.12, -0.018em): The one heading at the top of each panel. Balanced wrap.
- **Title** (650, 17 to 18px, 1.3): Row titles in lists (project rows, role organisations, gallery titles).
- **Lede** (400, 17px): The paragraph under a panel heading, in Bone Dim, max 60ch. The product-focus line under the name uses the same size at 550 in the accent.
- **Body** (400, 16px, 1.55): Base text. Long-form case-study and interest prose is **Body Long** (16px, 1.65, max 64ch).
- **Label** (600 to 650, 14 to 15px): Section titles (15px, 650, on a hairline), object and nav labels, button text, label columns (14px, 600, Bone Dim).
- **Meta** (400, 12.5 to 13.5px): Dates, kinds, hints, breadcrumbs and tags, in Ash. Dates use tabular numerals.

### Named Rules
**The Weight Not Face Rule.** Hierarchy is weight and size inside one family. Do not introduce a second typeface, uppercase labels, or wide letterspacing.

## Layout

**The room.** A fixed full-viewport stage sits behind everything. The HTML layer floats over it with pointer events passed through except on its own controls.

**Home.** The name, focus line, intro and the object list sit lower-left over the darkest part of the room (the window wall), on a 75-degree scrim from Ink Black at 82% to transparent by 52%. The intro is at most 380px wide; the intro text holds to 38ch. The menu is a pill in the top right; the brand is hidden at home.

**Sections.** Every destination opens a panel pinned to the right half (50vw, from below the 64px header to the bottom), with a 1px hairline on its left edge. The header becomes a solid Ink Black strip with a bottom hairline. The camera slides the frame so the focused object sits in the left half. Panel content scrolls inside the panel; padding is 36px top, the gutter on the sides, 72px bottom. Content stacks with 40px between blocks and 14px inside a section.

**The computer window.** Inside the computer panel, a 210px sticky sidebar of apps sits beside the open app. At the desktop root, the sidebar steps aside and the app list is the launcher.

**Label and body rows.** Case-study sections (150px label column), interest sections (200px), key-value rows (170px) and contact rows (150px) are two-column grids that collapse to one column when their container is narrower than 620px, via container queries on the panel and window content. A 1100px media query collapses case-study and interest rows as well.

**Mobile (below 820px).** The header drops to 56px and nav items tighten. The panel becomes full width. The scrim turns vertical (dark top for the name, dark bottom for the list). The intro pins the name and focus line to the top, hides the intro paragraph, and pushes "Explore the room" and the object list to the bottom as full-width filled rows (92% charcoal, hairline border, label left, hint right). The camera switches to a wider set of shots (fov 44 to 46) and lifts the overview room by 8% of the viewport height into the band between the two. The computer sidebar becomes a horizontal scrolling strip under the panel bar. Below 340px the object hints hide.

**Static fallback.** When WebGL is missing, the device reports under 2GB memory or under 2 cores, or `?static` is set, a rendered still of the room (separate desktop and mobile crops) stands in; it also covers loading and fades out once the canvas is drawn. Everything in the HTML layer works identically.

## Elevation & Depth

The HTML layer is flat: no box-shadows, no backdrop blur, no gradients on surfaces. Depth comes from tonal steps (Ink Black page, Panel Charcoal panel, Raised Charcoal media) and 1px hairlines. The only gradient is the legibility scrim over the room on the home view, which fades out when a panel opens.

All real depth lives in the room: perspective, soft PCF shadows from the moonlight, distance fog in Ink Black from 16 to 30 units, and the warm-against-cool light falloff.

### Named Rules
**The Depth Lives in the Room Rule.** The 3D scene owns light, shadow and perspective. HTML surfaces stay flat and opaque so text never sits on a moving picture.

## Shapes

Rounded rectangles and pills, softly cornered, never sharp. Controls that act (menu, back link, buttons, tags, facts, status) are full pills (999px). Containers and rows that hold content (object links, empty and outline frames, screenshots, media frames) use a 12px corner. Small chips inside controls (icon tiles, sidebar items, the 3D object label) use 9px. The focus ring rounds at 6px.

Placeholder content is the one place a border goes dashed: a 1px dashed Hairline Strong outline marks something the owner has not supplied yet. Solid hairlines mean real structure; dashed means "coming".

In the room, furniture and devices use rounded boxes with small radii; the plush, ball and figure are built from soft primitives.

## Components

### Buttons
Few and only when real. A button exists only for an action that works.
- **Shape:** full pill (999px), 44px tall, 18px side padding, 15px at 600.
- **Primary:** Monitor Cool fill with Ink Black text; hover steps to Monitor Cool Hover. Used for "Download PDF" (only once a PDF exists) and "Open demo".
- **Quiet:** transparent with a Hairline Strong border and Bone text; hover adds a 6% white fill. Used for secondary links such as "View source".
- **Back to room:** a 40px quiet pill with a left arrow, first item in every panel bar; Escape does the same.

### Site menu
- A single pill group (4px inset, hairline border, Ink Black at 70%) of Work, About, Résumé, Contact. Items are 14px at 500 in Bone Dim; hover goes to Bone on a 6% white fill; the current page holds Bone on a 10% white fill.

### Object list (home)
The keyboard, screen-reader and touch path into the room.
- Each row is a 48px link: a 9px-cornered icon tile (6% white, Bone Dim icon), label at 15px/600, hint at 13px in Ash.
- Hover or focus lights the row (Monitor Cool at 7% fill, 28% border; icon turns accent) and lights the matching object in 3D at the same time. The 3D hover lights the row back.
- Returning from a section puts focus back on the row that opened it.

### Object label (3D)
- A small tag pinned above each object: Ink Black at 92%, a 1px Monitor Cool border at 32%, 9px corners, name at 14px/600 and hint at 12px. It fades and rises 6px in over 0.18s on hover and is hidden from assistive tech (the object list carries the same text).

### Panel
- Panel Charcoal, full height under the header, 50vw on desktop, sliding in from 28px right with a fade over 0.36s. A bar on top holds Back to room and the breadcrumbs (13px, "/" separators in Hairline Strong, the current crumb truncated at 28ch). On arrival focus moves to the panel's heading.

### Computer window (signature)
A desktop-style window that echoes the screen drawn on the monitor.
- **Desktop:** a file-browser list. Each row is 64px with a 20px accent icon, the app name at 16px/600, its kind in Ash beneath, and a chevron that nudges 3px right and turns accent on hover; the row takes a 6% accent fill. Rows divide with hairlines.
- **Inside an app:** a 210px sidebar, sticky, with "Desktop" above a hairline and the four apps (Projects, Experience, Résumé, Socials & Contact) as 40px items with 9px corners. Hover is a 5% white fill; the current app takes a 12% accent fill with an accent icon.

### Lists
Content is lists, not cards.
- **Project rows:** title 18px/650, meta in Ash, summary in Bone Dim at 62ch, and a trailing arrow; on hover the title and arrow turn accent and the arrow moves 4px right. Hairline below each row.
- **Roles:** organisation 17px/650, period right-aligned in tabular Ash, title in the accent, accent-dash bullets in Bone Dim at 68ch.
- **Key-value and contact rows:** a fixed label column in Bone Dim and a value column, hairline between rows. Linked contact values turn accent on hover and carry an outward arrow.
- **Bullets:** an 8px by 1.5px accent dash, never a glyph.
- **Tags and facts:** hairline pills; facts lead with a 6px accent dot.

### Empty and outline states
- **Empty state:** a dashed 12px frame with a 16px/600 title saying what is coming and an optional line in Bone Dim. Used where a whole block is missing (no apps yet, a longer bio, the creative work itself).
- **Outline:** on interest pages, every unwritten section collapses into one dashed frame titled "What this page will cover", with the planned sections as a two-column list marked by small accent rings. Written sections render normally above it. The page reads as complete with little content.
- **Placeholder values:** contact rows without a link render as plain text (not a link) with the value "Link coming soon" in Ash. Creative entries without media render as plain list rows marked "work being added", never as empty frames.

### Focus
- Every focusable element gets a 2px accent outline at 3px offset with 6px rounding. Headings receiving programmatic focus show no ring. A skip link (accent pill) appears at the top-left on focus.

### The 3D hover
**The Own Colour Lift Rule.** On hover or keyboard focus, every surface of the object (minus the screen) glows faintly in its own colour: emissive becomes the material colour at 32%. Near-black materials whose lifted colour sums under 0.18 get a cool floor (0.06, 0.07, 0.10) so the monitor, tower and camera read as clearly as the bright objects. The monitor's spill light also rises from 3.2 to 6. The label appears and the cursor becomes a pointer. Nothing scales, moves or outlines.

### Camera and motion
- **Object inventory:** Computer (monitor) leads to the computer window; Ball & Barça jersey to Soccer; Pikachu & Switch to Pokémon; Camera to Content creation; the seated figure ("Me") to About. Each object has its own desktop and mobile shot.
- **Overview shot:** camera at (6.9, 5.5, 7.3) looking at the room centre, fov 31 on desktop; a wider, higher shot at fov 46 on mobile.
- **Easing:** an exponential approach (1 − e^(−5.5·dt) per frame), about 0.5s to 95% and 0.7s to settle, interruptible by any new focus. Position, target, fov and the desktop view offset all ease together. The first frame snaps.
- **HTML easing:** one curve, cubic-bezier(0.16, 1, 0.3, 1). Hover colour changes run 0.15s; chevrons and arrows 0.2s; the panel entrance 0.36s; label fades 0.18s; still-to-canvas crossfade 0.6s.

**The Still Room Rule.** The only ambient motion is the monitor spill light breathing (±0.12 on a slow sine). No floating, bobbing, spinning or particles. Under reduced motion the shimmer stops, the camera cuts instead of easing, and CSS transitions collapse to 0.01ms.

## Do's and Don'ts

### Do:
- **Do** make every new interactive object lead to one real, linkable HTML destination, and add it to the object list so it is reachable without the 3D.
- **Do** give new room furniture muted colour and high roughness (0.6 to 1); reserve saturated colour for objects the visitor can use.
- **Do** light hover in the object's own colour at 32% emissive, with the cool floor for near-black materials.
- **Do** keep each panel to one accent, swapping it for the object's colour on interest pages.
- **Do** build panel content as hairline-divided lists and label/body rows that collapse below 620px of container width.
- **Do** mark missing content with a dashed frame or "Link coming soon" in Ash, and say plainly what is coming.
- **Do** show a button only when its action works; the résumé download appears only once a PDF exists.

### Don't:
- **Don't** add neon, bloom, coloured outlines or glowing edges to objects; the only glows are the room's real light sources (lamps, monitor, window, LEDs).
- **Don't** add ambient animation beyond the monitor shimmer: no floating, bobbing, auto-rotating or particles.
- **Don't** add shadows, backdrop blur or translucent glass to HTML panels.
- **Don't** put content only in the 3D scene; the room is a way in, not the place content lives.
- **Don't** render placeholders as working links or buttons, or fill a page with empty media frames.
- **Don't** invent apps, metrics, users or achievements to fill a list; use an empty state.
- **Don't** add a second typeface, uppercase labels, or letterspaced small caps.
