import type { Metadata } from "next";
import { DeskStage } from "@/components/desk/DeskStage";
import { welcomeScript } from "@/components/desk/Welcome";
import { profile } from "@/content/site";
import { geistMono, notoThai, pixelify } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${profile.name} · Portfolio`, template: `%s · ${profile.name}` },
  description: profile.intro,
};

// The desk stays mounted across every route; pages open over it.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistMono.variable} ${pixelify.variable} ${notoThai.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: welcomeScript }} />
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <main id="content" className="layer">
          {children}
        </main>
        <DeskStage />
      </body>
    </html>
  );
}
