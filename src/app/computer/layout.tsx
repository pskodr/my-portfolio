import { ComputerShell } from "@/components/computer/ComputerShell";

export default function ComputerLayout({ children }: LayoutProps<"/computer">) {
  return <ComputerShell>{children}</ComputerShell>;
}
