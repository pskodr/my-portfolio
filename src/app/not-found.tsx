import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="win lost">
      <h1 className="page-title">Nothing on the desk by that name</h1>
      <p className="page-lede">The link may be old, or the page may have moved.</p>
      <Link href="/" className="pbtn">
        <ArrowLeft size={16} aria-hidden />
        Back to desk
      </Link>
    </div>
  );
}
