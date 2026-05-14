import type { StoreOrderResponse } from "./store-order-types";

export async function fetchAllStoreOrders(): Promise<{
  orders: StoreOrderResponse[];
  error: boolean;
}> {
  try {
    const response = await fetch("http://localhost:8080/api/orders", {
      cache: "no-store",
    });

    if (!response.ok) {
      return { orders: [], error: true };
    }

    const data = (await response.json()) as unknown;

    if (!Array.isArray(data)) {
      return { orders: [], error: true };
    }

    return { orders: data as StoreOrderResponse[], error: false };
  } catch {
    return { orders: [], error: true };
  }
}
