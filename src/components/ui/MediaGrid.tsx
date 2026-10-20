import Image from "next/image";
import { getMedia } from "@/content/media";

// Photos and videos at their natural look (never pixelated), lazy-loaded,
// each with its caption, context and my part in it.
export function MediaGrid({ ids, label = "Media" }: { ids: string[]; label?: string }) {
  const items = getMedia(ids);
  if (!items.length) return null;
  return (
    <ul className="media-grid" aria-label={label}>
      {items.map((m) => (
        <li key={m.id}>
          <figure className="media">
            {m.type === "image" ? (
              <Image src={m.src} alt={m.alt} width={m.width} height={m.height} sizes="(max-width: 820px) 100vw, 480px" />
            ) : (
              <video src={m.src} poster={m.poster} width={m.width} height={m.height} controls preload="none" aria-label={m.alt} />
            )}
            {(m.caption || m.context || m.contribution) && (
              <figcaption>
                {m.caption && <span className="media-caption">{m.caption}</span>}
                {m.context && <span className="media-meta">{m.context}</span>}
                {m.contribution && <span className="media-meta">My part: {m.contribution}</span>}
              </figcaption>
            )}
          </figure>
        </li>
      ))}
    </ul>
  );
}
