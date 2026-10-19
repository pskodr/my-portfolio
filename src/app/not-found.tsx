import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="lost">
      <h1 className="page-title">Nothing in the room by that name</h1>
      <p className="page-lede">The link may be old, or the page may have moved.</p>
      <Link href="/" className="back-link">
        <ArrowLeft size={16} aria-hidden />
        Back to room
      </Link>
    </div>
  );
}
