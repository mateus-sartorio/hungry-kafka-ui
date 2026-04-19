type StoreHeaderProps = {
  className?: string;
};

export function StoreHeader({ className }: StoreHeaderProps) {
  return (
    <header
      className={`fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-[#f7faf8] px-6 shadow-[0_4px_32px_rgba(24,28,27,0.04)] ${className ?? ""}`}
    >
      <h1 className="text-2xl font-black italic tracking-tight text-[#4c6700]">Queue-sine</h1>
      <span className="text-xs font-bold uppercase tracking-widest text-[#705a4f]">ORDERS</span>
    </header>
  );
}
