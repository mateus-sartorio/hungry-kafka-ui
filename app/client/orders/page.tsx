"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "../components/bottom-navigation";
import { readStoredUsername } from "../user-config";
import { ClientHeader } from "../components/client-header";
import { OrderItem } from "../components/order-item";

const orders = [
  { code: "TXN-00142", time: "4.2 min", status: "In Preparation" },
  { code: "TXN-00143", time: "12.8 min", status: "Queued" },
  { code: "TXN-00144", time: "2.1 min", status: "Dispatching" },
  { code: "TXN-00145", time: "8.5 min", status: "In Preparation" },
];

export default function ClientOrdersPage() {
  const router = useRouter();
  const [username] = useState(() => readStoredUsername());

  useEffect(() => {
    if (!username) {
      router.replace("/client/settings");
    }
  }, [router, username]);

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

          <div className="overflow-hidden rounded-sm bg-white shadow-sm">
            {orders.map((order, index) => (
              <OrderItem
                key={order.code}
                code={order.code}
                time={order.time}
                status={order.status}
                isLast={index === orders.length - 1}
              />
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation activeTab="orders" />
    </div>
  );
}
