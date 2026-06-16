"use client";

import { ReactNode } from "react";
import { ClientOrdersProvider } from "./client-orders-provider";
import { HotItemsProvider } from "./hot-items-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ClientAppShell({ children }: { children: ReactNode }) {
  return (
    <ClientOrdersProvider>
      <HotItemsProvider>
        {children}
        <ToastContainer className="!w-auto !left-4 !right-4 !top-20" />
      </HotItemsProvider>
    </ClientOrdersProvider>
  );
}
