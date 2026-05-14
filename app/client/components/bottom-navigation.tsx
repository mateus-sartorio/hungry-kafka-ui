import Link from "next/link";
import { FaReceipt, FaUser, FaUtensils } from "react-icons/fa";

type BottomNavigationTab = "catalog" | "orders" | "account";

type BottomNavigationProps = {
  activeTab: BottomNavigationTab;
};

function tabClass(activeTab: BottomNavigationTab, tab: BottomNavigationTab) {
  return `flex flex-col items-center justify-center gap-1 ${activeTab === tab ? "text-zinc-900" : "text-zinc-500"}`;
}

export function BottomNavigation({ activeTab }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 z-50 flex h-20 w-full items-center justify-around border-t border-zinc-200 bg-white/95 px-4 shadow-[0_-8px_32px_rgba(24,28,27,0.04)] backdrop-blur-xl transition-all md:hidden">
      <Link href="/client" className={tabClass(activeTab, "catalog")}>
        <FaUtensils className="h-4 w-4" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.05em]">Catalog</span>
      </Link>
      <Link href="/client/orders" className={tabClass(activeTab, "orders")}>
        <FaReceipt className="h-4 w-4" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.05em]">Orders</span>
      </Link>
      <Link href="/client/settings" className={tabClass(activeTab, "account")}>
        <FaUser className="h-4 w-4" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.05em]">Account</span>
      </Link>
    </nav>
  );
}