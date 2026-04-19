"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaMinus, FaPlus, FaTruck } from "react-icons/fa";

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
        <section className="rounded border border-[#c3caac]/20 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#434933]">
            Client Details
          </h2>
          <p className="text-xl font-bold">Sarah J.</p>
        </section>

        <section className="space-y-4 rounded border border-[#c3caac]/20 bg-white p-6 shadow-sm">
          <h2 className="border-b border-[#c3caac]/20 pb-2 text-xs font-bold uppercase tracking-widest text-[#434933]">
            Order Items
          </h2>
          <ul className="space-y-3">
            <li className="group flex items-center justify-between">
              <span className="text-sm transition-colors group-hover:text-[#4c6700]">Onyx Burger</span>
              <span className="rounded bg-[#f7faf8] px-2 py-1 text-xs font-bold text-[#434933]">x1</span>
            </li>
            <li className="group flex items-center justify-between">
              <span className="text-sm transition-colors group-hover:text-[#4c6700]">
                Neon Mochi Plate
              </span>
              <span className="rounded bg-[#f7faf8] px-2 py-1 text-xs font-bold text-[#434933]">x1</span>
            </li>
          </ul>
          <div className="flex items-center justify-between border-t border-[#c3caac]/20 pt-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-xl font-bold text-[#4c6700]">$45.90</span>
          </div>
        </section>

        <section className="space-y-6 rounded border border-[#c3caac]/20 bg-white p-6 shadow-sm">
          <div>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#434933]">
              Current Status
            </h2>
            <span className="inline-block bg-[#4c6700] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
              {status}
            </span>
            {estimatedDelivery ? (
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#516070]">
                ETA: {estimatedDelivery} min
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 bg-[#4c6700] px-4 py-4 text-sm font-bold uppercase text-white transition-all hover:bg-[#3c5300] active:scale-[0.98]"
            onClick={() => setIsDeliveryModalOpen(true)}
          >
            <FaTruck className="h-4 w-4" />
            Mark as Out for Delivery
          </button>
        </section>
      </main>

      {isDeliveryModalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#181c1b]/40 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md border border-[#c3caac]/20 bg-white shadow-[0_32px_64px_rgba(0,0,0,0.15)]">
            <div className="border-b border-[#c3caac]/10 p-8 text-center">
              <h2 className="mb-2 text-[20px] font-bold uppercase tracking-tight text-[#181c1b]">
                Set Expected Delivery Time
              </h2>
              <p className="text-[14px] font-medium leading-tight text-[#705a4f]">
                Confirm when the order will be ready for shipment or pickup.
              </p>
            </div>

            <div className="px-8 py-12">
              <div className="flex items-center justify-center gap-10">
                <button
                  type="button"
                  onClick={() => setDeliveryMinutes((current) => Math.max(1, current - 1))}
                  className="flex h-14 w-14 items-center justify-center border-2 border-[#c1ff00] text-[#4c6700] transition-all hover:bg-[#f1f4f2] active:scale-95"
                  aria-label="Decrease expected delivery minutes"
                >
                  <FaMinus className="h-4 w-4" />
                </button>

                <div className="text-center">
                  <div className="text-[80px] font-black italic leading-none tracking-tighter text-[#181c1b]">
                    {deliveryMinutes}
                  </div>
                  <div className="-mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4c6700]">
                    Minutes
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDeliveryMinutes((current) => current + 1)}
                  className="flex h-14 w-14 items-center justify-center border-2 border-[#c1ff00] text-[#4c6700] transition-all hover:bg-[#f1f4f2] active:scale-95"
                  aria-label="Increase expected delivery minutes"
                >
                  <FaPlus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 p-8 pt-0">
              <button
                type="button"
                className="group flex h-16 w-full items-center justify-between bg-[#c1ff00] px-6 transition-all hover:brightness-105 active:scale-[0.98]"
                onClick={() => {
                  setStatus("Out for Delivery");
                  setEstimatedDelivery(String(deliveryMinutes));
                  setIsDeliveryModalOpen(false);
                }}
              >
                <div className="flex items-center gap-4">
                  <FaTruck className="h-4 w-4 text-[#567300]" />
                  <span className="text-[12px] font-black uppercase tracking-wider text-[#567300]">
                    Confirm & Ship
                  </span>
                </div>
                <FaArrowRight className="h-4 w-4 text-[#567300] transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                className="w-full py-4 text-center text-[10px] font-bold uppercase tracking-widest text-[#705a4f] transition-colors hover:text-[#181c1b]"
                onClick={() => setIsDeliveryModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
