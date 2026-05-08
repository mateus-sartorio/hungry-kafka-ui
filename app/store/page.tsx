import { StoreHeader } from "./components/store-header";
import { OrderDetailsCard } from "./order-details-card";

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

export default function StoreHomePage() {
  return (
    <div className="min-h-screen bg-[#f7faf8] pb-8 pt-16 text-[#181c1b]">
      <StoreHeader />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {storeOrders.map((order) => (
            <OrderDetailsCard
              key={order.orderNumber}
              customer={order.customer}
              orderNumber={order.orderNumber}
              status={order.status}
              itemsLabel={order.itemsLabel}
              total={order.total}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
