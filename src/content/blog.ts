// Blog posts. The Blogs menu entry stays hidden until at least one post exists.
// `body` is a list of paragraphs; a line starting with "## " becomes a heading.

export type Post = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  body: string[];
  hidden?: boolean;
};

export const posts: Post[] = [];

export const publishedPosts = posts.filter((p) => !p.hidden);
export const getPost = (slug: string) => publishedPosts.find((p) => p.slug === slug);
