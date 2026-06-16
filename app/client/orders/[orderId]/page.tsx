"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ClientHeader } from "../../components/client-header";
import { useClientIdentity } from "../../use-client-identity";
import { useClientOrders } from "../../use-client-orders";
import { formatElapsed, formatOrderCode, formatUsd, formatStatus } from "../order-format";
import {
  parseOrderIdFromRouteSegment,
  readPersistedOrder,
} from "../order-detail-storage";
import type { OrderResponse } from "../order-types";
import { OrderStatusCard } from "./components/order-status-card";
import { OrderWarningCard } from "./components/order-warning-card";
import { OrderItemsCard } from "../../../components/order-items-card";
import { publishOrderStatusEvent } from "../../../lib/websocket/events";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const { username, clientId } = useClientIdentity();
  const { orders: clientOrders, isLoading: ordersListLoading, hasError: ordersListError } = useClientOrders();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMarkingDelivered, setIsMarkingDelivered] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");

  const routeOrderSegment = useMemo(() => {
    const raw = params.orderId;
    return (Array.isArray(raw) ? raw[0] : raw) ?? "";
  }, [params.orderId]);

  const numericOrderId = useMemo(
    () => parseOrderIdFromRouteSegment(routeOrderSegment),
    [routeOrderSegment],
  );

  const handleMarkDelivered = useCallback(async () => {
    if (!order || !clientId) {
      return;
    }

    setIsMarkingDelivered(true);
    setDeliveryError("");

    try {
      publishOrderStatusEvent({
        orderId: order.id,
        status: "DELIVERED",
        userId: String(clientId),
        category: "ORDER_STATUS",
      });

      setOrder((prev) => (prev ? { ...prev, status: "DELIVERED" } : null));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setDeliveryError(message);
    } finally {
      setIsMarkingDelivered(false);
    }
  }, [order, clientId]);

  const handleHeaderBack = useCallback(() => {
    router.back();
  }, [router]);

  const isExpectedDeliveryInFuture = useMemo(() => {
    if (!order || order.status !== "OUT_FOR_DELIVERY" || !order.expectedDelivery) {
      return false;
    }

    try {
      const durationRegex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/;
      const match = durationRegex.exec(order.expectedDelivery);

      if (!match) {
        return false;
      }

      const hours = parseInt(match[1] || "0", 10);
      const minutes = parseInt(match[2] || "0", 10);
      const seconds = parseFloat(match[3] || "0");

      const durationMs = (hours * 3600 + minutes * 60 + seconds) * 1000;

      const orderTime = new Date(order.createdAt).getTime();
      const expectedDeliveryTime = orderTime + durationMs;

      return expectedDeliveryTime > Date.now();
    } catch {
      return false;
    }
  }, [order]);

  useEffect(() => {
    if (!username || !clientId) {
      router.replace("/client/settings");
    }
  }, [clientId, router, username]);

  useEffect(() => {
    if (numericOrderId === null) {
      setOrder(null);
      setHasError(false);
      setIsReady(true);
      return;
    }

    if (!clientId || !username) {
      return;
    }

    const orderId = numericOrderId;
    const cid = clientId;

    const found = clientOrders.find((o) => o.id === orderId && o.clientId === cid);

    if (found) {
      setOrder(found);
      setHasError(false);
      setIsReady(true);
      return;
    }

    const cached = readPersistedOrder(orderId);

    if (cached && cached.clientId === cid && cached.id === orderId) {
      setOrder(cached);
      setHasError(false);
      setIsReady(true);
      return;
    }

    if (ordersListLoading) {
      setIsReady(false);
      return;
    }

    setOrder(null);
    setHasError(true);
    setIsReady(true);
  }, [
    clientId,
    clientOrders,
    numericOrderId,
    ordersListError,
    ordersListLoading,
    username,
  ]);

  if (!username) {
    return null;
  }

  if (numericOrderId === null) {
    return (
      <div className="min-h-screen bg-[#f7faf8] text-[#181c1b]">
        <ClientHeader username={username} onBack={handleHeaderBack} />

        <main className="mx-auto max-w-3xl px-6 py-24">
          <p className="text-sm text-red-500">Invalid order link.</p>
        </main>
      </div>
    );
  }

  const orderCode = formatOrderCode(numericOrderId);

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#181c1b]">
      <ClientHeader username={username} onBack={handleHeaderBack} />

      <main className="mx-auto max-w-3xl px-6 py-24">
        {!isReady ? (
          <p className="text-sm text-[#737a61]">Loading order...</p>
        ) : hasError || !order ? (
          <p className="text-sm text-red-500">We could not load this order.</p>
        ) : (
          <>
            <OrderStatusCard
              orderCode={orderCode}
              status={formatStatus(order.status)}
              estimate={`Placed ${formatElapsed(order.createdAt)}`}
            />

            {order.status === "OUT_FOR_DELIVERY" && (
              <div className="mb-6 mt-6">
                <button
                  onClick={() => void handleMarkDelivered()}
                  disabled={isMarkingDelivered}
                  className="flex w-full items-center justify-center gap-2 bg-[#4c6700] py-3 text-base font-bold text-white transition hover:bg-[#3a5000] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#737a61]"
                >
                  {isMarkingDelivered ? "Marking as delivered..." : "Mark as Delivered"}
                </button>
                {deliveryError ? (
                  <p className="mt-2 text-sm text-red-500">{deliveryError}</p>
                ) : null}
              </div>
            )}

            {isExpectedDeliveryInFuture && <OrderWarningCard />}

            <OrderItemsCard
              items={order.items}
              total={formatUsd(
                order.items.reduce(
                  (sum, line) => sum + line.product.price * line.amount,
                  0,
                ),
              )}
            />
          </>
        )}
      </main>
    </div>
  );
}
