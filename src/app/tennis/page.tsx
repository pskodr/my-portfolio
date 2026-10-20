import type { Metadata } from "next";
import { InterestView } from "@/components/ui/InterestView";
import { Panel } from "@/components/ui/Panel";
import { tennis } from "@/content/interests";

export const metadata: Metadata = { title: tennis.title };

export default function Page() {
  return (
    <Panel title={tennis.title} file="tennis.txt" accent="sky">
      <InterestView page={tennis} />
    </Panel>
  );
}
