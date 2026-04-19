"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaReceipt, FaUser, FaUtensils } from "react-icons/fa";
import { readStoredUsername } from "../user-config";
import { ClientHeader } from "../components/client-header";

const orders = [
  { code: "TXN-00142", time: "4.2 min", status: "In Preparation" },
  { code: "TXN-00143", time: "12.8 min", status: "Queued" },
  { code: "TXN-00144", time: "2.1 min", status: "Dispatching" },
  { code: "TXN-00145", time: "8.5 min", status: "In Preparation" },
];

function statusClasses(status: string) {
  if (status === "In Preparation") {
    return "bg-[#c1ff00] text-[#567300]";
  }
  if (status === "Dispatching") {
    return "bg-[#fbdcce] text-[#574238]";
  }
  return "bg-[#e0e3e1] text-[#737a61]";
}

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
              <Link
                key={order.code}
                href={`/client/orders/${order.code.toLowerCase()}`}
                className={`flex items-center justify-between p-4 transition-colors duration-200 hover:bg-[#f1f4f2] ${
                  index < orders.length - 1 ? "border-b border-[#c3caac]/20" : ""
                }`}
              >
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold uppercase tracking-widest">{order.code}</span>
                  <div className="flex items-center gap-1 text-[#516070]">
                    <span className="text-sm">⏱</span>
                    <span className="text-sm font-medium">{order.time}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-[10px] font-black italic uppercase tracking-tight ${statusClasses(order.status)}`}
                >
                  {order.status}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 z-50 flex h-20 w-full items-center justify-around border-t border-zinc-200 bg-white/95 px-4 backdrop-blur-xl shadow-[0_-8px_32px_rgba(24,28,27,0.04)] md:hidden">
        <Link href="/" className="flex flex-col items-center justify-center gap-1 text-zinc-500">
          <FaUtensils className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.05em]">Catalog</span>
        </Link>
        <Link href="/client/orders" className="flex flex-col items-center justify-center gap-1 text-zinc-900">
          <FaReceipt className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.05em]">Orders</span>
        </Link>
        <Link
          href="/client/settings"
          className="flex flex-col items-center justify-center gap-1 text-zinc-500"
        >
          <FaUser className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.05em]">Account</span>
        </Link>
      </nav>
    </div>
  );
}
