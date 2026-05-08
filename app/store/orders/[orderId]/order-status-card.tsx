import { FaTruck } from "react-icons/fa";

type OrderStatusCardProps = {
  status: string;
  estimatedDelivery: string | null;
  onMarkAsOutForDelivery: () => void;
};

export function OrderStatusCard({
  status,
  estimatedDelivery,
  onMarkAsOutForDelivery,
}: OrderStatusCardProps) {
  return (
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
        onClick={onMarkAsOutForDelivery}
      >
        <FaTruck className="h-4 w-4" />
        Mark as Out for Delivery
      </button>
    </section>
  );
}
