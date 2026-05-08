type OrderItemsCardProps = {
  items: Array<{
    name: string;
    quantity: number;
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
        {items.map((item) => (
          <li key={item.name} className="group flex items-center justify-between">
            <span className="text-sm transition-colors group-hover:text-[#4c6700]">{item.name}</span>
            <span className="rounded bg-[#f7faf8] px-2 py-1 text-xs font-bold text-[#434933]">
              x{item.quantity}
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
