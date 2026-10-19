"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { apps } from "./ComputerShell";

// The desktop as a file-browser list, like the window drawn on the monitor.
export function DesktopIcons() {
  return (
    <ul className="file-list">
      {apps.map(({ href, label, hint, Icon }) => (
        <li key={href}>
          <Link href={href} scroll={false} className="file-row">
            <Icon size={20} aria-hidden className="file-row-icon" />
            <span className="file-row-name">{label}</span>
            <span className="file-row-kind">{hint}</span>
            <ChevronRight size={16} aria-hidden className="file-row-chev" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
