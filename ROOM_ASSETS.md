# Room assets

The room is built in code (React Three Fiber) from primitives plus procedural
canvas textures, so it runs with no downloads. That's a solid base, but these
pieces would lift it from stylised diorama to finished artwork.

## Missing models (highest impact first)

| Asset | Now | Wanted | Where it plugs in |
|---|---|---|---|
| **You, seated** | Placeholder figure from capsules and spheres | A stylised character modelled from your reference photo (glTF/GLB, seated pose, ~10–20k tris) | `src/components/room/parts/Avatar.tsx`: swap the component body for `useGLTF("/room/avatar.glb")` |
| **Pikachu plush** | Primitive plush (spheres, cones, extruded tail) | A sculpted plush GLB with felt shading | `parts/Pokemon.tsx` → `Plush` |
| **Camera** | Box-and-cylinder mirrorless body | A modelled camera or camcorder GLB | `parts/VideoCamera.tsx` |
| **Desk chair, bed** | Rounded boxes | Modelled furniture with stitching and folds | `parts/Desk.tsx`, `parts/Architecture.tsx` |

Free starting points: Poly Pizza and Sketchfab (check each licence; CC-BY needs
credit), or commission a stylised character.

## Missing textures and images

- **Barça jersey:** stripes only. The crest and sponsor are trademarks, so they're left off on purpose. Add a number or name print of your own if you like.
- **Photo frames over the bed:** two empty frames, ready for your photos (put images in `public/room/` and map them in `parts/Architecture.tsx`).
- **Monitor screen:** a drawn desktop. Could become a real screenshot of the site's computer window.
- **Fabric normal maps** (duvet, plush felt, rug) would add depth at close range.

## Content still to come

Bio, project write-ups and screenshots, Pokémon and soccer write-ups, photos,
Lambda Phi Epsilon work, podcast and social links, a résumé PDF without your
phone number, and your confirmed GitHub account. Each has a marked placeholder;
edit the files in `src/content/`.

## Static fallback stills

`public/room/room-still.png` and `room-still-mobile.png` are renders of the
room itself, used while the 3D scene loads and when a device can't run it.
Re-render them whenever the room changes:

1. `NEXT_PUBLIC_REVIEW_HOOKS=1 npm run build && npm start`
2. Screenshot `http://localhost:3000/?capture` at 1600×1000 (desktop) and at
   390×844 @2x with mobile emulation (phone), and save over the two files.
3. Rebuild without `NEXT_PUBLIC_REVIEW_HOOKS` before deploying.
