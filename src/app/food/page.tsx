import type { Metadata } from "next";
import { InterestView } from "@/components/ui/InterestView";
import { Panel } from "@/components/ui/Panel";
import { food } from "@/content/interests";

export const metadata: Metadata = { title: food.title };

export default function Page() {
  return (
    <Panel title={food.title} file="food.txt" accent="warm">
      <InterestView page={food} />
    </Panel>
  );
}
