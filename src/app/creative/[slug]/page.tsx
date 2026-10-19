import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { creativeEntries, getCreativeEntry } from "@/content/creative";

export function generateStaticParams() {
  return creativeEntries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/creative/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getCreativeEntry(slug)?.title ?? "Creative work" };
}

const fields = [
  ["audience", "Audience"],
  ["goal", "Goal"],
  ["direction", "Creative direction"],
  ["contribution", "My contribution"],
  ["results", "Results"],
] as const;

export default async function CreativeEntryPage({ params }: PageProps<"/creative/[slug]">) {
  const { slug } = await params;
  const e = getCreativeEntry(slug);
  if (!e) notFound();
  const filled = fields.filter(([k]) => e[k]);

  return (
    <article className="stack">
      <header className="page-head">
        <h1 className="page-title">{e.title}</h1>
        <p className="project-meta">
          {e.client} · {e.format} · {e.status === "published" ? "Published" : "Experiment"}
        </p>
        <p className="page-lede">{e.summary}</p>
        {e.link && (
          <p className="link-row">
            <a href={e.link} target="_blank" rel="noreferrer" className="button button-quiet">
              View the original <ExternalLink size={15} aria-hidden />
            </a>
          </p>
        )}
      </header>

      {e.media.length > 0 ? (
        <div className="shots">
          {e.media.map((m) =>
            m.type === "image" ? (
              <Image key={m.src} src={m.src} alt={m.alt} width={1200} height={1500} className="shot" />
            ) : (
              <video key={m.src} src={m.src} poster={m.poster} controls preload="metadata" className="shot" aria-label={m.title} />
            ),
          )}
        </div>
      ) : (
        <EmptyState title="The work itself is on its way">
          Posts, graphics and clips will appear here once they&apos;re added.
        </EmptyState>
      )}

      {filled.length > 0 && (
        <div className="cs-sections">
          {filled.map(([k, label]) => (
            <section key={k} className="cs-section">
              <h2 className="cs-heading">{label}</h2>
              <div className="cs-body">
                <p>{e[k]}</p>
              </div>
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
