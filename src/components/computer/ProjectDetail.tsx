import Image from "next/image";
import { ExternalLink } from "lucide-react";
import {
  caseStudySectionTitles,
  type CaseStudySection,
  type Project,
} from "@/content/projects";

const order: CaseStudySection[] = [
  "problem",
  "audience",
  "role",
  "constraints",
  "research",
  "decisions",
  "tradeoffs",
  "solution",
  "outcomes",
  "learnings",
];

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

// One layout for both case studies and apps. Only filled-in sections render.
export function ProjectDetail({ project }: { project: Project }) {
  const sections = order.filter((k) => project.sections[k]);

  return (
    <article className="stack project">
      <header className="page-head">
        <h1 className="page-title">{project.title}</h1>
        <p className="project-meta">
          {project.kind === "case-study" ? `${project.org} · ${project.period}` : <span className="status">{project.status}</span>}
        </p>
        <p className="page-lede">{project.summary}</p>
        <ul className="tags" aria-label="Tags">
          {project.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </header>

      {project.kind === "app" && (project.demoUrl || project.sourceUrl) && (
        <p className="link-row">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer" className="button">
              Open demo <ExternalLink size={15} aria-hidden />
            </a>
          )}
          {project.sourceUrl && (
            <a href={project.sourceUrl} target="_blank" rel="noreferrer" className="button button-quiet">
              View source <ExternalLink size={15} aria-hidden />
            </a>
          )}
        </p>
      )}

      {project.kind === "app" && project.screenshots.length > 0 && (
        <div className="shots">
          {project.screenshots.map((s) => (
            <Image key={s.src} src={s.src} alt={s.alt} width={1200} height={750} className="shot" />
          ))}
        </div>
      )}

      <div className="cs-sections">
        {sections.map((k) => (
          <section key={k} className="cs-section" aria-labelledby={`cs-${k}`}>
            <h2 id={`cs-${k}`} className="cs-heading">
              {caseStudySectionTitles[k]}
            </h2>
            <div className="cs-body">
              <Body value={project.sections[k]!} />
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
