"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  STORE_ORDERS_CHANGE_EVENT,
  STORE_ORDERS_STORAGE_KEY,
  readStoredStoreOrders,
  writeStoredStoreOrders,
} from "./store-orders-storage";
import type { StoreOrderResponse } from "./store-order-types";
import { stompSubscribe } from "../lib/websocket/stomp-client";
import { STORE_ORDERS_DESTINATION } from "../lib/websocket/events";

type StoreOrdersContextValue = {
  orders: StoreOrderResponse[];
  isLoading: boolean;
  hasError: boolean;
  refetch: () => Promise<void>;
};

const StoreOrdersContext = createContext<StoreOrdersContextValue | null>(null);

export function StoreOrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<StoreOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const response = await fetch("http://localhost:8080/api/orders");

      if (!response.ok) {
        throw new Error("Failed to load store orders");
      }

      const data = (await response.json()) as StoreOrderResponse[];
      writeStoredStoreOrders(data);
      setOrders(data);
    } catch {
      setHasError(true);
      setOrders(readStoredStoreOrders());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setOrders(readStoredStoreOrders());
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function handleStorage(event: StorageEvent) {
      if (event.key !== STORE_ORDERS_STORAGE_KEY) {
        return;
      }
      setOrders(readStoredStoreOrders());
    }

    function handleStoreOrdersChange() {
      setOrders(readStoredStoreOrders());
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(STORE_ORDERS_CHANGE_EVENT, handleStoreOrdersChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(STORE_ORDERS_CHANGE_EVENT, handleStoreOrdersChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const unsubscribe = stompSubscribe(STORE_ORDERS_DESTINATION, (body) => {
      try {
        const updatedOrder = body as StoreOrderResponse;
        const currentOrders = readStoredStoreOrders();
        const orderIndex = currentOrders.findIndex((o) => o.id === updatedOrder.id);

        let newOrders;
        if (orderIndex >= 0) {
          newOrders = [...currentOrders];
          newOrders[orderIndex] = updatedOrder;
        } else {
          newOrders = [updatedOrder, ...currentOrders];
        }

        writeStoredStoreOrders(newOrders);
      } catch (err) {
        console.error("Failed to handle order update from WebSocket", err);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo<StoreOrdersContextValue>(
    () => ({
      orders,
      isLoading,
      hasError,
      refetch: fetchOrders,
    }),
    [orders, isLoading, hasError, fetchOrders],
  );

  return <StoreOrdersContext.Provider value={value}>{children}</StoreOrdersContext.Provider>;
}

export function useStoreOrders(): StoreOrdersContextValue {
  const ctx = useContext(StoreOrdersContext);

  if (!ctx) {
    throw new Error("useStoreOrders must be used within a StoreOrdersProvider");
  }

  return ctx;
}
