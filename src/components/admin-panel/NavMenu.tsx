"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { getMenuList } from "@/lib/menu-list";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { UserNav } from "@/components/admin-panel/UserNav";
import { Badge } from "@/components/ui/badge";

type NavMenuProps = {
  user: { name: string; email: string; image?: string | null } | null;
};

export function NavMenu({ user }: NavMenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  return (
    <>
      <SidebarContent>
        {menuList.map(({ groupLabel, menus }, groupIndex) => (
          <SidebarGroup
            key={groupIndex}
            className={groupIndex === 0 ? "mt-2" : undefined}
          >
            {groupLabel && <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {menus.map(
                  ({
                    href,
                    label,
                    icon: Icon,
                    active,
                    submenus,
                    external,
                    badge,
                    disabled,
                  }) =>
                    submenus.length === 0 ? (
                      <SidebarMenuItem key={label}>
                        {disabled ? (
                          <SidebarMenuButton
                            disabled
                            tooltip={label}
                            className="opacity-50"
                          >
                            <Icon />
                            <span>{label}</span>
                            {badge && (
                              <Badge
                                variant="outline"
                                className="ml-auto text-[10px] px-1.5 py-0"
                              >
                                {badge}
                              </Badge>
                            )}
                          </SidebarMenuButton>
                        ) : (
                          <SidebarMenuButton
                            asChild
                            isActive={active}
                            tooltip={label}
                          >
                            {external ? (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Icon />
                                <span>{label}</span>
                              </a>
                            ) : (
                              <Link href={href}>
                                <Icon />
                                <span>{label}</span>
                              </Link>
                            )}
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    ) : (
                      <Collapsible
                        key={label}
                        defaultOpen={active}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={active}
                              tooltip={label}
                            >
                              <Icon />
                              <span>{label}</span>
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {submenus.map((submenu) => (
                                <SidebarMenuSubItem key={submenu.label}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={submenu.active}
                                  >
                                    <Link href={submenu.href}>
                                      <span>{submenu.label}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator className="mx-3" />
        <SidebarMenu>
          <SidebarMenuItem>
            <UserNav user={user} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
