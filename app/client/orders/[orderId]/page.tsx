"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { readStoredUsername } from "../../user-config";
import { ClientHeader } from "../../components/client-header";
import { OrderStatusCard } from "./order-status-card";
import { OrderWarningCard } from "./order-warning-card";
import { OrderTotalSummary } from "./order-total-summary";
import { ProductDetails } from "./product-details";

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
        <OrderStatusCard orderCode={orderCode} />

        <OrderWarningCard />

        <div className="mb-12 space-y-6">
          {orderItems.map((item) => (
            <ProductDetails
              key={item.name}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>

        <OrderTotalSummary amount="$28.50" />
      </main>
    </div>
  );
}
