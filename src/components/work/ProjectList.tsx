import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { OrgLogo } from "@/components/ui/OrgLogo";
import { statusLabels, type Project } from "@/content/projects";

// Project rows: tags, the organisation's logo beside the title, a short
// description, quieter metadata, and a "View case study" cue. Each row is one
// link. Tags are labels, not controls.
export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="project-list">
      {projects.map((p) => (
        <li key={p.slug}>
          <Link href={`/work/projects/${p.slug}`} scroll={false} className="project-row">
            {p.tags.length > 0 && (
              <span className="tags">
                {p.tags.map((t, i) => (
                  <span key={t} className="tag" data-tone={i % 3}>
                    {t}
                  </span>
                ))}
                {p.sample && <span className="tag-draft">Sample</span>}
              </span>
            )}
            <span className="project-row-head">
              {p.logo && <OrgLogo id={p.logo} />}
              <span className="project-row-title">{p.title}</span>
            </span>
            <span className="project-row-summary">{p.summary}</span>
            <span className="project-row-foot">
              <span className="project-row-meta">
                {p.org && <span>{p.org}</span>}
                {p.timeline && <span>{p.timeline}</span>}
                <span>{statusLabels[p.status]}</span>
              </span>
              <span className="project-row-go">
                {p.kind === "case-study" ? "View case study" : "View project"}
                <ArrowRight size={16} aria-hidden />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
