"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "./components/bottom-navigation";
import { useClientIdentity } from "./use-client-identity";
import { CartDrawer } from "./components/cart-drawer";
import { ClientHeader } from "./components/client-header";
import { LiveOrder } from "./components/live-order";
import { ProductCatalogSection } from "./product-catalog-section";
import type { CatalogItem } from "./home-data";
import { readStoredUsername, readStoredClientId } from "./user-config";
import { useClientOrders } from "./use-client-orders";
import { useClientCart } from "./use-client-cart";
import { persistOrderForDetailRoute } from "./orders/order-detail-storage";
import { formatOrderCode } from "./orders/order-format";
import {
  buildLiveOrderStages,
  formatLiveOrderEta,
  liveOrderProgressPercent,
  selectLatestLiveClientOrder,
} from "./live-order-helpers";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function ClientHomePage() {
  const router = useRouter();
  const { username, clientId } = useClientIdentity();
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const {
    cartItems,
    commitCartItems,
    addProductToCart,
    increaseCartItem,
    decreaseCartItem,
    removeCartItem,
    syncCartFromStorage,
  } = useClientCart();
  const { orders, refetch: refetchClientOrders } = useClientOrders();

  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      ) ?? 0,
    [cartItems],
  );

  const placeOrder = useCallback(async () => {
    if (!clientId || cartItems.length === 0) {
      throw new Error("Cannot place order");
    }

    const response = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit order");
    }

    commitCartItems([]);
    await refetchClientOrders();
  }, [cartItems, clientId, commitCartItems, refetchClientOrders]);

  useEffect(() => {
    // Check localStorage directly first to avoid race conditions with external store sync
    const storedUsername = readStoredUsername();
    const storedClientId = readStoredClientId();

    if (!storedUsername || !storedClientId) {
      router.replace("/client/settings");
    }

    setIsAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!clientId) {
      return;
    }

    let isActive = true;

    async function loadProducts() {
      setIsLoadingProducts(true);

      try {
        const response = await fetch(`http://localhost:8080/products/${clientId}`);

        if (!response.ok) {
          throw new Error("Failed to load client products");
        }

        const data = (await response.json()) as CatalogItem[];

        if (isActive) {
          setProducts(data);
        }
      } catch {
        if (isActive) {
          setProducts([]);
        }
      } finally {
        if (isActive) {
          setIsLoadingProducts(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, [clientId]);

  const liveOrder = useMemo(() => selectLatestLiveClientOrder(orders), [orders]);

  if (!isAuthChecked || !username) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#181c1b]">
      <ClientHeader username={username} />

      <main className="mx-auto max-w-7xl px-6 pb-28 pt-20 transition-all duration-300">
        {liveOrder ? (
          <LiveOrder
            href={`/client/orders/${liveOrder.id}`}
            onBeforeNavigate={() => persistOrderForDetailRoute(liveOrder)}
            orderCode={formatOrderCode(liveOrder.id)}
            eta={formatLiveOrderEta(liveOrder)}
            progressPercent={liveOrderProgressPercent(liveOrder)}
            stages={buildLiveOrderStages(liveOrder)}
          />
        ) : null}

        <ProductCatalogSection products={products} onAddProduct={addProductToCart} />

        {isLoadingProducts ? (
          <p className="mt-6 text-sm text-[#737a61]">Loading products...</p>
        ) : null}
      </main>

      <CartDrawer
        items={cartItems}
        totalLabel={formatUsd(total)}
        formatUsd={formatUsd}
        onIncreaseItem={increaseCartItem}
        onDecreaseItem={decreaseCartItem}
        onRemoveItem={removeCartItem}
        onSyncCartFromStorage={syncCartFromStorage}
        onPlaceOrder={placeOrder}
      />

      <BottomNavigation activeTab="catalog" />
    </div>
  );
}
