import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

type ClientHeaderProps = {
  username: string;
  backHref?: string;
  className?: string;
};

export function ClientHeader({ username, backHref, className }: ClientHeaderProps) {
  return (
    <header
      className={`fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-[#f7faf8] px-6 shadow-[0_4px_32px_rgba(24,28,27,0.04)] ${className ?? ""}`}
    >
      <div className="flex items-center gap-4">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="Go back"
            className="rounded-full p-1 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            <FaArrowLeft className="h-4 w-4" />
          </Link>
        ) : null}
        <h1 className="text-2xl font-black italic tracking-tight text-[#4c6700]">Queue-sine</h1>
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-[#705a4f]">{username}</span>
    </header>
  );
}
