"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaReceipt, FaUser, FaUtensils } from "react-icons/fa";
import { readStoredUsername } from "./user-config";
import { ClientHeader } from "./components/client-header";

const products = [
  {
    name: "The Onyx Burger",
    price: "$28.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAy2M0EO8QSjAn83DZ5ulE703qjgmVPaQK_ecWe10MD2an628SlGh2vkOxDlPIvQB8-iyLZvKKozTCeBM_K66cFzBmaoFEstrbPuqGggawRCw9v16d9o4AXc0NIyggm68M0b4vZJpqWqyjjr05xOnIcMBujmt-Lp9HAP9Vp9mzhcHC97IMvIlSfBRWNS276eXjvkoDmyvPUTAX9QF1dfL8VB8GjyECXAwuM7EqKih4lxo6rNebSV0MdTFSDw-8JFhbUMtEvLavTbg",
    large: true,
  },
  {
    name: "Luminous Toast",
    price: "$16.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXyTUqfqK0aknpNt6xaqVsB814ZYXTbhVDIZaRsa33jvBYsXG7pYEG1OJcpfgWjkBHjSPgzy5xDHyrUoLtFU-76eYNT9BU21_2Mp7bxjvCXVyC937kK-ld3lJFfW_Ia8aj3T9p_tg6eW8wkju2ZTqUDBuFlXW2flJBrX-KaAf8-qKe-iqovFcHwZTuY5Owjzbj-fsC7SzaiBD6nTrBt7ZbJ2oOXpAFOY0fpqUEO6NccQlHuP-pAgoAO65ic4JL9jhA90YdCn6Tgg",
  },
  {
    name: "Truffle Reserve Mac",
    price: "$19.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCm7NECFuPO9S3Owje-Ny1c2WtB0QkvNRQst5BEkLQkpQPbRWjl9u5d6KoGT5zev059Vc4-7i5T-U3CNHe_olj-VoQuH0an95wR3AaopW5CR8vKgeviI6F7JXeuhtsxSUX_XcUfhMzgPyMqTcYe9vWX75z7mtcpPhezIbreAxrfvs4JJB2UkUSTN2hexMMv-RYc37RJMDYIYMgcfoSLspS_CiELVfPIoAGENUH2MmIWSpCcFVWZ-5qKSfKSf-zMjr4t4ygx_UYJ6w",
  },
  {
    name: "Kinetic Scallops",
    price: "$24.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBlUoFWHJfis-k37S7Ef7VjnOBfWwyDE7VTXS1aOD5E25Y3tZSPkDa6PitH3Lr8jSePOkU-7qfFCn4aoAEKKH7p39Z-tXVwCOkthcfS4oMZcTYQ74-zNoL5dLdhXlnDtFWzsI51SkJivVtm1S2zDS2yYXpVYvloRolT9BITTI_GS3ZVEWZjL5FJg0b8UOHENDrVxqYshrlDAgeGlUU5RSS_OXLEd7r5BMu20VumQoIaZNS0WFjtyWMRWPbOPeWv_AfzOyr-IMKynQ",
  },
  {
    name: "Neon Mochi Plate",
    price: "$12.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_VQ7ASbZnb_K6j23t5eIRkuxCByDIOprqP9rjmi5aa5djyILCL9CZUU2vvaSyJQq0YFKlBVoZeny9cFhZ8I4ZeQnxCWzi44opLK7upY2UnVUHkVgVsHity7gH6ZZGWdqhefpIiFt02pL3a0ngOt4z7UWu238YL80s2qid4NKoHu10YrTyHlmwoPxwL7skdCt7zgJGQG0iJ_mlfpVBKsNnV298V-2KvLp62ZPMxcn5cPdMjUDAJOYjkpVRifEq7GL8GqQkjx-m2g",
  },
];

const cartItems = [
  {
    name: "Onyx Burger",
    unitPrice: 18.5,
    qty: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQpyiuucfe9yQi66UdgKK9oJUI_tbucNeqHQFxIaGEatzns4WJ6__ZP7aoGHN7gFfMSX0dWJAWHYt4PYolp-RDxdUK4XZjCu0-w1a-OnzkWxk4EGs9BoNYY19eXyaPT_PZSWa8jZRQiaw0NdDS8Wz0rTvol_Y_hvkHYn5OyVlX4XXi5FR8xNRiV82iJuxYz7UBrGnjd8z8rC4LKzKTvOp2LvrziF7rkJyUdymKYTw4QTlx-0rT4E6xTPuNGZXTwqkmZNPhknFHww",
  },
  {
    name: "Neon Mochi Plate",
    unitPrice: 12,
    qty: 2,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAo90IQz8hBE_reYwIbDavV2jXHeEcHMVEg63w6zte38eRyUF9kDyem9qZgazNqebCHVTBkP5YCSK5hW7jiTXYnR4U4afh_2dW44TsSAbBmUFvXeSGoomrh_spLToLjgAgkpqjnQy5U7OWCdlRHnbQFTmM-YFutguny5VAgEZBrG0Efn7XE2e_8XpvnCi_BaaN5ELe1f_hZYXOTCgLm3VyPB350TvA_M371s-ZZBUXvrj1eQaQ_HE8dFIQsa6jYLSLXEZWQ8YWxtA",
  },
];

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function ClientHomePage() {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [username] = useState(() => readStoredUsername());
  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0),
    [],
  );

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
      <ClientHeader username={username} className={isCartOpen ? "blur-[2px]" : ""} />

      <main
        className={`mx-auto max-w-7xl px-6 pb-28 pt-20 transition-all duration-300 ${
          isCartOpen ? "pointer-events-none blur-sm" : ""
        }`}
      >
        <section className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Live Orders</h2>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#705a4f]">
            Real-time status
          </p>

          <div className="mt-6 rounded-xl bg-[#f1f4f2] p-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">Order #4429</p>
              <div className="text-right">
                <p className="text-2xl font-black text-[#4c6700]">08:14</p>
                <p className="text-[10px] font-bold uppercase text-[#705a4f]">Est. Delivery</p>
              </div>
            </div>

            <div className="mb-2 mt-4 h-1 w-full rounded-full bg-[#c3caac]/30">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#4c6700] to-[#c1ff00] shadow-[0_0_12px_rgba(193,255,0,0.5)]" />
            </div>
            <div className="flex justify-between text-[10px] font-extrabold uppercase">
              <span className="text-[#4c6700]">Confirmed</span>
              <span className="text-[#4c6700]">Preparing</span>
              <span className="text-[#705a4f] opacity-40">Out for delivery</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-4xl font-black tracking-tighter">The Catalog</h2>
          <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#705a4f]">
            Curated Daily Selection
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12">
            {products.map((product) =>
              product.large ? (
                <article
                  key={product.name}
                  className="flex flex-col items-center gap-8 rounded-xl border border-[#c3caac]/20 bg-white p-4 shadow-sm md:col-span-12 md:flex-row lg:col-span-8"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={1024}
                    height={768}
                    unoptimized
                    className="aspect-video w-full rounded-xl object-cover md:aspect-square md:w-1/2 lg:aspect-[4/3]"
                  />
                  <div className="w-full md:w-1/2">
                    <h3 className="mb-4 text-3xl font-bold">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{product.price}</span>
                      <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1f4f2] text-xl text-[#4c6700] hover:bg-[#e6e9e7]">
                        +
                      </button>
                    </div>
                  </div>
                </article>
              ) : (
                <article
                  key={product.name}
                  className="flex flex-col rounded-xl border border-[#c3caac]/20 bg-white p-4 shadow-sm md:col-span-6 lg:col-span-4"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={800}
                    height={800}
                    unoptimized
                    className="mb-3 aspect-square w-full rounded-xl object-cover"
                  />
                  <h4 className="mb-2 text-xl font-bold">{product.name}</h4>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-lg font-bold">{product.price}</span>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f4f2] text-lg text-[#4c6700] hover:bg-[#e6e9e7]">
                      +
                    </button>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>
      </main>

      <div className="fixed bottom-24 right-6 z-40 md:right-10">
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex h-16 w-16 flex-col items-center justify-center rounded-sm bg-[#4c6700] text-white shadow-xl transition active:scale-95"
          aria-label="Open cart overlay"
        >
          <span className="text-xl">🛍</span>
          <span className="text-[10px] font-black">3</span>
        </button>
      </div>

      <nav
        className={`fixed bottom-0 z-50 flex h-20 w-full items-center justify-around border-t border-zinc-200 bg-white/95 px-4 backdrop-blur-xl transition-all md:hidden ${
          isCartOpen ? "pointer-events-none blur-sm" : ""
        }`}
      >
        <Link href="/" className="flex flex-col items-center gap-1 text-zinc-900">
          <FaUtensils className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.05em]">Catalog</span>
        </Link>
        <Link href="/client/orders" className="flex flex-col items-center gap-1 text-zinc-500">
          <FaReceipt className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.05em]">Orders</span>
        </Link>
        <Link href="/client/settings" className="flex flex-col items-center gap-1 text-zinc-500">
          <FaUser className="h-4 w-4" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.05em]">Account</span>
        </Link>
      </nav>

      {isCartOpen ? (
        <>
          <button
            className="fixed inset-0 z-[60] bg-zinc-900/70"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart overlay"
          />

          <section className="fixed bottom-0 left-0 z-[70] flex max-h-[86vh] w-full flex-col rounded-t-3xl bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.12)] md:bottom-auto md:left-auto md:right-6 md:top-24 md:h-[600px] md:max-h-[600px] md:max-w-md md:rounded-3xl">
            <div className="sticky top-0 rounded-t-3xl border-b border-zinc-100 bg-white px-6 pb-4 pt-3">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-zinc-200 md:hidden" />
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
                  aria-label="Close cart"
                >
                  X
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
              {cartItems.map((item) => (
                <article key={item.name} className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-zinc-200/70 bg-zinc-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold leading-tight">{item.name}</h3>
                      <span className="whitespace-nowrap font-semibold text-zinc-900">
                        {formatUsd(item.qty * item.unitPrice)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-zinc-200 bg-zinc-100 p-1">
                        <button className="flex h-6 w-6 items-center justify-center text-zinc-500">
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                        <button className="flex h-6 w-6 items-center justify-center text-zinc-500">
                          +
                        </button>
                      </div>
                      <button className="text-xs font-medium text-red-500 underline underline-offset-2">
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <footer className="border-t border-zinc-100 bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-black text-zinc-900">{formatUsd(total)}</span>
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c8f53c] py-4 text-lg font-bold text-zinc-900 shadow-[0_4px_14px_0_rgba(200,245,60,0.39)] transition hover:bg-[#b0d934] active:scale-[0.98]">
                Checkout Now
                <span aria-hidden="true">-&gt;</span>
              </button>
            </footer>
          </section>
        </>
      ) : null}
    </div>
  );
}
