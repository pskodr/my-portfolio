"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { visibleDestinations, type Destination } from "@/content/destinations";

const work = visibleDestinations.filter((d) => d.group === "work");
const beyond = visibleDestinations.filter((d) => d.group === "beyond");

function NavList({ items, pathname }: { items: Destination[]; pathname: string }) {
  return (
    <ul>
      {items.map((d) => {
        const current = pathname === d.href || pathname.startsWith(`${d.href}/`);
        return (
          <li key={d.id}>
            <Link href={d.href} scroll={false} aria-current={current ? "page" : undefined}>
              <span className="term-caret" aria-hidden>
                &gt;
              </span>
              {d.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// The monitor, full screen: a terminal-flavoured window around readable pages.
// Navigation is all clickable; nothing needs typing.
export function WorkShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const path = `~/workspace${pathname.replace(/^\/work/, "")}`;

  useEffect(() => {
    const scroller = ref.current?.querySelector(".term-content");
    scroller?.scrollTo({ top: 0 });
    const h1 = scroller?.querySelector("h1");
    if (h1) {
      h1.setAttribute("tabindex", "-1");
      h1.focus({ preventScroll: true });
    }
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ref.current?.checkVisibility()) router.push("/", { scroll: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div ref={ref} className="term">
      <header className="win-bar term-bar">
        <Link href="/" scroll={false} className="pbtn pbtn-quiet pbtn-sm">
          <ArrowLeft size={15} aria-hidden />
          Back to desk
        </Link>
        <p className="win-title term-path" aria-hidden>
          {path}
        </p>
      </header>
      <div className="term-body">
        <nav className="term-nav" aria-label="Portfolio">
          <Link href="/work" scroll={false} className="term-home" aria-current={pathname === "/work" ? "page" : undefined}>
            ~/workspace
          </Link>
          <NavList items={work} pathname={pathname} />
          <p className="term-group">Beyond work</p>
          <NavList items={beyond} pathname={pathname} />
        </nav>
        <div className="term-content">{children}</div>
      </div>
    </div>
  );
}
