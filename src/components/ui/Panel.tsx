"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";

// A large, centred pixel-framed window that opens over the desk for an
// interest. It has a title bar with "Back to desk" and close, closes on
// Escape, and moves focus to its heading whenever it's shown.
export function Panel({
  children,
  title,
  file,
  accent,
}: {
  children: React.ReactNode;
  title: string;
  file: string;
  accent?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Pages stay mounted (hidden) between visits, so re-run this whenever the
    // window becomes visible again.
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      el.querySelector(".cwin-scroll")?.scrollTo({ top: 0 });
      const h1 = el.querySelector("h1");
      h1?.setAttribute("tabindex", "-1");
      h1?.focus({ preventScroll: true });
    });
    io.observe(el);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && el.checkVisibility()) router.push("/", { scroll: false });
    };
    window.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [router]);

  return (
    <section ref={ref} aria-label={title} className="win cwin" data-accent={accent}>
      <div className="win-bar">
        <Link href="/" scroll={false} className="pbtn pbtn-quiet pbtn-sm">
          <ArrowLeft size={15} aria-hidden />
          Back to desk
        </Link>
        <span className="win-title">{file}</span>
        <Link href="/" scroll={false} className="win-close" aria-label="Close">
          <X size={16} aria-hidden />
        </Link>
      </div>
      <div className="cwin-scroll">{children}</div>
    </section>
  );
}
