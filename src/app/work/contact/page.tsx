import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { contactCaption, contactLinks } from "@/content/site";

export const metadata: Metadata = { title: "Contact Me" };

export default function ContactPage() {
  const links = contactLinks.filter((l) => !l.hidden);

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Contact me</h1>
        <p className="page-lede">{contactCaption}</p>
      </header>

      <ul className="icon-list">
        {links.map((l) => {
          const external = l.href.startsWith("http");
          return (
            <li key={l.label}>
              <a className="icon-row" href={l.href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                <PixelIcon name={l.icon} />
                <span className="icon-row-text">
                  <span className="icon-row-title">{l.label}</span>
                  <span className="icon-row-note icon-row-value">{l.value}</span>
                </span>
                <ArrowUpRight className="icon-row-go" size={18} aria-hidden />
                {external && <span className="sr-only">(opens in a new tab)</span>}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
