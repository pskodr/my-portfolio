import Link from "next/link";
import { HelpButton, WelcomeWindow } from "@/components/desk/Welcome";
import { deskObjects, shortcuts } from "@/content/destinations";
import { profile } from "@/content/site";

export default function Desk() {
  const listed = deskObjects.filter((o) => o.href);

  return (
    <>
      <h1 className="sr-only">{profile.name}: portfolio</h1>
      <header className="bar">
        <nav aria-label="Shortcuts">
          <ul className="bar-links">
            {shortcuts.map((s) => (
              <li key={s.href}>
                <Link href={s.href} scroll={false} className="pbtn pbtn-scene">
                  {s.label}
                </Link>
              </li>
            ))}
            <li>
              <HelpButton />
            </li>
          </ul>
        </nav>
      </header>

      <div className="home-sheet">
        <WelcomeWindow />

        {/* Touch screens have no hover, so every object is also listed with
            its label. */}
        <nav aria-label="On the desk" className="desk-list">
          <h2 className="desk-list-title">On the desk</h2>
          <ul>
            {listed.map((o) => (
              <li key={o.id}>
                <Link href={o.href!} scroll={false} className="win desk-list-item">
                  <span className="desk-list-name">{o.name}</span>
                  <span className="desk-list-label">{o.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
