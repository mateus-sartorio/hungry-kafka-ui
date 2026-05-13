import type { OrderResponse } from "./order-types";

const STORAGE_KEY_PREFIX = "queue-sine.order-detail";

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

/** Route segment is lowercased order code, e.g. `txn-00442`. */
export function parseOrderIdFromRouteSegment(segment: string): number | null {
  const normalized = segment.trim().toLowerCase();
  const match = /^txn-(\d+)$/.exec(normalized);

  if (match) {
    const id = Number.parseInt(match[1], 10);
    return Number.isFinite(id) ? id : null;
  }

  const asNum = Number.parseInt(normalized, 10);
  return Number.isFinite(asNum) && asNum > 0 ? asNum : null;
}
