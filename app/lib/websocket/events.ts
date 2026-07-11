"use client";

import { StoreKafkaOrderStatus } from "@/app/store/store-order-status";
import { stompPublish } from "./stomp-client";

export const STORE_ORDERS_DESTINATION = "/topic/orders";
export const LEAD_ITEMS_DESTINATION = "/topic/lead-items";
export const HOT_ITEMS_DESTINATION = "/topic/hot-items";
export const ABANDONED_CARTS_DESTINATION = "/topic/abandoned-carts";

export function clientOrderDestination(orderId: number): string {
  return `/topic/orders/${orderId}`;
}

const ITEM_VIEW_DESTINATION = "/app/item-view";
const CART_EVENT_DESTINATION = "/app/cart-event";
const ORDER_STATUS_DESTINATION = "/app/order-status";

export type CartEventAction = "added" | "removed";

export function publishItemViewEvent(
  productId: number,
  clientId: number,
): void {
  stompPublish(ITEM_VIEW_DESTINATION, { productId, clientId });
}

export function publishCartEvent(
  action: CartEventAction,
  currentAmount: number,
  productId: number,
  clientId: number,
): void {
  stompPublish(CART_EVENT_DESTINATION, {
    action,
    currentAmount,
    productId,
    clientId,
  });
}

export function publishOrderStatusEvent(input: {
  orderId: number;
  status: StoreKafkaOrderStatus;
  userId?: string | null;
  storeId?: string | null;
  category?: string | null;
  expectedDelivery?: string | null;
}): void {
  const event = {
    eventId: crypto.randomUUID(),
    orderId: String(input.orderId),
    userId: typeof input.userId === "string" ? input.userId : "",
    storeId: typeof input.storeId === "string" ? input.storeId : "",
    category:
      typeof input.category === "string" && input.category.trim()
        ? input.category
        : "ORDER_STATUS",
    status: input.status,
    occurredAt: new Date().toISOString(),
    ...(input.status === "OUT_FOR_DELIVERY" && input.expectedDelivery
      ? { expectedDelivery: input.expectedDelivery }
      : {}),
  };

  stompPublish(ORDER_STATUS_DESTINATION, event);
}
