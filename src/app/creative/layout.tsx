import { CreativeShell } from "@/components/creative/CreativeShell";

export default function CreativeLayout({ children }: LayoutProps<"/creative">) {
  return <CreativeShell>{children}</CreativeShell>;
}
