type OrderStatusCardProps = {
  orderCode: string;
  status?: string;
  estimate?: string;
};

export function OrderStatusCard({
  orderCode,
  status = "Preparing",
  estimate = "Est. 15-20 mins",
}: OrderStatusCardProps) {
  return (
    <div className="mb-12">
      <h1 className="mb-2 text-2xl font-bold">Order {orderCode}</h1>
      <div className="flex items-center gap-2">
        <span className="bg-[#c1ff00] px-3 py-1 text-[10px] font-black italic uppercase tracking-widest text-[#567300]">
          {status}
        </span>
        <span className="text-sm text-[#434933]">{estimate}</span>
      </div>
    </div>
  );
}
