import { home, profile } from "@/content/site";

// The bio with a few phrases in bold. The first emphasised phrase also gets a
// yellow underline that draws in once when the page appears (static under
// reduced motion). Plain text throughout, so it stays selectable.
export function Bio() {
  const pattern = new RegExp(`(${home.emphasis.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  const parts = profile.intro.split(pattern);
  return (
    <p className="page-lede bio">
      {parts.map((part, i) =>
        (home.emphasis as readonly string[]).includes(part) ? (
          <strong key={i} className={part === home.emphasis[0] ? "bio-mark" : undefined}>
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </p>
  );
}
