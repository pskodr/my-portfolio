import type { Metadata } from "next";
import { Draft } from "@/components/ui/Draft";
import { ProjectList } from "@/components/work/ProjectList";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  const apps = projects.filter((p) => p.kind === "app" && !p.sample);

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Projects</h1>
        <p className="page-lede">
          Product work written up as case studies: the problem, the decisions, and what happened.
        </p>
      </header>

      <ProjectList projects={projects} />

      {apps.length === 0 && (
        <Draft title="Apps and Lambda Phi Epsilon content projects">
          <p>Apps I build and content projects will be added here as they&apos;re ready, each with its status, demo and source.</p>
        </Draft>
      )}
    </div>
  );
}
