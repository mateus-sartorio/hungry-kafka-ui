import Link from "next/link";

type OrderItemProps = {
  code: string;
  time: string;
  status: string;
  isLast: boolean;
};

function statusClasses(status: string) {
  if (status === "In Preparation") {
    return "bg-[#c1ff00] text-[#567300]";
  }
  if (status === "Dispatching") {
    return "bg-[#fbdcce] text-[#574238]";
  }
  return "bg-[#e0e3e1] text-[#737a61]";
}

export function OrderItem({ code, time, status, isLast }: OrderItemProps) {
  return (
    <Link
      href={`/client/orders/${code.toLowerCase()}`}
      className={`flex items-center justify-between p-4 transition-colors duration-200 hover:bg-[#f1f4f2] ${
        !isLast ? "border-b border-[#c3caac]/20" : ""
      }`}
    >
      <div className="flex items-center gap-6">
        <span className="text-sm font-bold uppercase tracking-widest">{code}</span>
        <div className="flex items-center gap-1 text-[#516070]">
          <span className="text-sm">⏱</span>
          <span className="text-sm font-medium">{time}</span>
        </div>
      </div>
      <span
        className={`px-3 py-1 text-[10px] font-black italic uppercase tracking-tight ${statusClasses(status)}`}
      >
        {status}
      </span>
    </Link>
  );
}