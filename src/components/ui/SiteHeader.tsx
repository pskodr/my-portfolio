"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/content/profile";
import { siteNav } from "@/content/room";

export function SiteHeader() {
  const pathname = usePathname();
  const home = pathname === "/";

  return (
    <header className={home ? "site-header" : "site-header is-solid"}>
      <Link href="/" className={home ? "brand is-home" : "brand"} aria-label={`${profile.name}, back to the room`}>
        {profile.shortName}
      </Link>
      <nav aria-label="Site">
        <ul className="site-nav">
          {siteNav.map((item) => {
            const current = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link href={item.href} aria-current={current ? "page" : undefined} scroll={false}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
