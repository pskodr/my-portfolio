import type { Metadata } from "next";
import { Draft } from "@/components/ui/Draft";
import { Panel } from "@/components/ui/Panel";
import { songs } from "@/content/music";

export const metadata: Metadata = { title: "Music" };

export default function MusicPage() {
  return (
    <Panel title="What I'm listening to" file="music.txt" accent="sky">
      <div className="reading">
        <article className="reading-main">
          <header className="page-head">
            <h1 className="page-title">What I&apos;m listening to</h1>
            <p className="page-lede">Songs I keep coming back to.</p>
          </header>
          <ol className="song-list">
            {songs.map((s) => (
              <li key={s.title}>
                <span className="song-title" lang={/[฀-๿]/.test(s.title) ? "th" : undefined}>
                  {s.title}
                </span>
                <span className="song-artist">{s.artist}</span>
              </li>
            ))}
          </ol>
          <Draft title="Players and album artwork">
            <p>Each song will get its official Spotify player once the exact recordings are verified.</p>
          </Draft>
        </article>
      </div>
    </Panel>
  );
}
