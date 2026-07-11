import { redirect } from "next/navigation";
import { getHomeMode } from "../home-mode";
import { StoreOrdersProvider } from "./store-orders-provider";
import { HotLeadsProvider } from "./hot-leads-provider";
import { ReactNode } from "react";

export default function StoreLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  if (getHomeMode() !== "store") {
    redirect("/client");
  }

  return (
    <StoreOrdersProvider>
      <HotLeadsProvider>
        {children}
      </HotLeadsProvider>
    </StoreOrdersProvider>
  );
}
