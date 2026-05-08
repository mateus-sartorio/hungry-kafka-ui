"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "./components/bottom-navigation";
import { readStoredUsername } from "./user-config";
import { CartDrawer } from "./components/cart-drawer";
import { ClientHeader } from "./components/client-header";
import { LiveOrder } from "./components/live-order";
import { ProductCatalogSection } from "./product-catalog-section";
import type { ClientHomeData } from "./home-data";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function ClientHomePage() {
  const router = useRouter();
  const [username] = useState(() => readStoredUsername());
  const [homeData, setHomeData] = useState<ClientHomeData | null>(null);

  const total = useMemo(
    () =>
      homeData?.cartItems.reduce(
        (sum, item) => sum + item.qty * item.unitPrice,
        0,
      ) ?? 0,
    [homeData],
  );

  useEffect(() => {
    if (!username) {
      router.replace("/client/settings");
    }
  }, [router, username]);

  useEffect(() => {
    let isActive = true;

    async function loadHomeData() {
      const response = await fetch("/api/client/home");

      if (!response.ok) {
        throw new Error("Failed to load client home data");
      }

      const data = (await response.json()) as ClientHomeData;

      if (isActive) {
        setHomeData(data);
      }
    }

    void loadHomeData().catch(() => {
      if (isActive) {
        setHomeData({ products: [], cartItems: [] });
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  if (!username) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#181c1b]">
      <ClientHeader username={username} />

      <main className="mx-auto max-w-7xl px-6 pb-28 pt-20 transition-all duration-300">
        <LiveOrder
          orderCode="#4429"
          eta="08:14"
          progressPercent={75}
          stages={[
            { label: "Confirmed", isActive: true },
            { label: "Preparing", isActive: true },
            { label: "Out for delivery" },
          ]}
        />

        <ProductCatalogSection products={homeData?.products ?? []} />
      </main>

      <CartDrawer
        items={homeData?.cartItems ?? []}
        totalLabel={formatUsd(total)}
        formatUsd={formatUsd}
      />

      <BottomNavigation activeTab="catalog" />
    </div>
  );
}
