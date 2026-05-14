import type { StoreOrderItemResponse, StoreOrderResponse } from "./store-order-types";

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function countLineItems(items: StoreOrderItemResponse[] | undefined) {
  if (!items?.length) {
    return 0;
  }

  return items.reduce((sum, line) => sum + (Number.isFinite(line.amount) ? line.amount : 0), 0);
}

export function formatItemsLabel(items: StoreOrderItemResponse[] | undefined) {
  const n = countLineItems(items);

  if (n === 0) {
    return "0 Items";
  }

  return `${n} ${n === 1 ? "Item" : "Items"}`;
}

export function sumOrderTotal(items: StoreOrderItemResponse[] | undefined) {
  if (!items?.length) {
    return 0;
  }

  return items.reduce((sum, line) => {
    const price = line.product?.price ?? 0;
    const qty = Number.isFinite(line.amount) ? line.amount : 0;
    return sum + price * qty;
  }, 0);
}

export function sortOrdersNewestFirst(list: StoreOrderResponse[]) {
  return [...list].sort((a, b) => {
    const ta = new Date(a.createdAt).getTime();
    const tb = new Date(b.createdAt).getTime();

    if (Number.isFinite(tb) && Number.isFinite(ta) && tb !== ta) {
      return tb - ta;
    }

    return b.id - a.id;
  });
}

export function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}
