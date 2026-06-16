type OrderWarningCardProps = {
  title?: string;
  message?: string;
};

export function OrderWarningCard({
  title = "Order delayed?",
  message = "Our kitchen is busier than usual. We're working on it!",
}: OrderWarningCardProps) {
  return (
    <div className="mb-5 flex items-start gap-4 border-l-4 border-[#c1ff00] bg-[#181c1b] p-5 text-[#f7faf8]">
      <div className="bg-[#c1ff00] p-2 text-xl text-[#567300]">!</div>
      <div className="flex-1">
        <h4 className="mb-1 text-sm font-black italic uppercase tracking-tight text-[#c1ff00]">{title}</h4>
        <p className="text-sm leading-relaxed opacity-90">{message}</p>
      </div>
    </div>
  );
}
