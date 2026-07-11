import type { StoreOrderResponse } from "./store-order-types";

export const STORE_ORDERS_CHANGE_EVENT = "hungry-kafka.store-orders-change";
export const STORE_ORDERS_STORAGE_KEY = "hungry-kafka.store-orders";

type StoredStoreOrdersPayload = {
  orders: StoreOrderResponse[];
  fetchedAt: string;
};

export function readStoredStoreOrders(): StoreOrderResponse[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = localStorage.getItem(STORE_ORDERS_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !Array.isArray((parsed as StoredStoreOrdersPayload).orders)
    ) {
      return [];
    }

    return (parsed as StoredStoreOrdersPayload).orders;
  } catch {
    return [];
  }
}

export function writeStoredStoreOrders(orders: StoreOrderResponse[]) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredStoreOrdersPayload = {
    orders,
    fetchedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORE_ORDERS_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event(STORE_ORDERS_CHANGE_EVENT));
}
