import type { Metadata } from "next";
import { InterestView } from "@/components/ui/InterestView";
import { Panel } from "@/components/ui/Panel";
import { barcelona } from "@/content/interests";

export const metadata: Metadata = { title: barcelona.title };

export default function Page() {
  return (
    <Panel title={barcelona.title} file="barca.txt" accent="barca">
      <InterestView page={barcelona} />
    </Panel>
  );
}
