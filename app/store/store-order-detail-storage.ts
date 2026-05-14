import type { StoreOrderResponse } from "./store-order-types";

const STORAGE_KEY_PREFIX = "queue-sine.store-order-detail";

function storageKey(orderId: number) {
  return `${STORAGE_KEY_PREFIX}:${orderId}`;
}

export function persistStoreOrderForDetailRoute(order: StoreOrderResponse) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(storageKey(order.id), JSON.stringify(order));
  } catch {
    // ignore quota / private mode
  }
}

export function readPersistedStoreOrder(orderId: number): StoreOrderResponse | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(storageKey(orderId));

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoreOrderResponse;
  } catch {
    return null;
  }
}

export function parseStoreOrderIdFromRouteSegment(segment: string): number | null {
  const normalized = String(segment).trim();
  const n = Number.parseInt(normalized, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}
