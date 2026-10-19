import type { Metadata } from "next";
import { RoleList } from "@/components/computer/RoleList";
import { leadership, professional } from "@/content/experience";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  const detailed = leadership.filter((r) => r.points.length || r.pending);
  const brief = leadership.filter((r) => !r.points.length && !r.pending);

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Experience</h1>
        <p className="page-lede">Product, strategy and consulting roles, plus the student organizations I help lead.</p>
      </header>

      <section aria-labelledby="pro-h" className="section">
        <h2 id="pro-h" className="section-title">Professional</h2>
        <RoleList roles={professional} />
      </section>

      <section aria-labelledby="lead-h" className="section">
        <h2 id="lead-h" className="section-title">Leadership & organizations</h2>
        <RoleList roles={detailed} />
        <ul className="compact-roles">
          {brief.map((r) => (
            <li key={r.org}>
              <strong>{r.org}</strong>
              <span>{r.title}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
