import Image from "next/image";

type StoreHeaderProps = {
  className?: string;
};

export function StoreHeader({ className }: StoreHeaderProps) {
  return (
    <header
      className={`fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-[#f7faf8] px-6 shadow-[0_4px_32px_rgba(24,28,27,0.04)] ${className ?? ""}`}
    >
      <div className="flex items-center gap-3">
        <Image src="/logo.jpeg" alt="Logo" width={32} height={32} className="rounded-md object-cover" />
        <h1 className="text-2xl font-black italic tracking-tight text-[#4c6700]">Kafka food</h1>
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-[#705a4f]">ORDERS</span>
    </header>
  );
}
