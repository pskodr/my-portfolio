import { showDrafts } from "@/content/site";

// A clearly marked placeholder for content that hasn't been supplied yet.
// Renders nothing once drafts are turned off in content/site.ts.
export function Draft({ title, children }: { title: string; children?: React.ReactNode }) {
  if (!showDrafts) return null;
  return (
    <div className="draft">
      <p className="draft-title">
        <span className="tag-draft">Draft</span>
        {title}
      </p>
      {children && <div className="draft-text">{children}</div>}
    </div>
  );
}
