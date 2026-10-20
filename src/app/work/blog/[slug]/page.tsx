import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPost, publishedPosts } from "@/content/blog";

// Cache Components needs at least one param; "_" stands in until a post exists.
export function generateStaticParams() {
  return publishedPosts.length ? publishedPosts.map((p) => ({ slug: p.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/work/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return { title: getPost(slug)?.title ?? "Post" };
}

export default async function PostPage({ params }: PageProps<"/work/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="stack">
      <Link href="/work/blog" scroll={false} className="crumb-back">
        <ArrowLeft size={15} aria-hidden />
        All posts
      </Link>
      <header className="page-head">
        <h1 className="page-title">{post.title}</h1>
        <p className="project-row-meta">
          <time dateTime={post.date}>{post.date}</time>
        </p>
      </header>
      <div className="prose">
        {post.body.map((para, i) =>
          para.startsWith("## ") ? <h2 key={i}>{para.slice(3)}</h2> : <p key={i}>{para}</p>,
        )}
      </div>
    </article>
  );
}
