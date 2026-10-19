import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { contactLinks, type ContactLink } from "@/content/profile";

export const metadata: Metadata = { title: "Socials & Contact" };

function Row({ link }: { link: ContactLink }) {
  const text = (
    <span className="contact-text">
      <span className="contact-label">{link.label}</span>
      <span className="contact-value">{link.value}</span>
    </span>
  );
  if (!link.href) {
    return <div className="contact-row is-placeholder">{text}</div>;
  }
  const external = link.href.startsWith("http");
  return (
    <a
      className="contact-row"
      href={link.href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {text}
      <ArrowUpRight size={18} aria-hidden />
    </a>
  );
}

export default function ContactPage() {
  const contact = contactLinks.filter((l) => l.group === "contact");
  const social = contactLinks.filter((l) => l.group === "social");

  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Socials & Contact</h1>
        <p className="page-lede">Email is the fastest way to reach me. I&apos;m happy to talk about product roles, projects, or anything in this room.</p>
      </header>

      <section aria-labelledby="c-h" className="section">
        <h2 id="c-h" className="section-title">Contact</h2>
        <ul className="contact-list">
          {contact.map((l) => (
            <li key={l.label}>
              <Row link={l} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="s-h" className="section section-quiet">
        <h2 id="s-h" className="section-title">Socials</h2>
        <ul className="contact-list">
          {social.map((l) => (
            <li key={l.label}>
              <Row link={l} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
