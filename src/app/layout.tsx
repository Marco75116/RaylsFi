import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "RaylsFi",
  description:
    "Your Web3 Card Dashboard — manage crypto assets, cards, and transactions.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={GeistSans.className}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
