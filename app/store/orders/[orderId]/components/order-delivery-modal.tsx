import { FaArrowRight, FaMinus, FaPlus, FaTruck } from "react-icons/fa";

type OrderDeliveryModalProps = {
  isOpen: boolean;
  deliveryMinutes: number;
  isSubmitting?: boolean;
  onDecreaseDeliveryMinutes: () => void;
  onIncreaseDeliveryMinutes: () => void;
  onConfirm: () => void;
  onClose: () => void;
};

export function OrderDeliveryModal({
  isOpen,
  deliveryMinutes,
  isSubmitting = false,
  onDecreaseDeliveryMinutes,
  onIncreaseDeliveryMinutes,
  onConfirm,
  onClose,
}: OrderDeliveryModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#181c1b]/40 p-6 backdrop-blur-sm">
      <div className="w-full max-w-md border border-[#c3caac]/20 bg-white shadow-[0_32px_64px_rgba(0,0,0,0.15)]">
        <div className="border-b border-[#c3caac]/10 p-8 text-center">
          <h2 className="mb-2 text-[20px] font-bold uppercase tracking-tight text-[#181c1b]">
            Set Expected Delivery Time
          </h2>
          <p className="text-[14px] font-medium leading-tight text-[#705a4f]">
            Confirm when the order will be ready for shipment or pickup.
          </p>
        </div>

        <div className="px-8 py-12">
          <div className="flex items-center justify-center gap-10">
            <button
              type="button"
              onClick={onDecreaseDeliveryMinutes}
              className="flex h-14 w-14 items-center justify-center border-2 border-[#c1ff00] text-[#4c6700] transition-all hover:bg-[#f1f4f2] active:scale-95"
              aria-label="Decrease expected delivery minutes"
            >
              <FaMinus className="h-4 w-4" />
            </button>

            <div className="text-center">
              <div className="text-[80px] font-black italic leading-none tracking-tighter text-[#181c1b]">
                {deliveryMinutes}
              </div>
              <div className="-mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#4c6700]">
                Minutes
              </div>
            </div>

            <button
              type="button"
              onClick={onIncreaseDeliveryMinutes}
              className="flex h-14 w-14 items-center justify-center border-2 border-[#c1ff00] text-[#4c6700] transition-all hover:bg-[#f1f4f2] active:scale-95"
              aria-label="Increase expected delivery minutes"
            >
              <FaPlus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-8 pt-0">
          <button
            type="button"
            disabled={isSubmitting}
            className="group flex h-16 w-full items-center justify-between bg-[#c1ff00] px-6 transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onConfirm}
          >
            <div className="flex items-center gap-4">
              <FaTruck className="h-4 w-4 text-[#567300]" />
              <span className="text-[12px] font-black uppercase tracking-wider text-[#567300]">
                {isSubmitting ? "Sending…" : "Confirm & Ship"}
              </span>
            </div>
            <FaArrowRight className="h-4 w-4 text-[#567300] transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            className="w-full py-4 text-center text-[10px] font-bold uppercase tracking-widest text-[#705a4f] transition-colors hover:text-[#181c1b]"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
