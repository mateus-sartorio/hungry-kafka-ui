type OrderTotalSummaryProps = {
  label?: string;
  amount: string;
};

export function OrderTotalSummary({
  label = "Total Amount",
  amount,
}: OrderTotalSummaryProps) {
  return (
    <div className="flex items-end justify-between border-t border-[#c3caac]/20 pt-6">
      <div className="text-[10px] font-bold uppercase tracking-widest text-[#434933]">{label}</div>
      <div className="text-3xl font-black italic text-[#4c6700]">{amount}</div>
    </div>
  );
}
