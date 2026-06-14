import type { OrderResponse } from "./order-types";

const STORAGE_KEY_PREFIX = "hungry-kafka.order-detail";

function storageKey(orderId: number) {
  return `${STORAGE_KEY_PREFIX}:${orderId}`;
}

export function persistOrderForDetailRoute(order: OrderResponse) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(storageKey(order.id), JSON.stringify(order));
  } catch {
    // ignore quota / private mode
  }
}

export function readPersistedOrder(orderId: number): OrderResponse | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(storageKey(orderId));

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as OrderResponse;
  } catch {
    return null;
  }
}

/** Route segment is order id, e.g. `442`. */
export function parseOrderIdFromRouteSegment(segment: string): number | null {
  const normalized = segment.trim().toLowerCase();
  const asNum = Number.parseInt(normalized, 10);
  return Number.isFinite(asNum) && asNum > 0 ? asNum : null;
}
