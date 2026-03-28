import { cookies, headers } from "next/headers";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin-panel/AppSidebar";

import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cookieStore, session] = await Promise.all([
    cookies(),
    auth.api.getSession({ headers: await headers() }),
  ]);
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar user={session?.user ?? null} />
      <SidebarInset className="bg-muted/50">
        <div className="flex min-h-svh flex-col">
          <div className="flex-1">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
