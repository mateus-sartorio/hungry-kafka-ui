"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  CART_CHANGE_EVENT,
  CART_STORAGE_KEY,
  readStoredCartItems,
  writeStoredCartItems,
  type CatalogItem,
  type CartItem,
} from "./home-data";
import { readStoredClientId } from "./user-config";

function publishCartEvent(action: "added" | "removed", currentAmount: number, productId: number) {
  const clientId = readStoredClientId();
  if (!clientId) return;

  fetch("/api/client/cart/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, currentAmount, productId, clientId }),
  }).catch((err) => console.error("Failed to publish cart event:", err));
}

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

const EMPTY_CART: CartItem[] = [];

function getServerSnapshot() {
  return EMPTY_CART;
}

export function useClientCart() {
  const cartItems = useSyncExternalStore(subscribeToCartChanges, getCartSnapshot, getServerSnapshot);

  const commitCartItems = useCallback((nextItems: CartItem[]) => {
    writeStoredCartItems(nextItems);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(CART_CHANGE_EVENT));
    }
  }, []);

  const addProductToCart = useCallback(
    (product: CatalogItem) => {
      const existingItem = cartItems.find((item) => item.name === product.name);

      if (existingItem) {
        const currentAmount = existingItem.quantity + 1;
        commitCartItems(
          cartItems.map((item) =>
            item.name === product.name ? { ...item, quantity: currentAmount } : item,
          ),
        );
        publishCartEvent("added", currentAmount, product.id);
        return;
      }

      commitCartItems([
        ...cartItems,
        {
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
          quantity: 1,
          image: product.photo || "",
        },
      ]);
      publishCartEvent("added", 1, product.id);
    },
    [cartItems, commitCartItems],
  );

  const increaseCartItem = useCallback(
    (itemToIncrease: CartItem) => {
      const currentAmount = itemToIncrease.quantity + 1;
      commitCartItems(
        cartItems.map((item) =>
          item.name === itemToIncrease.name
            ? { ...item, quantity: currentAmount }
            : item,
        ),
      );
      publishCartEvent("added", currentAmount, itemToIncrease.productId);
    },
    [cartItems, commitCartItems],
  );

  const decreaseCartItem = useCallback(
    (itemToDecrease: CartItem) => {
      const currentAmount = itemToDecrease.quantity - 1;
      commitCartItems(
        cartItems
          .map((item) =>
            item.name === itemToDecrease.name
              ? { ...item, quantity: currentAmount }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
      publishCartEvent("removed", currentAmount, itemToDecrease.productId);
    },
    [cartItems, commitCartItems],
  );

  const removeCartItem = useCallback(
    (itemToRemove: CartItem) => {
      commitCartItems(cartItems.filter((item) => item.name !== itemToRemove.name));
      publishCartEvent("removed", 0, itemToRemove.productId);
    },
    [cartItems, commitCartItems],
  );

  const syncCartFromStorage = useCallback(() => {
    window.dispatchEvent(new Event(CART_CHANGE_EVENT));
  }, []);

  return {
    cartItems,
    commitCartItems,
    addProductToCart,
    increaseCartItem,
    decreaseCartItem,
    removeCartItem,
    syncCartFromStorage,
  };
}
