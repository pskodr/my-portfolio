"use client";

import { usePathname } from "next/navigation";
import { Panel } from "@/components/ui/Panel";
import { getCreativeEntry } from "@/content/creative";

export function CreativeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = pathname.split("/")[2];
  const crumbs = [{ label: "Camera", href: "/creative" }];
  if (slug) crumbs.push({ label: getCreativeEntry(slug)?.title ?? "Entry", href: pathname });

  return (
    <Panel label="Content creation" crumbs={crumbs}>
      {children}
    </Panel>
  );
}
