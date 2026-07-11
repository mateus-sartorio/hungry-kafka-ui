import { redirect } from "next/navigation";
import { getHomeMode } from "../home-mode";
import { ClientAppShell } from "./client-app-shell";
import { ReactNode } from "react";

export default function ClientLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  if (getHomeMode() !== "client") {
    redirect("/store");
  }

  return <ClientAppShell>{children}</ClientAppShell>;
}
