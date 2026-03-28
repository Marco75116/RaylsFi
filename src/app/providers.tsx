"use client";

import React from "react";
import { ThemeProvider } from "@/providers/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange enableColorScheme={false}>
      {children}
    </ThemeProvider>
  );
}
