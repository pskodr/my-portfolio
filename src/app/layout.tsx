import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { RoomProvider } from "@/components/room/RoomContext";
import { RoomStage } from "@/components/room/RoomStage";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { profile } from "@/content/profile";
import "./globals.css";

const grotesk = Schibsted_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: `${profile.name} · Product`, template: `%s · ${profile.name}` },
  description: `${profile.focus}. Step into my room: projects, experience, résumé, and the things I care about.`,
};

// The room stays mounted across every route; pages render as panels over it.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={grotesk.variable}>
      <body>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <RoomProvider>
          <RoomStage />
          <SiteHeader />
          <main id="content" className="layer">
            {children}
          </main>
        </RoomProvider>
      </body>
    </html>
  );
}
