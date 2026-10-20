import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { publishedPosts } from "@/content/blog";

export const metadata: Metadata = { title: "Blogs" };

export default function BlogIndex() {
  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">Blogs</h1>
        <p className="page-lede">Notes on products, building, and what I&apos;m learning.</p>
      </header>
      {publishedPosts.length === 0 ? (
        <p className="section-text">No posts yet.</p>
      ) : (
        <ul className="project-list">
          {publishedPosts.map((p) => (
            <li key={p.slug}>
              <Link href={`/work/blog/${p.slug}`} scroll={false} className="project-row">
                <span className="project-row-main">
                  <span className="project-row-meta">
                    <time dateTime={p.date}>{p.date}</time>
                  </span>
                  <span className="project-row-title">{p.title}</span>
                  <span className="project-row-summary">{p.summary}</span>
                </span>
                <ArrowRight size={18} aria-hidden className="project-row-arrow" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
