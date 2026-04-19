import { redirect } from "next/navigation";
import { getHomeMode } from "../home-mode";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (getHomeMode() !== "store") {
    redirect("/client");
  }

  return <>{children}</>;
}
