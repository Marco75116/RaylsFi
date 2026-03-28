import {
  LayoutGrid,
  CreditCard,
  ArrowLeftRight,
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
          href: "/overview",
          label: "Overview",
          active: pathname === "/overview",
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: "/overview/cards",
          label: "Cards",
          active: pathname.includes("/overview/cards"),
          icon: CreditCard,
          submenus: [],
        },
        {
          href: "/transactions",
          label: "Transactions",
          active: pathname.includes("/transactions"),
          icon: ArrowLeftRight,
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
