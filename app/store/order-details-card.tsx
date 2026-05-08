import Link from "next/link";

type OrderDetailsCardProps = {
  customer: string;
  orderNumber: string;
  status: "Preparing" | "Ready" | "Delivered";
  itemsLabel: string;
  total: string;
};

function statusStyles(status: OrderDetailsCardProps["status"]) {
  if (status === "Preparing") {
    return "bg-[#c1ff00] text-[#567300]";
  }
  if (status === "Ready") {
    return "bg-[#4c6700] text-white";
  }
  return "border border-[#c3caac] bg-[#e0e3e1] text-[#434933]";
}

export function OrderDetailsCard({
  customer,
  orderNumber,
  status,
  itemsLabel,
  total,
}: OrderDetailsCardProps) {
  return (
    <Link
      href={`/store/orders/${orderNumber.replace("#", "")}`}
      className={`border p-5 transition-colors duration-200 ${
        status === "Delivered"
          ? "border-[#c3caac]/10 bg-[#ebefed] opacity-75"
          : "border-[#c3caac]/20 bg-white hover:bg-[#f1f4f2]"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className={`text-xl font-bold ${status === "Delivered" ? "text-[#434933]" : "text-[#181c1b]"}`}>
            {customer}
          </h3>
          <p className={`text-sm font-medium tracking-wide ${status === "Delivered" ? "text-[#737a61]" : "text-[#434933]"}`}>
            {orderNumber}
          </p>
        </div>
        <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest italic ${statusStyles(status)}`}>
          {status}
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between border-t border-[#c3caac]/20 pt-4">
        <div className={`text-sm font-bold ${status === "Delivered" ? "text-[#737a61]" : "text-[#516070]"}`}>
          {itemsLabel}
        </div>
        <div className={`text-2xl font-bold ${status === "Delivered" ? "text-[#434933]" : "text-[#181c1b]"}`}>
          {total}
        </div>
      </div>
    </Link>
  );
}
