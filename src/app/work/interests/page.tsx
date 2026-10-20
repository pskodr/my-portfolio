import type { Metadata } from "next";
import Link from "next/link";
import { deskObjects, visibleDestinations } from "@/content/destinations";

export const metadata: Metadata = { title: "Personal Interests" };

// An index of the interest pages. Each entry reuses the label of its object
// on the desk; the pages themselves hold the content.
export default function InterestsPage() {
  const interests = visibleDestinations
    .filter((d) => d.group === "beyond")
    .map((d) => ({ ...d, object: deskObjects.find((o) => o.href === d.href) }));

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Personal Interests</h1>
        <p className="page-lede">What I love outside work. Each one also sits on the desk.</p>
      </header>

      <ul className="interest-list">
        {interests.map((d) => (
          <li key={d.id}>
            <Link href={d.href} scroll={false} className="interest-row">
              <span className="interest-title">{d.title}</span>
              {d.object && (
                <span className="interest-meta">
                  {d.object.label} · on the desk: {d.object.name}
                </span>
              )}
              <span className="interest-go" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
