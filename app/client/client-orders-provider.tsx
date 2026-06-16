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
  CLIENT_ORDERS_CHANGE_EVENT,
  clientOrdersStorageKey,
  readStoredClientOrders,
  writeStoredClientOrders,
} from "./client-orders-storage";
import type { OrderResponse } from "./orders/order-types";
import { useClientIdentity } from "./use-client-identity";
import { stompSubscribe } from "../lib/websocket/stomp-client";
import { clientOrderDestination } from "../lib/websocket/events";

type ClientOrdersContextValue = {
  orders: OrderResponse[];
  isLoading: boolean;
  hasError: boolean;
  refetch: () => Promise<void>;
};

const ClientOrdersContext = createContext<ClientOrdersContextValue | null>(null);

export function ClientOrdersProvider({ children }: { children: ReactNode }) {
  const { clientId } = useClientIdentity();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!clientId) {
      setOrders([]);
      setHasError(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      const response = await fetch(`http://localhost:8080/api/orders/client/${clientId}`);

      if (!response.ok) {
        throw new Error("Failed to load client orders");
      }

      const data = (await response.json()) as OrderResponse[];
      writeStoredClientOrders(clientId, data);
      setOrders(data);
    } catch {
      setHasError(true);
      setOrders(readStoredClientOrders(clientId));
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    if (!clientId) {
      setOrders([]);
      setHasError(false);
      setIsLoading(false);
      return;
    }

    setOrders(readStoredClientOrders(clientId));
  }, [clientId]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (typeof window === "undefined" || !clientId) {
      return;
    }

    const id = clientId;

    function handleStorage(event: StorageEvent) {
      if (event.key !== clientOrdersStorageKey(id)) {
        return;
      }

      setOrders(readStoredClientOrders(id));
    }

    function handleClientOrdersChange() {
      setOrders(readStoredClientOrders(id));
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(CLIENT_ORDERS_CHANGE_EVENT, handleClientOrdersChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CLIENT_ORDERS_CHANGE_EVENT, handleClientOrdersChange);
    };
  }, [clientId]);

  const subscribedOrderIdsKey = useMemo(
    () => orders.map((order) => order.id).sort((a, b) => a - b).join(","),
    [orders],
  );

  useEffect(() => {
    if (typeof window === "undefined" || !clientId) {
      return;
    }

    const id = clientId;
    const orderIds = subscribedOrderIdsKey
      ? subscribedOrderIdsKey.split(",").map(Number)
      : [];

    if (orderIds.length === 0) {
      return;
    }

    const unsubscribers = orderIds.map((orderId) =>
      stompSubscribe(clientOrderDestination(orderId), (body) => {
        try {
          const updatedOrder = body as OrderResponse;
          const currentOrders = readStoredClientOrders(id);
          const orderIndex = currentOrders.findIndex((o) => o.id === updatedOrder.id);

          let newOrders;
          if (orderIndex >= 0) {
            newOrders = [...currentOrders];
            newOrders[orderIndex] = updatedOrder;
          } else {
            newOrders = [updatedOrder, ...currentOrders];
          }

          writeStoredClientOrders(id, newOrders);
        } catch (err) {
          console.error("Failed to handle order update from WebSocket", err);
        }
      }),
    );

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [clientId, subscribedOrderIdsKey]);

  const value = useMemo<ClientOrdersContextValue>(
    () => ({
      orders,
      isLoading,
      hasError,
      refetch: fetchOrders,
    }),
    [orders, isLoading, hasError, fetchOrders],
  );

  return <ClientOrdersContext.Provider value={value}>{children}</ClientOrdersContext.Provider>;
}

export function useClientOrders(): ClientOrdersContextValue {
  const ctx = useContext(ClientOrdersContext);

  if (!ctx) {
    throw new Error("useClientOrders must be used within a ClientOrdersProvider");
  }

  return ctx;
}
