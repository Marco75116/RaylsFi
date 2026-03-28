import { Navbar } from "@/components/admin-panel/Navbar";

interface ContentLayoutProps {
  children?: React.ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    </div>
  );
}
