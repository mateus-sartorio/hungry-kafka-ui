import type { OrderResponse } from "./order-types";

const STORAGE_KEY_PREFIX = "hungry-kafka.order-detail";

function storageKey(orderId: number) {
  return `${STORAGE_KEY_PREFIX}:${orderId}`;
}

export function persistOrderForDetailRoute(order: OrderResponse) {
  sessionStorage.setItem(storageKey(order.id), JSON.stringify(order));
}

export function readPersistedOrder(orderId: number): OrderResponse | null {
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

export function parseOrderIdFromRouteSegment(segment: string): number | null {
  const normalized = segment.trim().toLowerCase();
  const asNumber = Number.parseInt(normalized, 10);
  return Number.isFinite(asNumber) && asNumber > 0 ? asNumber : null;
}
