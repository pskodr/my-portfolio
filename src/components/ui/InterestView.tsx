import type { Interest } from "@/content/interests";
import { getMedia } from "@/content/media";
import { showDrafts } from "@/content/site";
import { Draft } from "./Draft";
import { MediaGrid } from "./MediaGrid";

// Text in a comfortable reading column; media and what's coming sit beside it
// on wide screens. With nothing for the side, the text column stands alone.
export function InterestView({ page, children }: { page: Interest; children?: React.ReactNode }) {
  const hasMedia = getMedia(page.media).length > 0;
  const hasPlanned = showDrafts && page.planned.length > 0;

  return (
    <div className="reading" data-aside={hasMedia || hasPlanned || undefined}>
      <article className="reading-main">
        <header className="page-head">
          <h1 className="page-title">{page.title}</h1>
          <p className="page-lede">{page.lede}</p>
        </header>
        {page.body.length > 0 && (
          <div className="prose">
            {page.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        )}
        {children}
      </article>

      {(hasMedia || hasPlanned) && (
        <aside className="reading-aside" aria-label="Photos and what's coming">
          <MediaGrid ids={page.media} label={`${page.title}: photos and videos`} />
          {hasPlanned && (
            <Draft title="Coming to this page">
              <ul className="planned">
                {page.planned.map((f) => (
                  <li key={f.title}>
                    <strong>{f.title}</strong>
                    <span>{f.note}</span>
                  </li>
                ))}
              </ul>
            </Draft>
          )}
        </aside>
      )}
    </div>
  );
}
