import type { OrderLineResponse } from "./order-types";

export function formatElapsed(createdAt: string) {
  const createdAtMs = new Date(createdAt).getTime();

  if (Number.isNaN(createdAtMs)) {
    return "—";
  }

  const elapsedMinutes = Math.max(0, (Date.now() - createdAtMs) / 60_000);

  if (elapsedMinutes < 1) {
    return "just now";
  }

  if (elapsedMinutes < 60) {
    return `${Math.floor(elapsedMinutes)} min ago`;
  }

  const elapsedHours = elapsedMinutes / 60;

  if (elapsedHours < 24) {
    const hours = Math.floor(elapsedHours);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const days = Math.floor(elapsedHours / 24);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
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
  const count = countLineItems(items);

  if (count === 0) {
    return "0 Items";
  }

  return `${count} ${count === 1 ? "Item" : "Items"}`;
}

export function sumOrderTotal(items: OrderLineResponse[] | undefined) {
  if (!items?.length) {
    return 0;
  }

  return items.reduce((sum, line) => {
    const price = line.product?.price ?? 0;
    const quantity = Number.isFinite(line.amount) ? line.amount : 0;
    return sum + price * quantity;
  }, 0);
}
