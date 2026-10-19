import type { Metadata } from "next";
import { InterestLayout } from "@/components/ui/InterestLayout";
import { Panel } from "@/components/ui/Panel";
import { pokemon } from "@/content/interests";

export const metadata: Metadata = { title: "Pokémon VGC" };

export default function PokemonPage() {
  return (
    <Panel label="Pokémon VGC doubles" accent="pika" crumbs={[{ label: "Pikachu & Switch" }]}>
      <InterestLayout page={pokemon} />
    </Panel>
  );
}
