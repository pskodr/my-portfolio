import type { Metadata } from "next";
import Link from "next/link";
import { ProjectList } from "@/components/work/ProjectList";
import { projects } from "@/content/projects";
import { primaryEmail, profile } from "@/content/site";

export const metadata: Metadata = { title: "Work" };

export default function WorkHome() {
  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">{profile.name}</h1>
        <p className="page-lede">{profile.intro}</p>
        <p className="link-row">
          <Link href="/work/resume" scroll={false} className="pbtn pbtn-primary">
            Read my résumé
          </Link>
          <a href={primaryEmail.href} className="pbtn">
            Email me
          </a>
        </p>
      </header>

      <section aria-labelledby="recent-h" className="section">
        <h2 id="recent-h" className="section-title">
          Projects
        </h2>
        <ProjectList projects={projects} />
      </section>
    </div>
  );
}
