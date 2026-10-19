import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Panel } from "@/components/ui/Panel";
import { education } from "@/content/experience";
import { profile } from "@/content/profile";
import { roomObjects } from "@/content/room";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  const rooms = roomObjects.filter((o) => o.id !== "avatar");

  return (
    <Panel label="About" crumbs={[{ label: "About" }]}>
      <div className="stack">
        <header className="page-head">
          <h1 className="page-title">{profile.name}</h1>
          <p className="page-lede">{profile.intro}</p>
        </header>

        <EmptyState title="A longer bio is on its way">
          The story behind how I got into product, in my own words.
        </EmptyState>

        <section aria-labelledby="now-h" className="section">
          <h2 id="now-h" className="section-title">Right now</h2>
          <dl className="kv">
            <div>
              <dt>Studying</dt>
              <dd>{education.degree}, {profile.school} ({education.period})</dd>
            </div>
            <div>
              <dt>Teaching</dt>
              <dd>Teaching Assistant for Database Design & Development at CMU Heinz College</dd>
            </div>
            <div>
              <dt>Most recently</dt>
              <dd>Technical Product Management Intern at Agoda, on the AI voice automation team</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="room-h" className="section">
          <h2 id="room-h" className="section-title">About this room</h2>
          <p className="cs-body">
            Everything here is something I care about. The computer holds my work; the rest is what I do when I&apos;m not working.
          </p>
          <ul className="project-list">
            {rooms.map((o) => (
              <li key={o.id}>
                <Link href={o.href} scroll={false} className="project-row">
                  <span className="project-row-main">
                    <span className="project-row-title">{o.label}</span>
                    <span className="project-row-summary">{o.hint}</span>
                  </span>
                  <ArrowRight size={18} aria-hidden className="project-row-arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Panel>
  );
}
