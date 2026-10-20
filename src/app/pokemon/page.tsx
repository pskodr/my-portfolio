import type { Metadata } from "next";
import { InterestView } from "@/components/ui/InterestView";
import { Panel } from "@/components/ui/Panel";
import { pokemon } from "@/content/interests";

export const metadata: Metadata = { title: pokemon.title };

export default function Page() {
  return (
    <Panel title={pokemon.title} file="pokemon.txt" accent="pika">
      <InterestView page={pokemon} />
    </Panel>
  );
}
