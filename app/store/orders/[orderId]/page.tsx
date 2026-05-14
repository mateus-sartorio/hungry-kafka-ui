"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { formatUsd, sumOrderTotal } from "../../store-order-format";
import {
  formatStoreStatusBadge,
  normalizeStoreOrderStatus,
  type StoreKafkaOrderStatus,
} from "../../store-order-status";
import {
  parseStoreOrderIdFromRouteSegment,
  readPersistedStoreOrder,
} from "../../store-order-detail-storage";
import { fetchAllStoreOrders } from "../../store-orders-api";
import type { StoreOrderResponse } from "../../store-order-types";
import { OrderClientDetailsCard } from "./order-client-details-card";
import { OrderDeliveryModal } from "./order-delivery-modal";
import { OrderItemsCard } from "../../../components/order-items-card";
import { OrderStatusCard, type OrderStatusPrimaryAction } from "./order-status-card";

export default function StoreOrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [deliveryMinutes, setDeliveryMinutes] = useState(15);
  const [status, setStatus] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState<string | null>(null);
  const [order, setOrder] = useState<StoreOrderResponse | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);
  const [statusSubmitError, setStatusSubmitError] = useState("");

  const routeSegment = useMemo(() => {
    const raw = params.orderId;
    return (Array.isArray(raw) ? raw[0] : raw) ?? "";
  }, [params.orderId]);

  const numericOrderId = useMemo(
    () => parseStoreOrderIdFromRouteSegment(routeSegment),
    [routeSegment],
  );

  const statusPhase = useMemo(() => normalizeStoreOrderStatus(status), [status]);

  const statusBadge = useMemo(
    () => formatStoreStatusBadge(statusPhase, status),
    [status, statusPhase],
  );

  useEffect(() => {
    if (numericOrderId === null) {
      setOrder(null);
      setHasError(false);
      setIsReady(true);
      return;
    }

    let isActive = true;

    setIsReady(false);
    setHasError(false);

    const orderId = numericOrderId;

    async function resolveOrder() {
      const cached = readPersistedStoreOrder(orderId);

      if (cached && cached.id === orderId) {
        if (isActive) {
          setOrder(cached);
          setStatus(cached.status);
          setHasError(false);
          setIsReady(true);
        }

        return;
      }

      try {
        const { orders, error } = await fetchAllStoreOrders();

        if (error) {
          throw new Error("Failed to load orders");
        }

        const found = orders.find((o) => o.id === orderId);

        if (!found) {
          throw new Error("Order not found");
        }

        if (isActive) {
          setOrder(found);
          setStatus(found.status);
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
  }, [numericOrderId]);

  const submitOrderStatus = useCallback(async (kafkaStatus: StoreKafkaOrderStatus, nextDisplayStatus: string, deliveryMinutes?: number) => {
    if (!order) {
      return false;
    }

    setStatusSubmitError("");
    setIsSubmittingStatus(true);

    try {
      const payload: Record<string, unknown> = {
        orderId: order.id,
        status: kafkaStatus,
        userId: order.client?.clientId != null ? String(order.client.clientId) : "",
        category: "ORDER_STATUS",
      };

      // Convert deliveryMinutes to ISO 8601 duration format (e.g., "PT15M" for 15 minutes)
      if (kafkaStatus === "OUT_FOR_DELIVERY" && deliveryMinutes) {
        payload.expectedDelivery = `PT${deliveryMinutes}M`;
      }

      const response = await fetch("/api/orders/status-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message ?? "Failed to publish order status");
      }

      setStatus(nextDisplayStatus);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setStatusSubmitError(message);
      return false;
    } finally {
      setIsSubmittingStatus(false);
    }
  }, [order]);

  const primaryAction = useMemo((): OrderStatusPrimaryAction | null => {
    switch (statusPhase) {
      case "CREATED":
        return {
          label: "ACCEPT",
          icon: "check",
          onClick: () => void submitOrderStatus("ACCEPTED", "ACCEPTED"),
        };
      case "ACCEPTED":
        return {
          label: "START PREPARING",
          icon: "clock",
          onClick: () => void submitOrderStatus("PREPARING", "PREPARING"),
        };
      case "PREPARING":
        return {
          label: "OUT FOR DELIVERY",
          icon: "truck",
          onClick: () => {
            setStatusSubmitError("");
            setIsDeliveryModalOpen(true);
          },
        };
      default:
        return null;
    }
  }, [statusPhase, submitOrderStatus]);

  const secondaryAction = useMemo(() => {
    if (statusPhase === "CREATED") {
      return {
        label: "CANCEL ORDER",
        onClick: () => {
          if (window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
            void submitOrderStatus("CANCELLED", "CANCELLED");
          }
        },
      };
    }
    return null;
  }, [statusPhase, submitOrderStatus]);

  const readOnlyMessage = useMemo(() => {
    if (statusPhase === "OUT_FOR_DELIVERY") {
      return "This order is out for delivery. The store workflow is complete; further updates happen outside the store dashboard.";
    }

    if (statusPhase === "DELIVERED") {
      return "This order has been delivered.";
    }

    if (statusPhase === "CANCELLED") {
      return "This order has been cancelled. No further actions can be taken.";
    }

    if (statusPhase === "UNKNOWN") {
      return "This order status is not recognized for store actions. Try refreshing after the server updates.";
    }

    return null;
  }, [statusPhase]);

  const orderCode = numericOrderId !== null ? `#${numericOrderId}` : "#—";

  if (numericOrderId === null) {
    return (
      <div className="min-h-screen bg-[#f7faf8] font-sans text-[#181c1b] antialiased">
        <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-[#ffffffcc] px-6 py-4 shadow-[0_4px_32px_rgba(24,28,27,0.04)] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Link
              href="/store"
              className="rounded-full p-1 text-[#4c6700] transition-colors hover:bg-lime-400/10"
              aria-label="Back to store orders"
            >
              <FaArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-lg font-bold italic uppercase tracking-tighter text-[#4c6700]">
              Invalid order
            </h1>
          </div>
          <div className="w-6" />
        </header>

        <main className="mx-auto max-w-3xl px-6 pb-20 pt-24">
          <p className="text-sm text-red-500">This order link is not valid.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7faf8] font-sans text-[#181c1b] antialiased">
      <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-[#ffffffcc] px-6 py-4 shadow-[0_4px_32px_rgba(24,28,27,0.04)] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/store"
            className="rounded-full p-1 text-[#4c6700] transition-colors hover:bg-lime-400/10"
            aria-label="Back to store orders"
          >
            <FaArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-bold italic uppercase tracking-tighter text-[#4c6700]">
            Order {orderCode}
          </h1>
        </div>
        <div className="w-6" />
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-6 pb-20 pt-24">
        {!isReady ? (
          <p className="text-sm text-[#737a61]">Loading order...</p>
        ) : hasError || !order ? (
          <p className="text-sm text-red-500">We could not load this order.</p>
        ) : (
          <>
            <OrderClientDetailsCard clientName={order.client?.clientName?.trim() || "—"} />

            <OrderItemsCard
              items={order.items}
              total={formatUsd(sumOrderTotal(order.items))}
            />

            <OrderStatusCard
              statusBadge={statusBadge}
              estimatedDelivery={estimatedDelivery}
              primaryAction={primaryAction}
              secondaryAction={secondaryAction}
              readOnlyMessage={readOnlyMessage}
              disabled={isSubmittingStatus}
              actionError={statusSubmitError}
            />
          </>
        )}
      </main>

      <OrderDeliveryModal
        isOpen={isDeliveryModalOpen}
        deliveryMinutes={deliveryMinutes}
        isSubmitting={isSubmittingStatus}
        onDecreaseDeliveryMinutes={() => setDeliveryMinutes((current) => Math.max(1, current - 1))}
        onIncreaseDeliveryMinutes={() => setDeliveryMinutes((current) => current + 1)}
        onConfirm={() => {
          void (async () => {
            const ok = await submitOrderStatus("OUT_FOR_DELIVERY", "OUT FOR DELIVERY", deliveryMinutes);
            if (ok) {
              setEstimatedDelivery(String(deliveryMinutes));
              setIsDeliveryModalOpen(false);
            }
          })();
        }}
        onClose={() => setIsDeliveryModalOpen(false)}
      />
    </div>
  );
}
