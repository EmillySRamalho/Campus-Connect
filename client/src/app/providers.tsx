"use client";

import { ActionProvider } from "@/contexts/ActionsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import React from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <ActionProvider>
          {children}
          <Toaster position="top-right" />
        </ActionProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
