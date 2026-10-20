import type { Metadata } from "next";
import Link from "next/link";
import { Draft } from "@/components/ui/Draft";
import { visibleDestinations } from "@/content/destinations";
import { education } from "@/content/experience";
import { profile } from "@/content/site";

export const metadata: Metadata = { title: "About Me" };

export default function AboutPage() {
  const beyond = visibleDestinations.filter((d) => d.group === "beyond");

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">About me</h1>
        <p className="page-lede">{profile.intro}</p>
      </header>

      <Draft title="A longer bio">
        <p>How I got into product, in my own words. Photos to come.</p>
      </Draft>

      <section aria-labelledby="now-h" className="section">
        <h2 id="now-h" className="section-title">
          Right now
        </h2>
        <dl className="kv">
          <div>
            <dt>Studying</dt>
            <dd>
              {education.degree}, {profile.school} ({education.period})
            </dd>
          </div>
          <div>
            <dt>Teaching</dt>
            <dd>Teaching Assistant for Database Design & Development at CMU Heinz College</dd>
          </div>
          <div>
            <dt>Most recently</dt>
            <dd>Technical Product Management Intern at Agoda, on the AI voice automation team</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="beyond-h" className="section">
        <h2 id="beyond-h" className="section-title">
          Beyond work
        </h2>
        <ul className="chip-list">
          {beyond.map((d) => (
            <li key={d.id}>
              <Link href={d.href} scroll={false} className="pbtn pbtn-sm">
                {d.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
