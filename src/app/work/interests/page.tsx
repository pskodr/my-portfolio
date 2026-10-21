import type { Metadata } from "next";
import Link from "next/link";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { interestsCaption, visibleDestinations } from "@/content/destinations";

export const metadata: Metadata = { title: "Personal Interests" };

// An index of the interest pages: icon, title, one line, arrow. Each row is
// one link; the pages themselves hold the content.
export default function InterestsPage() {
  const interests = visibleDestinations.filter((d) => d.group === "beyond");

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Personal Interests</h1>
        <p className="page-lede">{interestsCaption}</p>
      </header>

      <ul className="icon-list">
        {interests.map((d) => (
          <li key={d.id}>
            <Link href={d.href} scroll={false} className="icon-row">
              {d.icon && <PixelIcon name={d.icon} />}
              <span className="icon-row-text">
                <span className="icon-row-title">{d.title}</span>
                {d.summary && <span className="icon-row-note">{d.summary}</span>}
              </span>
              <span className="icon-row-go" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
