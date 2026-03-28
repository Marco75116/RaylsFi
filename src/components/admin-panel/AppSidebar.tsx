import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { NavMenu } from "@/components/admin-panel/NavMenu";

type AppSidebarProps = {
  user: { name: string; email: string; image?: string | null } | null;
};

export function AppSidebar({ user }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="RaylsFi">
              <Link href="/overview">
                <Image
                  src="/rayls-icon.png"
                  alt="Rayls"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold tracking-tight">RaylsFi</span>
                  <span className="text-[11px] text-sidebar-foreground/50">
                    Web3 Card Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="mx-3" />
      <NavMenu user={user} />
    </Sidebar>
  );
}
