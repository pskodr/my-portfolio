import type { Metadata } from "next";
import { Download } from "lucide-react";
import { awards, education, leadership, professional, skills, type Role } from "@/content/experience";
import { primaryEmail, resumePdf } from "@/content/site";

export const metadata: Metadata = { title: "Résumé" };

function Roles({ roles }: { roles: Role[] }) {
  return (
    <ol className="roles">
      {roles.map((r) => (
        <li key={r.org} className="role">
          <div className="role-head">
            <h3 className="role-org">{r.org}</h3>
            {r.period && <span className="role-period">{r.period}</span>}
          </div>
          <p className="role-title">{r.title}</p>
          {r.points.length > 0 && (
            <ul className="bullets">
              {r.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
          {r.pending && <p className="role-pending">{r.pending}</p>}
        </li>
      ))}
    </ol>
  );
}

export default function ResumePage() {
  const detailed = leadership.filter((r) => r.points.length || r.pending);
  const brief = leadership.filter((r) => !r.points.length && !r.pending);

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Résumé</h1>
        <p className="page-lede">Product, strategy and consulting roles, plus the student organizations I help lead.</p>
        {resumePdf ? (
          <p className="link-row">
            <a href={resumePdf} download className="pbtn pbtn-primary">
              <Download size={16} aria-hidden />
              Download PDF
            </a>
          </p>
        ) : (
          <p className="note">
            Want a PDF copy? Email <a href={primaryEmail.href}>{primaryEmail.value}</a> and I&apos;ll send one.
          </p>
        )}
      </header>

      <section aria-labelledby="xp-h" className="section">
        <h2 id="xp-h" className="section-title">
          Experience
        </h2>
        <Roles roles={professional} />
      </section>

      <section aria-labelledby="lead-h" className="section">
        <h2 id="lead-h" className="section-title">
          Leadership
        </h2>
        <Roles roles={detailed} />
        <ul className="compact-roles">
          {brief.map((r) => (
            <li key={r.org}>
              <strong>{r.org}</strong>
              <span>{r.title}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="edu-h" className="section">
        <h2 id="edu-h" className="section-title">
          Education
        </h2>
        <dl className="kv">
          <div>
            <dt>School</dt>
            <dd>{education.school}</dd>
          </div>
          <div>
            <dt>Degree</dt>
            <dd>{education.degree}</dd>
          </div>
          <div>
            <dt>Graduation</dt>
            <dd>{education.period}</dd>
          </div>
          <div>
            <dt>Coursework</dt>
            <dd>{education.coursework.join(", ")}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="sk-h" className="section">
        <h2 id="sk-h" className="section-title">
          Skills
        </h2>
        <dl className="kv">
          {skills.map((s) => (
            <div key={s.group}>
              <dt>{s.group}</dt>
              <dd>{s.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="aw-h" className="section">
        <h2 id="aw-h" className="section-title">
          Competitions & awards
        </h2>
        <ul className="bullets">
          {awards.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
