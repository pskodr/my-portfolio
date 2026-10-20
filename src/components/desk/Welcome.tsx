"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { profile, welcome } from "@/content/site";

const KEY = "desk-welcome-dismissed";

// Runs before first paint (see layout.tsx) so returning visitors never see the
// window flash in and out. Open/closed lives on <html data-welcome>.
export const welcomeScript = `try{if(localStorage.getItem("${KEY}"))document.documentElement.dataset.welcome="closed"}catch(e){}`;

export function openWelcome() {
  delete document.documentElement.dataset.welcome;
  try {
    localStorage.removeItem(KEY);
  } catch {}
  requestAnimationFrame(() => document.getElementById("welcome-title")?.focus());
}

export function closeWelcome() {
  document.documentElement.dataset.welcome = "closed";
  try {
    localStorage.setItem(KEY, "1");
  } catch {}
  // Back to the card on the desk, which reopens the guide.
  document.getElementById("hotspot-card")?.focus();
}

// The guide that belongs to the little card on the desk. It opens on a first
// visit; closing it leaves the card, and clicking the card brings it back.
export function WelcomeWindow() {
  return (
    <section id="welcome" className="win welcome" aria-labelledby="welcome-title">
      <div className="win-bar">
        <span className="win-title">welcome.txt</span>
        <button type="button" className="win-close" onClick={closeWelcome} aria-label="Close the welcome guide">
          <X size={16} aria-hidden />
        </button>
      </div>
      <div className="welcome-body">
        <h2 id="welcome-title" className="welcome-name" tabIndex={-1}>
          {profile.name}
        </h2>
        <p className="welcome-intro">{profile.intro}</p>
        <p className="welcome-hint">{welcome.hint}</p>
        <div className="welcome-actions">
          <Link href="/work" scroll={false} className="pbtn pbtn-primary">
            {welcome.primary}
          </Link>
          <button type="button" className="pbtn" onClick={closeWelcome}>
            {welcome.secondary}
          </button>
        </div>
      </div>
    </section>
  );
}

export function HelpButton() {
  return (
    <button type="button" className="pbtn pbtn-quiet" aria-controls="welcome" onClick={openWelcome}>
      Help
    </button>
  );
}
