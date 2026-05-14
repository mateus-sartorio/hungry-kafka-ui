import Link from "next/link";

type LiveOrderStage = {
  label: string;
  isActive?: boolean;
};

type LiveOrderProps = {
  orderCode: string;
  eta: string;
  progressPercent: number;
  stages: LiveOrderStage[];
  /** When set, the card navigates here and shows hover affordance. */
  href?: string;
  /** Runs before navigation (e.g. persist order snapshot for the detail page). */
  onBeforeNavigate?: () => void;
};

export function LiveOrder({
  orderCode,
  eta,
  progressPercent,
  stages,
  href,
  onBeforeNavigate,
}: LiveOrderProps) {
  const progressWidth = `${Math.max(0, Math.min(100, progressPercent))}%`;

  const cardInner = (
    <div className="rounded-xl bg-[#f1f4f2] p-4 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">Order {orderCode}</p>
        <div className="text-right">
          <p className="text-2xl font-black text-[#4c6700]">{eta}</p>
          <p className="text-[10px] font-bold uppercase text-[#705a4f]">Est. Delivery</p>
        </div>
      </div>

      <div className="mb-2 mt-4 h-1 w-full rounded-full bg-[#c3caac]/30">
        <div
          style={{ width: progressWidth }}
          className="h-full rounded-full bg-gradient-to-r from-[#4c6700] to-[#c1ff00] shadow-[0_0_12px_rgba(193,255,0,0.5)]"
        />
      </div>
      <div className="flex justify-between text-[10px] font-extrabold uppercase">
        {stages.map((stage) => (
          <span
            key={stage.label}
            className={stage.isActive ? "text-[#4c6700]" : "text-[#705a4f] opacity-40"}
          >
            {stage.label}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold tracking-tight">Live Orders</h2>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#705a4f]">
        Real-time status
      </p>

      {href ? (
        <Link
          href={href}
          onClick={() => onBeforeNavigate?.()}
          className="mt-6 block cursor-pointer rounded-xl outline-none ring-[#4c6700] ring-offset-2 ring-offset-[#f7faf8] transition hover:opacity-95 focus-visible:ring-2"
        >
          {cardInner}
        </Link>
      ) : (
        <div className="mt-6">{cardInner}</div>
      )}
    </section>
  );
}
