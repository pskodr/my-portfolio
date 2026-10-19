---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Home: the Room

Scope: the homepage room (`src/app/page.tsx`) and the persistent room shell that hosts every section (`src/app/layout.tsx`, `src/components/room/*`). Section pages render as HTML panels over the room.
Mode: Experience. The room is the work; the interface recedes.

Audience and job: recruiters reach work, résumé, and contact within seconds; curious visitors explore the owner's interests through objects.
Proof on hand: the Agoda routing case study and roles from the résumé. Apps are not built yet; interest pages, the gallery, and socials are mostly placeholders the owner will fill.
Constraints: the owner pinned the art direction (see PRODUCT.md). No GPA, no phone number, no invented apps, metrics, rankings, history, titles, or links. No autoplay audio, no mandatory intro. WebGL fallback is required.

## Direction contract

THESIS: The visitor steps into the owner's bedroom: a dark charcoal 3D diorama where four real objects (desk and monitor, ball and Barça jersey, Pikachu plush and Switch, camera) are the navigation. It refuses the hero-over-project-cards portfolio and the "3D for its own sake" demo: every object leads somewhere, and every destination is readable HTML.

OWN-WORLD: Charcoal plaster walls (#2a2b2f), smoked oak floor, wool rug, matte fabrics, set in soft low light. Colour enters only through the objects: Barça blaugrana (#a50044 / #004d98), Pikachu yellow (#f2c94c), and cool monitor light (#a9c7ff) spilling across the desk. The HTML layer is near-black, glass-free panels (#121316) with bone text (#ecebe6), one clean grotesk, and hairline dividers. HTML focus uses the monitor's cool white; 3D hover lifts each object in its own colour; never neon.

STORY: The visitor reads the name and product focus, sees "Explore the room", hovers the monitor and gets a label, clicks, and the camera eases to the desk while a desktop-style window opens with Projects, Experience, Résumé, and Socials & Contact. They read the Agoda case study, go back to the room, and wander to the jersey, the plush, or the camera. Recruiters can skip all of it through the Work / About / Résumé / Contact menu.

FIRST VIEWPORT: The full room in a three-quarter cutaway fills the right two-thirds at 1440×900: the left wall carries the window and two frames; the bed sits in the back-left corner with the plush and Switch; the jersey hangs on the back wall between bed and desk with the ball on the floor below it (kept off the rug so the pair reads as one soccer object); the desk with the seated avatar, glowing monitor, shelf and tower sits on the back-right; the camera on its tripod stands front-left by the nightstand, in profile, because front-right would put its back to the viewer. The name, product focus, intro and the object list sit left-centre over the darkest part of the room (the window wall), not top-left, so they read against the scrim and leave the top for the menu. Top-right: the discreet menu. On mobile the camera reframes to the object band between the intro and a full-width labelled object list.

FORM: Interactive diorama, pinned by the owner's brief. No roll by rule: new-work.md, 'A user- or brief-pinned decision beats the roll, always' and 'a direction the user or brief pinned' reads the mode file instead of running concept-seed. seed: none (owner-pinned direction, roll skipped by rule). Signature interaction: hover or focus lifts an object faintly in its own colour and shows a label; click eases the camera to that object (about 0.7s, interruptible) and slides in its HTML panel; "Back to room" or browser Back reverses it. Monitor light and a faint screen shimmer are the only ambient motion, and both stop under reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Character reference for the avatar (a clearly replaceable stylised figure ships now).
- Real content for apps, interests, the gallery, socials, the résumé PDF, and photos.
- Missing models and textures are listed in ROOM_ASSETS.md.
