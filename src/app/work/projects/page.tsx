import type { Metadata } from "next";
import { ProjectList } from "@/components/work/ProjectList";
import { kindLabels, projects, type ProjectKind } from "@/content/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  // One section per kind, in the order of kindLabels; empty kinds are hidden.
  const groups = (Object.keys(kindLabels) as ProjectKind[])
    .map((kind) => ({ kind, items: projects.filter((p) => p.kind === kind) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Projects</h1>
      </header>

      {groups.map((g) => (
        <section key={g.kind} aria-labelledby={`pk-${g.kind}`} className="section">
          <h2 id={`pk-${g.kind}`} className="section-title">
            {kindLabels[g.kind]}
          </h2>
          <ProjectList projects={g.items} />
        </section>
      ))}
    </div>
  );
}
