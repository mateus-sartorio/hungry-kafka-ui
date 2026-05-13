"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FaArrowRight, FaMinus, FaPlus, FaShoppingBag, FaTimes } from "react-icons/fa";
import { type CartItem } from "../home-data";

type CartDrawerProps = {
  items: CartItem[];
  totalLabel: string;
  formatUsd: (value: number) => string;
  onIncreaseItem: (item: CartItem) => void;
  onDecreaseItem: (item: CartItem) => void;
  onRemoveItem: (item: CartItem) => void;
  onSyncCartFromStorage: () => void;
  onPlaceOrder: () => Promise<void>;
};

export function CartDrawer({
  items,
  totalLabel,
  formatUsd,
  onIncreaseItem,
  onDecreaseItem,
  onRemoveItem,
  onSyncCartFromStorage,
  onPlaceOrder,
}: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  useEffect(() => {
    onSyncCartFromStorage();
  }, [onSyncCartFromStorage, isOpen]);

  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key !== "queue-sine.client-cart") {
        return;
      }

      onSyncCartFromStorage();
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [onSyncCartFromStorage]);

  async function handleCheckout() {
    if (items.length === 0) {
      return;
    }

    setIsSubmittingOrder(true);
    setOrderError("");

    try {
      await onPlaceOrder();
      onSyncCartFromStorage();
    } catch {
      setOrderError("We could not submit your order right now.");
    } finally {
      setIsSubmittingOrder(false);
    }
  }

  return (
    <>
      <div className="fixed bottom-24 right-6 z-40 md:right-10">
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-16 w-16 flex-col items-center justify-center rounded-sm bg-[#4c6700] text-white shadow-xl transition active:scale-95"
          aria-label="Open cart overlay"
        >
          <FaShoppingBag className="h-5 w-5" />
          <span className="text-[10px] font-black">{itemCount}</span>
        </button>
      </div>

      {isOpen ? (
        <>
          <button
            className="fixed inset-0 z-[60] bg-zinc-900/70"
            onClick={() => setIsOpen(false)}
            aria-label="Close cart overlay"
          />

          <section className="fixed bottom-0 left-0 z-[70] flex max-h-[86vh] w-full flex-col rounded-t-3xl bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.12)] md:bottom-auto md:left-auto md:right-6 md:top-24 md:h-[600px] md:max-h-[600px] md:max-w-md md:rounded-3xl">
            <div className="sticky top-0 rounded-t-3xl border-b border-zinc-100 bg-white px-6 pb-4 pt-3">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-zinc-200 md:hidden" />
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
                  aria-label="Close cart"
                >
                  <FaTimes className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 text-center">
                  <h3 className="text-xl font-bold text-zinc-900">Your cart is empty</h3>
                  <p className="mt-2 max-w-sm text-sm text-zinc-500">
                    Add items from the catalog and they will show up here.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <article key={item.name} className="flex items-center gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-zinc-200/70 bg-zinc-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3 className="text-base font-bold leading-tight">{item.name}</h3>
                        <span className="whitespace-nowrap font-semibold text-zinc-900">
                          {formatUsd(item.quantity * item.unitPrice)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-full border border-zinc-200 bg-zinc-100 p-1">
                          <button
                            type="button"
                            onClick={() => onDecreaseItem(item)}
                            className="flex h-6 w-6 items-center justify-center text-zinc-500"
                            aria-label={`Decrease ${item.name}`}
                          >
                            <FaMinus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onIncreaseItem(item)}
                            className="flex h-6 w-6 items-center justify-center text-zinc-500"
                            aria-label={`Increase ${item.name}`}
                          >
                            <FaPlus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item)}
                          className="text-xs font-medium text-red-500 underline underline-offset-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <footer className="border-t border-zinc-100 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-black text-zinc-900">{totalLabel}</span>
              </div>
              <button
                type="button"
                disabled={items.length === 0}
                onClick={() => void handleCheckout()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c8f53c] py-4 text-lg font-bold text-zinc-900 shadow-[0_4px_14px_0_rgba(200,245,60,0.39)] transition hover:bg-[#b0d934] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500 disabled:shadow-none"
              >
                {isSubmittingOrder ? "Submitting..." : "Checkout Now"}
                <FaArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
              {orderError ? <p className="mt-3 text-sm text-red-500">{orderError}</p> : null}
            </footer>
          </section>
        </>
      ) : null}
    </>
  );
}