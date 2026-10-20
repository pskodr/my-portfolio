import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { contactLinks } from "@/content/site";

export const metadata: Metadata = { title: "Contact Me" };

export default function ContactPage() {
  const links = contactLinks.filter((l) => !l.hidden);

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Contact me</h1>
        <p className="page-lede">
          Email is the fastest way to reach me. I&apos;m happy to talk about product roles, projects, or anything on the desk.
        </p>
      </header>

      <ul className="contact-list">
        {links.map((l) => {
          const external = l.href.startsWith("http");
          return (
            <li key={l.label}>
              <a className="contact-row" href={l.href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                <span className="contact-label">{l.label}</span>
                <span className="contact-value">{l.value}</span>
                <ArrowUpRight size={18} aria-hidden />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
