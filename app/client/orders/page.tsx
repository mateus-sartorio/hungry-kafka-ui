"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "../components/bottom-navigation";
import { useClientIdentity } from "../use-client-identity";
import { ClientHeader } from "../components/client-header";
import { OrderItem } from "../components/order-item";
import { formatElapsed, formatOrderCode } from "./order-format";
import type { OrderResponse } from "./order-types";

export default function ClientOrdersPage() {
  const router = useRouter();
  const { username, clientId } = useClientIdentity();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);

  useEffect(() => {
    if (!username || !clientId) {
      router.replace("/client/settings");
    }
  }, [clientId, router, username]);

  useEffect(() => {
    if (!clientId) {
      return;
    }

    let isActive = true;

    async function loadOrders() {
      setIsLoadingOrders(true);
      setHasLoadError(false);

      try {
        const response = await fetch(`http://localhost:8080/api/orders/client/${clientId}`);

        if (!response.ok) {
          throw new Error("Failed to load client orders");
        }

        const data = (await response.json()) as OrderResponse[];

        if (isActive) {
          setOrders(data);
        }
      } catch {
        if (isActive) {
          setOrders([]);
          setHasLoadError(true);
        }
      } finally {
        if (isActive) {
          setIsLoadingOrders(false);
        }
      }
    }

    void loadOrders();

    return () => {
      isActive = false;
    };
  }, [clientId]);

  if (!username) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#181c1b]">
      <ClientHeader username={username} />

      <main className="mx-auto max-w-7xl px-6 pb-32 pt-24">
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Orders</h2>
          </div>

          {isLoadingOrders ? (
            <p className="text-sm text-[#737a61]">Loading orders...</p>
          ) : hasLoadError ? (
            <p className="text-sm text-red-500">We could not load your orders right now.</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-[#737a61]">You have no orders yet.</p>
          ) : (
            <div className="overflow-hidden rounded-sm bg-white shadow-sm">
              {orders.map((order, index) => (
                <OrderItem
                  key={order.id}
                  order={order}
                  code={formatOrderCode(order.id)}
                  time={formatElapsed(order.createdAt)}
                  status={order.status}
                  isLast={index === orders.length - 1}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNavigation activeTab="orders" />
    </div>
  );
}
