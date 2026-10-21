/* eslint-disable @next/next/no-img-element -- small, pre-sized logo files. */
import { logos, type LogoId } from "@/content/logos";

// A round badge holding an organisation's logo, whole: the logo is scaled so
// its corners sit inside the circle, with a little clear space, so nothing is
// cropped. Logos keep their own colours and are never pixelated.
const CLEAR = 0.82; // the share of the diameter the logo's diagonal may use

export function OrgLogo({ id }: { id: LogoId }) {
  const l = logos[id];
  const width = (CLEAR / Math.hypot(1, l.height / l.width)) * 100;
  return (
    <span className="org-logo" style={{ background: l.bg }}>
      <img src={l.src} alt={l.alt} width={l.width} height={l.height} style={{ width: `${width}%` }} loading="lazy" />
    </span>
  );
}
