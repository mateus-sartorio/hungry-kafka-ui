import { StoreHeader } from "./components/store-header";
import Link from "next/link";

type StoreOrder = {
  customer: string;
  orderNumber: string;
  status: "Preparing" | "Ready" | "Delivered";
  itemsLabel: string;
  total: string;
};

const storeOrders: StoreOrder[] = [
  {
    customer: "Sarah J.",
    orderNumber: "#4429",
    status: "Preparing",
    itemsLabel: "3 Items",
    total: "$45.90",
  },
  {
    customer: "Michael T.",
    orderNumber: "#4428",
    status: "Ready",
    itemsLabel: "1 Item",
    total: "$18.50",
  },
  {
    customer: "Elena R.",
    orderNumber: "#4430",
    status: "Preparing",
    itemsLabel: "5 Items",
    total: "$82.00",
  },
  {
    customer: "David W.",
    orderNumber: "#4427",
    status: "Delivered",
    itemsLabel: "2 Items",
    total: "$31.25",
  },
];

function statusStyles(status: StoreOrder["status"]) {
  if (status === "Preparing") {
    return "bg-[#c1ff00] text-[#567300]";
  }
  if (status === "Ready") {
    return "bg-[#4c6700] text-white";
  }
  return "border border-[#c3caac] bg-[#e0e3e1] text-[#434933]";
}

export default function StoreHomePage() {
  return (
    <div className="min-h-screen bg-[#f7faf8] pb-8 pt-16 text-[#181c1b]">
      <StoreHeader />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {storeOrders.map((order) => (
            <Link
              key={order.orderNumber}
              href={`/store/orders/${order.orderNumber.replace("#", "")}`}
              className={`border p-5 transition-colors duration-200 ${
                order.status === "Delivered"
                  ? "border-[#c3caac]/10 bg-[#ebefed] opacity-75"
                  : "border-[#c3caac]/20 bg-white hover:bg-[#f1f4f2]"
              }`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      order.status === "Delivered" ? "text-[#434933]" : "text-[#181c1b]"
                    }`}
                  >
                    {order.customer}
                  </h3>
                  <p
                    className={`text-sm font-medium tracking-wide ${
                      order.status === "Delivered" ? "text-[#737a61]" : "text-[#434933]"
                    }`}
                  >
                    {order.orderNumber}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest italic ${statusStyles(order.status)}`}
                >
                  {order.status}
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-[#c3caac]/20 pt-4">
                <div
                  className={`text-sm font-bold ${
                    order.status === "Delivered" ? "text-[#737a61]" : "text-[#516070]"
                  }`}
                >
                  {order.itemsLabel}
                </div>
                <div
                  className={`text-2xl font-bold ${
                    order.status === "Delivered" ? "text-[#434933]" : "text-[#181c1b]"
                  }`}
                >
                  {order.total}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
