"use client";

import { ClientOrdersProvider } from "./client-orders-provider";

export function ClientAppShell({ children }: { children: React.ReactNode }) {
  return <ClientOrdersProvider>{children}</ClientOrdersProvider>;
}
