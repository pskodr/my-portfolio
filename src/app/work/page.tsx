import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Draft } from "@/components/ui/Draft";
import { education } from "@/content/experience";
import { profile } from "@/content/site";

export const metadata: Metadata = { title: "Home" };

// Who I am, and where to go next. Projects live on Projects; detailed
// education and work history live on Résumé.
export default function WorkHome() {
  return (
    <div className="stack">
      <header className="home-hero">
        <figure className="portrait">
          {profile.photo ? (
            <Image
              src={profile.photo.src}
              alt={profile.photo.alt}
              width={profile.photo.width}
              height={profile.photo.height}
              sizes="(max-width: 819px) 160px, 280px"
              priority
            />
          ) : (
            <span className="portrait-empty">Photo to come</span>
          )}
        </figure>

        <div className="home-intro">
          <h1 className="page-title">{profile.name}</h1>
          <p className="page-lede">{profile.intro}</p>

          <nav aria-label="Explore" className="home-actions">
            <p className="link-row">
              <Link href="/work/projects" scroll={false} className="pbtn pbtn-primary">
                My Projects <span aria-hidden>→</span>
              </Link>
              <Link href="/work/resume" scroll={false} className="pbtn">
                Read My Résumé
              </Link>
            </p>
            <ul className="quiet-links">
              <li>
                <Link href="/work/interests" scroll={false}>
                  Personal Interests
                </Link>
              </li>
              <li>
                <Link href="/work/gallery" scroll={false}>
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/work/contact" scroll={false}>
                  Contact Me
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

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

      <Draft title="A longer bio">
        <p>How I got into product, in my own words.</p>
      </Draft>
    </div>
  );
}
