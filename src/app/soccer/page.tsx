import type { Metadata } from "next";
import { InterestLayout } from "@/components/ui/InterestLayout";
import { Panel } from "@/components/ui/Panel";
import { soccer } from "@/content/interests";

export const metadata: Metadata = { title: "Soccer & FC Barcelona" };

export default function SoccerPage() {
  return (
    <Panel label="Soccer and FC Barcelona" accent="barca" crumbs={[{ label: "Ball & Barça jersey" }]}>
      <InterestLayout page={soccer} />
    </Panel>
  );
}
