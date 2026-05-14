"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "../components/bottom-navigation";
import { useClientIdentity } from "../use-client-identity";
import { ClientHeader } from "../components/client-header";
import { OrderDetailsCard } from "../../components/order-details-card";
import { useClientOrders } from "../use-client-orders";
import { formatOrderCode, formatStatus, formatUsd, formatItemsLabel, sumOrderTotal } from "./order-format";

export default function ClientOrdersPage() {
  const router = useRouter();
  const { username, clientId } = useClientIdentity();
  const { orders, isLoading: isLoadingOrders, hasError: hasLoadError } = useClientOrders();

  useEffect(() => {
    if (!username || !clientId) {
      router.replace("/client/settings");
    }
  }, [clientId, router, username]);

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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {orders.map((order) => (
                <OrderDetailsCard
                  key={order.id}
                  href={`/client/orders/${order.id}`}
                  customer={formatOrderCode(order.id)}
                  orderNumber={`Order #${order.id}`}
                  status={formatStatus(order.status)}
                  itemsLabel={formatItemsLabel(order.items)}
                  total={formatUsd(sumOrderTotal(order.items))}
                  createdAt={order.createdAt}
                  hideOrderLabel={true}
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
