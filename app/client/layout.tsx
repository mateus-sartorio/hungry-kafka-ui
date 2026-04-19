import { redirect } from "next/navigation";
import { getHomeMode } from "../home-mode";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (getHomeMode() !== "client") {
    redirect("/store");
  }

  return <>{children}</>;
}
