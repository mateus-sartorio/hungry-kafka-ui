"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { readStoredUsername } from "../../user-config";
import { ClientHeader } from "../../components/client-header";

const orderItems = [
  {
    name: "Neon Classic Burger",
    price: "$14.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCDbHUeYAff6bn4hzravzGnV6cihd4S7WCLKVWa_ZxdxK_Jx5mXLb4Ld-Zcw2ik3_5AE3NONQX55FiuVHr-osSd7HW3L2KALx4xWsmZsFOpwRd1KbwL1C0tRQjKw5NvJNh2jmydPtZiQNkm-evgDOdQB_zN8xTa2CPhuCbDgDolx3Ejah2lt1GJ0GkFm4GQlTQP5THleOsj7xDDq7yIrg10RWyettsgEDUpt0eyMRCeHyhsP-sPXPTX2608rYbixq4Epg6_Qgg-Jg",
  },
  {
    name: "Truffle Dust Fries",
    price: "$8.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDNoMI65Hr9vxe9eq3URj9T6jT4spuIdxET4m4waqW-HSKB8uIj9ZA-sJXx7cZrcKiS83DHN0FjET3rxLLn_GNQp9gG65UDxgiRaiHb98TTFAETyoFKi8wNHl2lcwovI6EG3RGTRbciO3kOrtvaFdRwUIjfSDynxVQPCfBVC1c-rx2GkYvDJEitpCCvQcT0-mtyRxnzjaJTJBpnuxL3J1suwadqEHXMY5g3qULbNaXjSmVtRGsIVBL6JcaZ5YCvDU8ORmcFkkVbnw",
  },
  {
    name: "Cyber Matcha Iced",
    price: "$6.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBtox-30qiZCIQ9NFFuNUkQjc4CERb45PjVgcvbIhxWy2RYDlKX0tOSxYDuI84kXO5uk7O-y60D1GiyOTEAGvYfuBxn6Y1UR3QQaMgYSOluJS4161N-Ed17_KjnsaZO_gZfZRX80wSV0D_i6w8NE-YtT0GYGlsb7LfTQclez7LkMfpyoD6Scd-LpJ6Cvkb0dSnAqNXi0mUvlcBU3DjcH6Y8bWKapf6iriGjlgLsty3JZM_bkggnlJrEiM5k6SDpaUq8V2f8ksRlJg",
  },
];

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const [username] = useState(() => readStoredUsername());
  const orderCode = useMemo(() => params.orderId.toUpperCase(), [params.orderId]);

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
      <ClientHeader username={username} backHref="/client/orders" />

      <main className="mx-auto max-w-3xl px-6 py-24">
        <div className="mb-12">
          <h1 className="mb-2 text-2xl font-bold">Order {orderCode}</h1>
          <div className="flex items-center gap-2">
            <span className="bg-[#c1ff00] px-3 py-1 text-[10px] font-black italic uppercase tracking-widest text-[#567300]">
              Status: Preparing
            </span>
            <span className="text-sm text-[#434933]">Est. 15-20 mins</span>
          </div>
        </div>

        <div className="mb-10 flex items-start gap-4 border-l-4 border-[#c1ff00] bg-[#181c1b] p-5 text-[#f7faf8]">
          <div className="bg-[#c1ff00] p-2 text-xl text-[#567300]">!</div>
          <div className="flex-1">
            <h4 className="mb-1 text-sm font-black italic uppercase tracking-tight text-[#c1ff00]">
              Order delayed?
            </h4>
            <p className="text-sm leading-relaxed opacity-90">
              Our kitchen is busier than usual. We&apos;re working on it! Your fresh meal will be
              ready as soon as possible.
            </p>
          </div>
        </div>

        <div className="mb-12 space-y-6">
          {orderItems.map((item) => (
            <article
              key={item.name}
              className="group flex items-center justify-between bg-white p-4 shadow-sm outline outline-1 outline-[#c3caac]/20 transition-colors hover:bg-[#f1f4f2]"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  unoptimized
                  className="h-16 w-16 object-cover outline outline-1 outline-[#c3caac]/20"
                />
                <h3 className="text-lg font-bold transition-all group-hover:italic">{item.name}</h3>
              </div>
              <span className="text-lg font-medium">{item.price}</span>
            </article>
          ))}
        </div>

        <div className="flex items-end justify-between border-t border-[#c3caac]/20 pt-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#434933]">Total Amount</div>
          <div className="text-3xl font-black italic text-[#4c6700]">$28.50</div>
        </div>
      </main>
    </div>
  );
}
