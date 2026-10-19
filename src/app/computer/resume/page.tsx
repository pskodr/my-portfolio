import type { Metadata } from "next";
import { Download } from "lucide-react";
import { awards, education, professional, skills } from "@/content/experience";
import { primaryEmail, profile, resumePdf } from "@/content/profile";

export const metadata: Metadata = { title: "Résumé" };

export default function ResumePage() {
  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Résumé</h1>
        <p className="page-lede">
          {profile.name} · {profile.focus}
        </p>
        {resumePdf ? (
          <p className="link-row">
            <a href={resumePdf} download className="button">
              <Download size={16} aria-hidden />
              Download PDF
            </a>
          </p>
        ) : (
          <p className="note">
            A PDF version is on its way. Until then, email{" "}
            <a href={primaryEmail.href}>{primaryEmail.value}</a> and I&apos;ll send a copy.
          </p>
        )}
      </header>

      <section aria-labelledby="edu-h" className="section">
        <h2 id="edu-h" className="section-title">Education</h2>
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

      <section aria-labelledby="xp-h" className="section">
        <h2 id="xp-h" className="section-title">Experience</h2>
        <dl className="kv">
          {professional.map((r) => (
            <div key={r.org}>
              <dt>{r.period}</dt>
              <dd>
                <strong>{r.org}</strong>, {r.title}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="sk-h" className="section">
        <h2 id="sk-h" className="section-title">Skills</h2>
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
        <h2 id="aw-h" className="section-title">Competitions & awards</h2>
        <ul className="bullets">
          {awards.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
