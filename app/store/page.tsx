"use client";

import { useMemo } from "react";
import { StoreHeader } from "./components/store-header";
import { OrderDetailsCard } from "../components/order-details-card";
import { formatItemsLabel, formatUsd, sortOrdersNewestFirst, sumOrderTotal, formatStatus } from "./store-order-format";
import { useStoreOrders } from "./store-orders-provider";

export default function StoreHomePage() {
  const { orders: rawOrders, hasError, isLoading } = useStoreOrders();
  const orders = useMemo(() => sortOrdersNewestFirst(rawOrders), [rawOrders]);

  return (
    <div className="min-h-screen bg-[#f7faf8] pb-8 pt-16 text-[#181c1b]">
      <StoreHeader />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {isLoading ? (
          <p className="text-sm text-[#737a61]">Loading orders...</p>
        ) : hasError ? (
          <p className="text-sm text-red-500">We could not load orders from the server.</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-[#737a61]">No orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {orders.map((order) => (
              <OrderDetailsCard
                key={order.id}
                href={`/store/orders/${order.id}`}
                customer={order.client?.clientName?.trim() || "—"}
                orderNumber={`#${order.id}`}
                status={formatStatus(order.status || "—")}
                itemsLabel={formatItemsLabel(order.items)}
                total={formatUsd(sumOrderTotal(order.items))}
                createdAt={order.createdAt}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
