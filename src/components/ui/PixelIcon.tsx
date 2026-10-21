/* eslint-disable @next/next/no-img-element -- tiny SVGs drawn on a 16px grid. */

// One of the 16x16 pixel icons from scripts/build-icons.mjs, shown at a whole
// multiple of its grid so every icon shares the same pixel scale. Decorative:
// the text beside it carries the meaning.
export function PixelIcon({ name }: { name: string }) {
  return <img className="pixel-icon" src={`/media/icons/${name}.svg`} width={16} height={16} alt="" aria-hidden />;
}
