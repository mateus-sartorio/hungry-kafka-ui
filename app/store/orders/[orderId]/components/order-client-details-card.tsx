type OrderClientDetailsCardProps = {
  clientName: string;
};

export function OrderClientDetailsCard({ clientName }: OrderClientDetailsCardProps) {
  return (
    <section className="rounded border border-[#c3caac]/20 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#434933]">
        Client Details
      </h2>
      <p className="text-xl font-bold">{clientName}</p>
    </section>
  );
}
