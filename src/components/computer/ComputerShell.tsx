"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AtSign, Briefcase, FileText, FolderKanban, Monitor } from "lucide-react";
import { Panel } from "@/components/ui/Panel";
import { getProject } from "@/content/projects";

export const apps = [
  { href: "/computer/projects", label: "Projects", hint: "Case studies and apps", Icon: FolderKanban },
  { href: "/computer/experience", label: "Experience", hint: "Roles and leadership", Icon: Briefcase },
  { href: "/computer/resume", label: "Résumé", hint: "The one-page summary", Icon: FileText },
  { href: "/computer/contact", label: "Socials & Contact", hint: "Email, LinkedIn and more", Icon: AtSign },
];

function crumbsFor(pathname: string) {
  const crumbs = [{ label: "Computer", href: "/computer" }];
  const app = apps.find((a) => pathname.startsWith(a.href));
  if (app) crumbs.push({ label: app.label, href: app.href });
  const slug = pathname.split("/")[3];
  if (app?.href === "/computer/projects" && slug) {
    crumbs.push({ label: getProject(slug)?.title ?? "Project", href: pathname });
  }
  return crumbs;
}

// A desktop-style window, echoing the monitor in the room: a launcher list on
// the desktop, and a sidebar of the four apps inside each one. It persists
// between apps.
export function ComputerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const atDesktop = pathname === "/computer";

  // On the desktop the main list is the launcher, so the sidebar steps aside;
  // inside an app the sidebar switches between apps.
  return (
    <Panel label="Computer" variant="screen" crumbs={crumbsFor(pathname)}>
      <div className={atDesktop ? "os is-desktop" : "os"}>
        {!atDesktop && (
        <nav aria-label="Computer" className="os-side">
          <Link href="/computer" scroll={false} className="os-side-home">
            <Monitor size={16} aria-hidden />
            Desktop
          </Link>
          <ul>
            {apps.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link href={href} scroll={false} aria-current={pathname.startsWith(href) ? "page" : undefined}>
                  <Icon size={17} aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        )}
        <div className="os-content">{children}</div>
      </div>
    </Panel>
  );
}
