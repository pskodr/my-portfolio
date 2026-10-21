// Prepares the organisation logos shown on the Résumé. The originals in
// assets/logos/ are kept untouched (see ASSET_CREDITS.md for sources); this
// writes trimmed, web-sized copies to public/media/logos/. Logos are never
// pixelated or recoloured: they are only cropped to the mark where a full
// wordmark could not be read at badge size, trimmed and resized.
//
//   node scripts/build-logos.mjs
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "assets", "logos");
const out = join(root, "public", "media", "logos");
mkdirSync(out, { recursive: true });

const SIZE = 192; // the longest side; badges show at about 48px, so this is sharp at 4x

const logos = [
  { id: "accenture", file: "accenture-logo.png", trim: 12 },
  { id: "agoda", file: "agoda-logo.png", trim: 12 },
  { id: "ucc", file: "ucc-logo.png", trim: 12 },
  // White wordmark on CMU red: trimming the red leaves the wordmark, shown on
  // a red badge.
  { id: "cmu", file: "cmu-logo.png", trim: 30 },
  // OvertureXL: the heart-and-shield mark from the left of the site's logo
  // (the same mark as its favicon); the wordmark is unreadable at 48px.
  { id: "overturexl", file: "overturexl-logo.png", extract: { left: 0, top: 0, width: 1900, height: 1720 }, trim: 1 },
  // Animal Health Experts: the dog illustration from the left of the site's
  // header logo.
  { id: "animalhealthexperts", file: "animalhealthexperts-logo.jpg", extract: { left: 0, top: 0, width: 150, height: 292 }, trim: 18 },
];

for (const l of logos) {
  let img = sharp(join(src, l.file));
  if (l.extract) img = sharp(await img.extract(l.extract).png().toBuffer());
  const trimmed = await img.trim({ threshold: l.trim }).png().toBuffer();
  const info = await sharp(trimmed)
    .resize({ width: SIZE, height: SIZE, fit: "inside", withoutEnlargement: true })
    .png()
    .toFile(join(out, `${l.id}.png`));
  console.log(`${l.id}: ${info.width}x${info.height}`);
}
