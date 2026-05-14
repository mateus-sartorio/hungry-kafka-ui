import { redirect } from "next/navigation";
import { getHomeMode } from "../home-mode";
import { StoreOrdersProvider } from "./store-orders-provider";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (getHomeMode() !== "store") {
    redirect("/client");
  }

  return <StoreOrdersProvider>{children}</StoreOrdersProvider>;
}
