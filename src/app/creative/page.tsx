import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { creativeEntries, type CreativeEntry } from "@/content/creative";

export const metadata: Metadata = { title: "Content creation" };

// Entries with media show as gallery cards; entries still waiting on their
// media show as plain rows, so the page never fills up with empty frames.
function Entry({ e }: { e: CreativeEntry }) {
  const cover = e.media.find((m) => m.type === "image");
  if (cover) {
    return (
      <Link href={`/creative/${e.slug}`} scroll={false} className="gallery-card">
        <span className="media-slot">
          <Image src={cover.src} alt={cover.alt} width={600} height={750} className="shot" />
        </span>
        <span className="gallery-title">{e.title}</span>
        <span className="gallery-meta">
          {e.client} · {e.format}
        </span>
        <span className="gallery-summary">{e.summary}</span>
      </Link>
    );
  }
  return (
    <Link href={`/creative/${e.slug}`} scroll={false} className="project-row">
      <span className="project-row-main">
        <span className="project-row-title">{e.title}</span>
        <span className="project-row-meta">
          {e.client} · {e.format} · work being added
        </span>
        <span className="project-row-summary">{e.summary}</span>
      </span>
      <ArrowRight size={18} aria-hidden className="project-row-arrow" />
    </Link>
  );
}

function Group({ entries }: { entries: CreativeEntry[] }) {
  const withMedia = entries.filter((e) => e.media.length);
  const without = entries.filter((e) => !e.media.length);
  return (
    <>
      {withMedia.length > 0 && (
        <ul className="gallery">
          {withMedia.map((e) => (
            <li key={e.slug}>
              <Entry e={e} />
            </li>
          ))}
        </ul>
      )}
      {without.length > 0 && (
        <ul className="project-list">
          {without.map((e) => (
            <li key={e.slug}>
              <Entry e={e} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function CreativePage() {
  const published = creativeEntries.filter((e) => e.status === "published");
  const experiments = creativeEntries.filter((e) => e.status === "experiment");

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Content creation</h1>
        <p className="page-lede">
          Social content for Lambda Phi Epsilon, plus my own podcast and videos. Each piece will cover who it was for, the goal, the creative direction, what I did, and how it landed.
        </p>
      </header>

      <section aria-labelledby="pub-h" className="section">
        <h2 id="pub-h" className="section-title">Published</h2>
        <Group entries={published} />
      </section>

      <section aria-labelledby="exp-h" className="section section-quiet">
        <h2 id="exp-h" className="section-title">Experiments</h2>
        <Group entries={experiments} />
      </section>
    </div>
  );
}
