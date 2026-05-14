import { redirect } from "next/navigation";
import { getHomeMode } from "../home-mode";
import { ClientAppShell } from "./client-app-shell";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (getHomeMode() !== "client") {
    redirect("/store");
  }

  return <ClientAppShell>{children}</ClientAppShell>;
}
