import { FaCheck, FaClock, FaTruck } from "react-icons/fa";

export type OrderStatusPrimaryAction = {
  label: string;
  icon: "check" | "clock" | "truck";
  onClick: () => void;
};

export type OrderStatusSecondaryAction = {
  label: string;
  onClick: () => void;
};

type OrderStatusCardProps = {
  statusBadge: string;
  estimatedDelivery: string | null;
  primaryAction: OrderStatusPrimaryAction | null;
  secondaryAction?: OrderStatusSecondaryAction | null;
  readOnlyMessage?: string | null;
  disabled?: boolean;
  actionError?: string;
};

function ActionIcon({ icon }: { icon: OrderStatusPrimaryAction["icon"] }) {
  if (icon === "check") {
    return <FaCheck className="h-4 w-4" aria-hidden />;
  }

  if (icon === "clock") {
    return <FaClock className="h-4 w-4" aria-hidden />;
  }

  return <FaTruck className="h-4 w-4" aria-hidden />;
}

export function OrderStatusCard({
  statusBadge,
  estimatedDelivery,
  primaryAction,
  secondaryAction,
  readOnlyMessage,
  disabled = false,
  actionError,
}: OrderStatusCardProps) {
  return (
    <section className="space-y-6 rounded border border-[#c3caac]/20 bg-white p-6 shadow-sm">
      <div>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-[#434933]">
          Current Status
        </h2>
        <span className="inline-block bg-[#4c6700] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
          {statusBadge}
        </span>
        {estimatedDelivery ? (
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#516070]">
            ETA: {estimatedDelivery} min
          </p>
        ) : null}
      </div>

      {primaryAction ? (
        <div className="space-y-3">
          <button
            type="button"
            disabled={disabled}
            className="flex w-full items-center justify-center gap-2 bg-[#4c6700] px-4 py-4 text-sm font-bold uppercase text-white transition-all hover:bg-[#3c5300] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={primaryAction.onClick}
          >
            <ActionIcon icon={primaryAction.icon} />
            {primaryAction.label}
          </button>
          {secondaryAction ? (
            <button
              type="button"
              disabled={disabled}
              className="w-full border border-[#4c6700] px-4 py-3 text-sm font-bold uppercase text-[#4c6700] transition-all hover:bg-[#4c6700]/5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </button>
          ) : null}
        </div>
      ) : readOnlyMessage ? (
        <p className="text-sm font-medium leading-relaxed text-[#516070]">{readOnlyMessage}</p>
      ) : null}

      {actionError ? <p className="text-sm text-red-500">{actionError}</p> : null}
    </section>
  );
}
