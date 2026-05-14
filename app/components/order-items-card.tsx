import Image from "next/image";

type OrderItemsCardProps = {
  items: Array<{
    product: {
      name: string;
      photo?: string;
    };
    amount: number;
  }>;
  total: string;
};

export function OrderItemsCard({ items, total }: OrderItemsCardProps) {
  return (
    <section className="space-y-4 rounded border border-[#c3caac]/20 bg-white p-6 shadow-sm">
      <h2 className="border-b border-[#c3caac]/20 pb-2 text-xs font-bold uppercase tracking-widest text-[#434933]">
        Order Items
      </h2>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={`${index}-${item.product.name}`}
            className="group flex items-center justify-between gap-4 border-b border-[#c3caac]/10 pb-3 last:border-b-0 last:pb-0"
          >
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border border-[#c3caac]/30 bg-[#f7faf8]">
                {item.product.photo ? (
                  <Image
                    src={item.product.photo}
                    alt={item.product.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs font-medium text-[#737a61]">
                    —
                  </span>
                )}
              </div>
              <span className="min-w-0 truncate text-sm font-medium transition-colors group-hover:text-[#4c6700]">
                {item.product.name}
              </span>
            </div>
            <span className="flex-shrink-0 rounded bg-[#f7faf8] px-2 py-1 text-xs font-bold text-[#434933]">
              x{item.amount}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-[#c3caac]/20 pt-4">
        <span className="text-lg font-bold">Total</span>
        <span className="text-xl font-bold text-[#4c6700]">{total}</span>
      </div>
    </section>
  );
}
