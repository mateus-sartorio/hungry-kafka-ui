"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { BottomNavigation } from "../../components/bottom-navigation";
import { CartDrawer } from "../../components/cart-drawer";
import { ClientHeader } from "../../components/client-header";
import type { CatalogItem } from "../../home-data";
import { readStoredUsername, readStoredClientId } from "../../user-config";
import { useClientIdentity } from "../../use-client-identity";
import { useClientCart } from "../../use-client-cart";
import { useClientOrders } from "../../use-client-orders";
import { publishItemViewEvent } from "../../../lib/websocket/events";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function ClientProductDetailPage() {
  const router = useRouter();
  const params = useParams<{ productId: string }>();
  const { username, clientId } = useClientIdentity();
  const { refetch: refetchClientOrders } = useClientOrders();
  const {
    cartItems,
    commitCartItems,
    addProductToCart,
    increaseCartItem,
    decreaseCartItem,
    removeCartItem,
    syncCartFromStorage,
  } = useClientCart();

  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const productId = useMemo(() => {
    const raw = (Array.isArray(params.productId) ? params.productId[0] : params.productId) ?? "";
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [params.productId]);

  const product = useMemo(
    () => (productId === null ? null : products.find((p) => p.id === productId) ?? null),
    [productId, products],
  );

  useEffect(() => {
    if (!product || !clientId) return;

    publishItemViewEvent(product.id, clientId);
  }, [product, clientId]);

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

  const handleHeaderBack = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
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
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await fetch(`http://localhost:8080/products/${clientId}`);

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = (await response.json()) as CatalogItem[];

        if (isActive) {
          setProducts(data);
        }
      } catch {
        if (isActive) {
          setProducts([]);
          setHasError(true);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, [clientId]);

  if (!isAuthChecked || !username) {
    return null;
  }

  if (productId === null) {
    return (
      <div className="min-h-screen bg-[#f7faf8] text-[#181c1b]">
        <ClientHeader username={username} onBack={handleHeaderBack} />
        <main className="mx-auto max-w-3xl px-6 pb-28 pt-24">
          <p className="text-sm text-red-500">Invalid product link.</p>
        </main>
        <BottomNavigation activeTab="catalog" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#181c1b]">
      <ClientHeader username={username} onBack={handleHeaderBack} />

      <main className="mx-auto max-w-2xl px-6 pb-32 pt-20">
        {isLoading ? (
          <p className="text-sm text-[#737a61]">Loading product…</p>
        ) : hasError ? (
          <p className="text-sm text-red-500">We could not load this product.</p>
        ) : !product ? (
          <p className="text-sm text-[#737a61]">This product is not in your catalog.</p>
        ) : (
          <>
            <div className="relative mb-6 aspect-square w-full max-h-[min(85vw,28rem)] overflow-hidden rounded-2xl border border-[#c3caac]/20 bg-white shadow-sm">
              <Image
                src={product.photo}
                alt={product.name}
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
              />
            </div>

            <div className="mb-3">
              {product.priority !== undefined && (
                <span className="rounded-full bg-[#f1f4f2] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#4c6700]" title="Preference Score">
                  ★ {product.priority.toFixed(3)}
                </span>
              )}
            </div>

            <h1 className="mb-2 text-3xl font-black tracking-tight text-[#181c1b]">{product.name}</h1>
            <p className="mb-6 text-2xl font-bold text-[#4c6700]">{formatUsd(product.price)}</p>

            <section className="rounded-xl border border-[#c3caac]/20 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-xs font-black uppercase tracking-widest text-[#705a4f]">
                Description
              </h2>
              <p className="text-base leading-relaxed text-[#434933]">{product.description}</p>
            </section>

            <button
              type="button"
              onClick={() => addProductToCart(product)}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c8f53c] py-4 text-lg font-bold text-zinc-900 shadow-[0_4px_14px_0_rgba(200,245,60,0.39)] transition hover:bg-[#b0d934] active:scale-[0.98]"
            >
              <FaPlus className="h-4 w-4" aria-hidden />
              Add to cart
            </button>
          </>
        )}
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
