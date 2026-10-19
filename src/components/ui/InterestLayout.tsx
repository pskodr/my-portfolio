import Image from "next/image";
import type { InterestPage } from "@/content/interests";

function Body({ body }: { body: string | string[] }) {
  const paras = Array.isArray(body) ? body : [body];
  return (
    <div className="cs-body">
      {paras.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

// Shared layout for personal-interest pages. Written sections render in full;
// unwritten ones collapse into a single honest outline instead of a stack of
// empty rows, so the page reads as complete with very little content.
export function InterestLayout({ page }: { page: InterestPage }) {
  const written = page.sections.filter((s) => s.body);
  const toWrite = page.sections.filter((s) => !s.body);

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">{page.title}</h1>
        <p className="page-lede">{page.lede}</p>
        {page.facts.length > 0 && (
          <ul className="facts" aria-label="Quick facts">
            {page.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
      </header>

      {written.length > 0 && (
        <div className="interest-sections">
          {written.map((s) => (
            <section key={s.title} className="interest-section">
              <h2>{s.title}</h2>
              <Body body={s.body!} />
            </section>
          ))}
        </div>
      )}

      {page.photos.length > 0 && (
        <ul className="photo-grid" aria-label="Photos">
          {page.photos.map((p) => (
            <li key={p.src}>
              <Image src={p.src} alt={p.alt} width={800} height={600} className="shot" />
            </li>
          ))}
        </ul>
      )}

      {(toWrite.length > 0 || page.future.length > 0) && (
        <section aria-labelledby="outline-h" className="outline">
          <h2 id="outline-h" className="outline-title">
            What this page will cover
          </h2>
          <p className="outline-note">I&apos;m writing these up in my own words. Photos are on the way too.</p>
          <ul className="outline-list">
            {toWrite.map((s) => (
              <li key={s.title}>{s.title}</li>
            ))}
            {page.future.map((f) => (
              <li key={f.title}>
                {f.title}
                <span>{f.note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
