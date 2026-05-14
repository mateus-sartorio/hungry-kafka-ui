"use client";

import Link from "next/link";

type OrderDetailsCardProps = {
  href: string;
  customer: string;
  orderNumber: string;
  status: string;
  itemsLabel: string;
  total: string;
  createdAt: string;
  hideOrderLabel?: boolean;
};

function formatCreatedTime(createdAt: string): string {
  try {
    const date = new Date(createdAt);
    return date.toLocaleString("pt-BR", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

function statusBucket(status: string) {
  const s = status.toLowerCase();

  if (/\b(cancelled|canceled)\b/.test(s) || s.includes("cancelled")) {
    return "cancelled" as const;
  }

  if (/\b(delivered|completed|done)\b/.test(s) || s.includes("delivered")) {
    return "delivered" as const;
  }

  if (/\b(ready|dispatch)\b/.test(s) || s.includes("dispatch") || s.includes("out for")) {
    return "ready" as const;
  }

  return "preparing" as const;
}

function statusStyles(status: string) {
  const bucket = statusBucket(status);

  if (bucket === "preparing") {
    return "bg-[#c1ff00] text-[#567300]";
  }

  if (bucket === "ready") {
    return "bg-[#4c6700] text-white";
  }

  if (bucket === "cancelled") {
    return "border border-[#ef4444] bg-[#fee2e2] text-[#991b1b]";
  }

  return "border border-[#c3caac] bg-[#e0e3e1] text-[#434933]";
}

function isDeliveredLike(status: string) {
  return statusBucket(status) === "delivered" || statusBucket(status) === "cancelled";
}

export function OrderDetailsCard({
  href,
  customer,
  orderNumber,
  status,
  itemsLabel,
  total,
  createdAt,
  hideOrderLabel = false,
}: OrderDetailsCardProps) {
  const delivered = isDeliveredLike(status);

  return (
    <Link
      href={href}
      className={`border p-5 transition-colors duration-200 ${
        delivered
          ? "border-[#c3caac]/10 bg-[#ebefed] opacity-75"
          : "border-[#c3caac]/20 bg-white hover:bg-[#f1f4f2]"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className={`mb-2 text-xs ${delivered ? "text-[#737a61]" : "text-[#516070]"}`}>
            Ordered at: {formatCreatedTime(createdAt)}
          </p>
          <h3 className={`text-xl font-bold ${delivered ? "text-[#434933]" : "text-[#181c1b]"}`}>
            {hideOrderLabel ? orderNumber : customer}
          </h3>
          {!hideOrderLabel && (
            <p className={`text-sm font-medium tracking-wide ${delivered ? "text-[#737a61]" : "text-[#434933]"}`}>
              Order {orderNumber}
            </p>
          )}
        </div>
        <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest italic ${statusStyles(status)}`}>
          {status}
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-[#c3caac]/20 pt-4">
        <div className={`text-sm font-bold ${delivered ? "text-[#737a61]" : "text-[#516070]"}`}>
          {itemsLabel}
        </div>
        <div className={`text-2xl font-bold ${delivered ? "text-[#434933]" : "text-[#181c1b]"}`}>
          {total}
        </div>
      </div>
    </Link>
  );
}
