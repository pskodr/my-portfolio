import type { Metadata } from "next";
import { Download } from "lucide-react";
import { OrgLogo } from "@/components/ui/OrgLogo";
import { awards, education, leadership, professional, resumeCaption, skills, type Role } from "@/content/experience";
import { resumeFilename, resumePdf, showDrafts } from "@/content/site";

export const metadata: Metadata = { title: "Résumé" };

function Roles({ roles }: { roles: Role[] }) {
  return (
    <ol className="roles">
      {roles.map((r) => (
        <li key={r.org} className="role">
          {r.logo ? <OrgLogo id={r.logo} /> : <span />}
          <div className="role-body">
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
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function ResumePage() {
  const detailed = leadership.filter((r) => r.points.length);
  const brief = leadership.filter((r) => !r.points.length);

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Résumé</h1>
        <p className="page-lede">{resumeCaption}</p>
        {resumePdf ? (
          <p className="link-row">
            <a href={resumePdf} download={resumeFilename} type="application/pdf" className="pbtn pbtn-primary pbtn-lg">
              <Download size={18} aria-hidden />
              Download Résumé
            </a>
          </p>
        ) : (
          showDrafts && (
            <p className="link-row">
              <span className="pbtn pbtn-lg" aria-disabled="true">
                <Download size={18} aria-hidden />
                Download Résumé
              </span>
              <span className="tag-draft">Draft: PDF not added yet</span>
            </p>
          )
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
        <div className="role edu">
          <OrgLogo id={education.logo} />
          <div className="role-body">
            <div className="role-head">
              <h3 className="role-org">{education.school}</h3>
              <span className="role-period">{education.period}</span>
            </div>
            <p className="edu-degree">{education.degree}</p>
            <p className="role-title">{education.colleges}</p>
            <div className="edu-courses">
              <h4>Relevant coursework</h4>
              <ul>
                {education.coursework.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="sk-h" className="section">
        <h2 id="sk-h" className="section-title">
          Skills
        </h2>
        <div className="skill-groups">
          {skills.map((s) => (
            <div key={s.group} className="skill-group">
              <h3>{s.group}</h3>
              <ul className="skill-chips">
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
