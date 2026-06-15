"use client";

import { stompPublish } from "./stomp-client";

// Destinations the backend broadcasts to (subscribe side). These mirror the
// SimpMessagingTemplate destinations in the backend WebSocketService.
export const STORE_ORDERS_DESTINATION = "/topic/orders";
export const HOT_ITEMS_DESTINATION = "/topic/hot-items";

export function clientOrderDestination(orderId: number): string {
  return `/topic/orders/${orderId}`;
}

// Destinations handled by the backend @MessageMapping controller (publish
// side). The "/app" prefix is Spring's default application destination prefix.
const ITEM_VIEW_DESTINATION = "/app/item-view";
const CART_EVENT_DESTINATION = "/app/cart-event";
const ORDER_STATUS_DESTINATION = "/app/order-status";

export type CartEventAction = "added" | "removed";

export const ORDER_STATUS_VALUES = [
  "ACCEPTED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatusValue = (typeof ORDER_STATUS_VALUES)[number];

export function publishItemViewEvent(productId: number, clientId: number): void {
  stompPublish(ITEM_VIEW_DESTINATION, { productId, clientId });
}

export function publishCartEvent(
  action: CartEventAction,
  currentAmount: number,
  productId: number,
  clientId: number,
): void {
  stompPublish(CART_EVENT_DESTINATION, { action, currentAmount, productId, clientId });
}

/**
 * Build and publish an order status event. The enrichment (eventId, occurredAt,
 * defaults) mirrors what the former /api/orders/status-events route produced so
 * the backend consumer sees the same payload shape.
 */
export function publishOrderStatusEvent(input: {
  orderId: number;
  status: OrderStatusValue;
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
