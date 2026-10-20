import { WorkShell } from "@/components/work/WorkShell";

export default function WorkLayout({ children }: LayoutProps<"/work">) {
  return <WorkShell>{children}</WorkShell>;
}
