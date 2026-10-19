import { ObjectNav } from "@/components/ui/ObjectNav";
import { profile } from "@/content/profile";

export default function Home() {
  return (
    <div className="intro">
      <h1 className="intro-name">{profile.name}</h1>
      <p className="intro-focus">{profile.focus}</p>
      <p className="intro-text">{profile.intro}</p>
      <h2 className="intro-hint">Explore the room</h2>
      <ObjectNav />
    </div>
  );
}
