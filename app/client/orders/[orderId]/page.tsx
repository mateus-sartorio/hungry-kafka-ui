"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ClientHeader } from "../../components/client-header";
import { useClientIdentity } from "../../use-client-identity";
import { formatElapsed, formatOrderCode, formatUsd } from "../order-format";
import {
  parseOrderIdFromRouteSegment,
  readPersistedOrder,
} from "../order-detail-storage";
import type { OrderResponse } from "../order-types";
import { OrderStatusCard } from "./order-status-card";
import { OrderWarningCard } from "./order-warning-card";
import { OrderTotalSummary } from "./order-total-summary";
import { ProductDetails } from "./product-details";

async function fetchClientOrders(clientId: number): Promise<OrderResponse[]> {
  const response = await fetch(`http://localhost:8080/api/orders/client/${clientId}`);

  if (!response.ok) {
    throw new Error("Failed to load orders");
  }

  return (await response.json()) as OrderResponse[];
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const { username, clientId } = useClientIdentity();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const routeOrderSegment = useMemo(() => {
    const raw = params.orderId;
    return (Array.isArray(raw) ? raw[0] : raw) ?? "";
  }, [params.orderId]);

  const numericOrderId = useMemo(
    () => parseOrderIdFromRouteSegment(routeOrderSegment),
    [routeOrderSegment],
  );

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

    let isActive = true;

    setIsReady(false);
    setHasError(false);

    async function resolveOrder() {
      const cached = readPersistedOrder(orderId);

      if (
        cached &&
        cached.clientId === cid &&
        cached.id === orderId
      ) {
        if (isActive) {
          setOrder(cached);
          setHasError(false);
          setIsReady(true);
        }

        return;
      }

      try {
        const orders = await fetchClientOrders(cid);
        const found = orders.find((o) => o.id === orderId);

        if (!found || found.clientId !== cid) {
          throw new Error("Order not found");
        }

        if (isActive) {
          setOrder(found);
          setHasError(false);
          setIsReady(true);
        }
      } catch {
        if (isActive) {
          setOrder(null);
          setHasError(true);
          setIsReady(true);
        }
      }
    }

    void resolveOrder();

    return () => {
      isActive = false;
    };
  }, [clientId, numericOrderId, username]);

  if (!username) {
    return null;
  }

  if (numericOrderId === null) {
    return (
      <div className="min-h-screen bg-[#f7faf8] text-[#181c1b]">
        <ClientHeader username={username} backHref="/client/orders" />

        <main className="mx-auto max-w-3xl px-6 py-24">
          <p className="text-sm text-red-500">Invalid order link.</p>
        </main>
      </div>
    );
  }

  const orderCode = formatOrderCode(numericOrderId);

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#181c1b]">
      <ClientHeader username={username} backHref="/client/orders" />

      <main className="mx-auto max-w-3xl px-6 py-24">
        {!isReady ? (
          <p className="text-sm text-[#737a61]">Loading order...</p>
        ) : hasError || !order ? (
          <p className="text-sm text-red-500">We could not load this order.</p>
        ) : (
          <>
            <OrderStatusCard
              orderCode={orderCode}
              status={order.status}
              estimate={`Placed ${formatElapsed(order.createdAt)} ago`}
            />

            <OrderWarningCard />

            <div className="mb-12 space-y-6">
              {order.items.map((line, index) => (
                <ProductDetails
                  key={`${line.product.id}-${index}`}
                  name={
                    line.amount > 1
                      ? `${line.product.name} × ${line.amount}`
                      : line.product.name
                  }
                  price={formatUsd(line.product.price * line.amount)}
                  image={line.product.photo}
                />
              ))}
            </div>

            <OrderTotalSummary
              amount={formatUsd(
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
