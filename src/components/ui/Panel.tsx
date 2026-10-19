"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Crumb = { label: string; href?: string };

// Every destination opens in a panel over the room. It always offers
// "Back to room", closes on Escape, and moves focus to its heading on arrival.
// The entrance is a CSS animation, so the panel is visible even before hydration.
export function Panel({
  children,
  crumbs = [],
  variant = "default",
  accent,
  label,
}: {
  children: React.ReactNode;
  crumbs?: Crumb[];
  variant?: "default" | "screen";
  accent?: "pika" | "barca";
  label: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const h1 = ref.current?.querySelector("h1");
    if (h1) {
      h1.setAttribute("tabindex", "-1");
      h1.focus({ preventScroll: true });
    }
    ref.current?.querySelectorAll(".panel-scroll, .os-content").forEach((el) => el.scrollTo({ top: 0 }));
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/", { scroll: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <section ref={ref} aria-label={label} className={`panel panel-${variant}`} data-accent={accent}>
      <div className="panel-bar">
        <Link href="/" scroll={false} className="back-link">
          <ArrowLeft size={16} aria-hidden />
          Back to room
        </Link>
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="crumbs">
            <ol>
              {crumbs.map((c, i) => (
                <li key={i}>
                  {c.href && i < crumbs.length - 1 ? (
                    <Link href={c.href} scroll={false}>
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current={i === crumbs.length - 1 ? "page" : undefined}>{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
      <div className="panel-scroll">{children}</div>
    </section>
  );
}
