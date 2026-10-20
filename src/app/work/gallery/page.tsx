import type { Metadata } from "next";
import { Draft } from "@/components/ui/Draft";
import { MediaGrid } from "@/components/ui/MediaGrid";
import { collections } from "@/content/gallery";
import { showDrafts } from "@/content/site";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  const shown = collections.filter((c) => !c.hidden && (showDrafts || c.media.length > 0));

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Gallery</h1>
        <p className="page-lede">Photos, graphics and videos, with what each was for and the part I played.</p>
      </header>

      {shown.map((c) => (
        <section key={c.slug} aria-labelledby={`g-${c.slug}`} className="section">
          <h2 id={`g-${c.slug}`} className="section-title">
            {c.title}
          </h2>
          <p className="section-text">{c.summary}</p>
          {(c.context || c.contribution) && (
            <dl className="kv">
              {c.context && (
                <div>
                  <dt>For</dt>
                  <dd>{c.context}</dd>
                </div>
              )}
              {c.contribution && (
                <div>
                  <dt>My part</dt>
                  <dd>{c.contribution}</dd>
                </div>
              )}
            </dl>
          )}
          {c.media.length > 0 ? (
            <MediaGrid ids={c.media} label={c.title} />
          ) : (
            <Draft title="Work being added">
              <p>Posts, graphics and clips will appear here.</p>
            </Draft>
          )}
        </section>
      ))}
    </div>
  );
}
