import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { kindLabels, type Project } from "@/content/projects";

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="project-list">
      {projects.map((p) => (
        <li key={p.slug}>
          <Link href={`/work/projects/${p.slug}`} scroll={false} className="project-row">
            <span className="project-row-main">
              <span className="project-row-meta">
                <span>{kindLabels[p.kind]}</span>
                {p.org && <span>{p.org}</span>}
                {p.timeline && <span>{p.timeline}</span>}
                {p.sample && <span className="tag-draft">Sample</span>}
              </span>
              <span className="project-row-title">{p.title}</span>
              <span className="project-row-summary">{p.summary}</span>
            </span>
            <ArrowRight size={18} aria-hidden className="project-row-arrow" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
