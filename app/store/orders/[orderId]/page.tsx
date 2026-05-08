"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { OrderClientDetailsCard } from "./order-client-details-card";
import { OrderDeliveryModal } from "./order-delivery-modal";
import { OrderItemsCard } from "./order-items-card";
import { OrderStatusCard } from "./order-status-card";

export default function StoreOrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [deliveryMinutes, setDeliveryMinutes] = useState(15);
  const [status, setStatus] = useState("Preparing");
  const [estimatedDelivery, setEstimatedDelivery] = useState<string | null>(null);
  const orderCode = `#${params.orderId ?? "4429"}`;

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
        <OrderClientDetailsCard clientName="Sarah J." />
        <OrderItemsCard
          items={[
            { name: "Onyx Burger", quantity: 1 },
            { name: "Neon Mochi Plate", quantity: 1 },
          ]}
          total="$45.90"
        />

        <OrderStatusCard
          status={status}
          estimatedDelivery={estimatedDelivery}
          onMarkAsOutForDelivery={() => setIsDeliveryModalOpen(true)}
        />
      </main>

      <OrderDeliveryModal
        isOpen={isDeliveryModalOpen}
        deliveryMinutes={deliveryMinutes}
        onDecreaseDeliveryMinutes={() => setDeliveryMinutes((current) => Math.max(1, current - 1))}
        onIncreaseDeliveryMinutes={() => setDeliveryMinutes((current) => current + 1)}
        onConfirm={() => {
          setStatus("Out for Delivery");
          setEstimatedDelivery(String(deliveryMinutes));
          setIsDeliveryModalOpen(false);
        }}
        onClose={() => setIsDeliveryModalOpen(false)}
      />
    </div>
  );
}
