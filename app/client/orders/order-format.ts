import type { OrderLineResponse } from "./order-types";

export function formatElapsed(createdAt: string) {
  const createdAtMs = new Date(createdAt).getTime();

  if (Number.isNaN(createdAtMs)) {
    return "—";
  }

  const elapsedMinutes = Math.max(0, (Date.now() - createdAtMs) / 60_000);

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes.toFixed(1)} min`;
  }

  const elapsedHours = elapsedMinutes / 60;

  if (elapsedHours < 24) {
    return `${elapsedHours.toFixed(1)} h`;
  }

  return `${Math.floor(elapsedHours / 24)} d`;
}

export function formatOrderCode(orderId: number) {
  return `#${orderId}`;
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

export function countLineItems(items: OrderLineResponse[] | undefined) {
  if (!items?.length) {
    return 0;
  }

  return items.reduce((sum, line) => sum + (Number.isFinite(line.amount) ? line.amount : 0), 0);
}

export function formatItemsLabel(items: OrderLineResponse[] | undefined) {
  const n = countLineItems(items);

  if (n === 0) {
    return "0 Items";
  }

  return `${n} ${n === 1 ? "Item" : "Items"}`;
}

export function sumOrderTotal(items: OrderLineResponse[] | undefined) {
  if (!items?.length) {
    return 0;
  }

  return items.reduce((sum, line) => {
    const price = line.product?.price ?? 0;
    const qty = Number.isFinite(line.amount) ? line.amount : 0;
    return sum + price * qty;
  }, 0);
}
