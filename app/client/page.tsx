"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "./components/bottom-navigation";
import { useClientIdentity } from "./use-client-identity";
import { CartDrawer } from "./components/cart-drawer";
import { ClientHeader } from "./components/client-header";
import { LiveOrder } from "./components/live-order";
import { ProductCatalogSection } from "./product-catalog-section";
import {
  CART_STORAGE_KEY,
  readStoredCartItems,
  writeStoredCartItems,
  type CatalogItem,
  type CartItem,
} from "./home-data";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

const CART_CHANGE_EVENT = "queue-sine.client-cart-change";

function getCartSnapshot() {
  return readStoredCartItems();
}

function subscribeToCartChanges(onStoreChange: () => void) {
  function handleStorageEvent(event: StorageEvent) {
    if (event.key !== CART_STORAGE_KEY) {
      return;
    }

    onStoreChange();
  }

  function handleCartChangeEvent() {
    onStoreChange();
  }

  window.addEventListener("storage", handleStorageEvent);
  window.addEventListener(CART_CHANGE_EVENT, handleCartChangeEvent);

  return () => {
    window.removeEventListener("storage", handleStorageEvent);
    window.removeEventListener(CART_CHANGE_EVENT, handleCartChangeEvent);
  };
}

export default function ClientHomePage() {
  const router = useRouter();
  const { username, clientId } = useClientIdentity();
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const cartItems = useSyncExternalStore(subscribeToCartChanges, getCartSnapshot, () => []);
  const syncCartFromStorage = useCallback(() => {
    window.dispatchEvent(new Event(CART_CHANGE_EVENT));
  }, []);

  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.qty * item.unitPrice,
        0,
      ) ?? 0,
    [cartItems],
  );

  function commitCartItems(nextItems: typeof cartItems) {
    writeStoredCartItems(nextItems);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(CART_CHANGE_EVENT));
    }
  }

  function addProductToCart(product: CatalogItem) {
    const existingItem = cartItems.find((item) => item.name === product.name);

    if (existingItem) {
      commitCartItems(
        cartItems.map((item) =>
          item.name === product.name ? { ...item, qty: item.qty + 1 } : item,
        ),
      );

      return;
    }

    commitCartItems([
      ...cartItems,
      {
        name: product.name,
        unitPrice: product.price,
        qty: 1,
        image: product.photoUrl,
      },
    ]);
  }

  function increaseCartItem(itemToIncrease: CartItem) {
    commitCartItems(
      cartItems.map((item) =>
        item.name === itemToIncrease.name
          ? { ...item, qty: item.qty + 1 }
          : item,
      ),
    );
  }

  function decreaseCartItem(itemToDecrease: CartItem) {
    commitCartItems(
      cartItems
        .map((item) =>
          item.name === itemToDecrease.name
            ? { ...item, qty: item.qty - 1 }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  }

  function removeCartItem(itemToRemove: CartItem) {
    commitCartItems(cartItems.filter((item) => item.name !== itemToRemove.name));
  }

  useEffect(() => {
    if (!username) {
      router.replace("/client/settings");
    }
  }, [router, username]);

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
      />

      <BottomNavigation activeTab="catalog" />
    </div>
  );
}
