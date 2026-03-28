import {
  LayoutGrid,
  CreditCard,
  Settings,
  Headset,
  type LucideIcon,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
  external?: boolean;
  badge?: string;
  disabled?: boolean;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Dashboard",
      menus: [
        {
          href: "/dashboard",
          label: "Overview",
          active: pathname === "/dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/dashboard/cards",
          label: "Cards",
          active: pathname.includes("/dashboard/cards"),
          icon: CreditCard,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Account",
      menus: [
        {
          href: "",
          label: "Settings",
          active: false,
          icon: Settings,
          submenus: [],
          badge: "Soon",
          disabled: true,
        },
        {
          href: "https://t.me/marcopoloo33",
          label: "Support",
          active: false,
          icon: Headset,
          submenus: [],
          external: true,
        },
      ],
    },
  ];
}
