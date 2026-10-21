import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { OrgLogo } from "@/components/ui/OrgLogo";
import { Bio } from "@/components/work/Bio";
import { home, profile } from "@/content/site";

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
          <Bio />

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
        <div className="home-edu">
          <OrgLogo id={home.education.logo} />
          <p>{home.education.text}</p>
        </div>

        <h3 className="home-prev-title">Previously at</h3>
        <ul className="home-prev">
          {home.previouslyAt.map((id) => (
            <li key={id}>
              <OrgLogo id={id} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
