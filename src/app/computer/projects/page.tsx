import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { apps, caseStudies, experiments } from "@/content/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Projects</h1>
        <p className="page-lede">Product work written up as case studies, and the apps I build.</p>
      </header>

      <section aria-labelledby="cs-h" className="section">
        <h2 id="cs-h" className="section-title">Case studies</h2>
        <ul className="project-list">
          {caseStudies.map((p) => (
            <li key={p.slug}>
              <Link href={`/computer/projects/${p.slug}`} scroll={false} className="project-row">
                <span className="project-row-main">
                  <span className="project-row-title">{p.title}</span>
                  <span className="project-row-meta">
                    {p.org} · {p.period}
                  </span>
                  <span className="project-row-summary">{p.summary}</span>
                </span>
                <ArrowRight size={18} aria-hidden className="project-row-arrow" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="apps-h" className="section">
        <h2 id="apps-h" className="section-title">Apps</h2>
        {apps.length === 0 ? (
          <EmptyState title="No apps shipped yet">
            The first ones are in progress. Each will appear here with screenshots, its status, and demo and source links.
          </EmptyState>
        ) : (
          <ul className="project-list">
            {apps.map((a) => (
              <li key={a.slug}>
                <Link href={`/computer/projects/${a.slug}`} scroll={false} className="project-row">
                  <span className="project-row-main">
                    <span className="project-row-title">{a.title}</span>
                    <span className="project-row-meta">{a.status}</span>
                    <span className="project-row-summary">{a.summary}</span>
                  </span>
                  <ArrowRight size={18} aria-hidden className="project-row-arrow" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="exp-h" className="section section-quiet">
        <h2 id="exp-h" className="section-title">Experiments</h2>
        {experiments.length === 0 ? (
          <p className="muted">Ideas I&apos;m exploring will be listed here once they&apos;re written up.</p>
        ) : (
          <ul className="plain-list">
            {experiments.map((e) => (
              <li key={e.title}>
                <strong>{e.title}</strong> {e.note}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
