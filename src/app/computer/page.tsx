import type { Metadata } from "next";
import { DesktopIcons } from "@/components/computer/DesktopIcons";

export const metadata: Metadata = { title: "Computer" };

export default function ComputerDesktop() {
  return (
    <div className="stack">
      <header className="page-head">
        <h1 className="page-title">What would you like to open?</h1>
        <p className="page-lede">My work lives on this computer. Start with Projects, or go straight to the résumé.</p>
      </header>
      <DesktopIcons />
    </div>
  );
}
