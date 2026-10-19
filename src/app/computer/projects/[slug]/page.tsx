import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/computer/ProjectDetail";
import { allProjects, getProject } from "@/content/projects";

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/computer/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getProject(slug)?.title ?? "Project" };
}

export default async function ProjectPage({ params }: PageProps<"/computer/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
