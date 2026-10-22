import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MediaGrid } from "@/components/ui/MediaGrid";
import { OrgLogo } from "@/components/ui/OrgLogo";
import { CaseStudySections, ProjectedImpact } from "@/components/work/CaseStudy";
import { getProject, kindLabels, projects, sectionTitles, statusLabels, type Section } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getProject(slug)?.title ?? "Project" };
}

const order = Object.keys(sectionTitles) as Section[];

function Body({ value }: { value: string | string[] }) {
  if (Array.isArray(value)) {
    return (
      <ul className="bullets">
        {value.map((v) => (
          <li key={v}>{v}</li>
        ))}
      </ul>
    );
  }
  return <p>{value}</p>;
}

export default async function ProjectPage({ params }: PageProps<"/work/projects/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const study = p.caseStudy;
  const sections = order.filter((k) => p.sections[k]);

  return (
    <article className="stack">
      <Link href="/work/projects" scroll={false} className="crumb-back">
        <ArrowLeft size={15} aria-hidden />
        All projects
      </Link>

      {p.sample && (
        <p className="sample-note" role="note">
          Sample entry. It demonstrates the layout and isn&apos;t real work.
        </p>
      )}

      <header className="page-head">
        {p.tags.length > 0 && (
          <p className="tags">
            {p.tags.map((t, i) => (
              <span key={t} className="tag" data-tone={i % 3}>
                {t}
              </span>
            ))}
          </p>
        )}
        <div className="project-title-row">
          {p.logo && <OrgLogo id={p.logo} />}
          <h1 className="page-title">{p.title}</h1>
        </div>
        <p className="page-lede">{study?.intro ?? p.summary}</p>
      </header>

      <section aria-label="At a glance" className="glance">
        <dl className="facts-row">
          {study?.role && (
            <div>
              <dt>Role</dt>
              <dd>{study.role}</dd>
            </div>
          )}
          {!study && (
            <div>
              <dt>Type</dt>
              <dd>{kindLabels[p.kind]}</dd>
            </div>
          )}
          {p.org && (
            <div>
              <dt>Organization</dt>
              <dd>{p.org}</dd>
            </div>
          )}
          {p.timeline && (
            <div>
              <dt>Timeline</dt>
              <dd>{p.timeline}</dd>
            </div>
          )}
          <div>
            <dt>Status</dt>
            <dd className="status" data-status={p.status}>
              {statusLabels[p.status]}
            </dd>
          </div>
        </dl>
        {study?.projected && <ProjectedImpact projected={study.projected} />}
      </section>

      {p.links.length > 0 && (
        <p className="link-row">
          {p.links.map((l, i) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={i ? "pbtn" : "pbtn pbtn-primary"}>
              {l.label}
              <ArrowUpRight size={15} aria-hidden />
            </a>
          ))}
        </p>
      )}

      <MediaGrid ids={p.media} label="Project media" />

      {study ? (
        <CaseStudySections study={study} />
      ) : (
        <div className="cs-sections">
          {sections.map((k) => (
            <section key={k} className="cs-section" aria-labelledby={`cs-${k}`}>
              <h2 id={`cs-${k}`} className="cs-heading">
                {sectionTitles[k]}
              </h2>
              <div className="cs-body">
                <Body value={p.sections[k]!} />
              </div>
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
