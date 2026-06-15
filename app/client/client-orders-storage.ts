import type { OrderResponse } from "./orders/order-types";

export const CLIENT_ORDERS_CHANGE_EVENT = "hungry-kafka.client-orders-change";

export function clientOrdersStorageKey(clientId: number) {
  return `hungry-kafka.client-orders:${clientId}`;
}

type StoredClientOrdersPayload = {
  clientId: number;
  orders: OrderResponse[];
  fetchedAt: string;
};

export function readStoredClientOrders(clientId: number): OrderResponse[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = localStorage.getItem(clientOrdersStorageKey(clientId));

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as StoredClientOrdersPayload).clientId !== "number" ||
      !Array.isArray((parsed as StoredClientOrdersPayload).orders)
    ) {
      return [];
    }

    const payload = parsed as StoredClientOrdersPayload;

    if (payload.clientId !== clientId) {
      return [];
    }

    return payload.orders;
  } catch {
    return [];
  }
}

export function writeStoredClientOrders(clientId: number, orders: OrderResponse[]) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredClientOrdersPayload = {
    clientId,
    orders,
    fetchedAt: new Date().toISOString(),
  };

  localStorage.setItem(clientOrdersStorageKey(clientId), JSON.stringify(payload));
  window.dispatchEvent(new Event(CLIENT_ORDERS_CHANGE_EVENT));
}
