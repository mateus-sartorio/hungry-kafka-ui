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

export function useClientCart() {
  const cartItems = useSyncExternalStore(subscribeToCartChanges, getCartSnapshot, () => []);

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
        commitCartItems(
          cartItems.map((item) =>
            item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        );

        return;
      }

      commitCartItems([
        ...cartItems,
        {
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
          quantity: 1,
          image: product.photoUrl,
        },
      ]);
    },
    [cartItems, commitCartItems],
  );

  const increaseCartItem = useCallback(
    (itemToIncrease: CartItem) => {
      commitCartItems(
        cartItems.map((item) =>
          item.name === itemToIncrease.name
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    },
    [cartItems, commitCartItems],
  );

  const decreaseCartItem = useCallback(
    (itemToDecrease: CartItem) => {
      commitCartItems(
        cartItems
          .map((item) =>
            item.name === itemToDecrease.name
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
    },
    [cartItems, commitCartItems],
  );

  const removeCartItem = useCallback(
    (itemToRemove: CartItem) => {
      commitCartItems(cartItems.filter((item) => item.name !== itemToRemove.name));
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
