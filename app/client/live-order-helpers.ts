import type { OrderResponse } from "./orders/order-types";

function normalizeStatus(status: string) {
  return status.trim().toUpperCase().replace(/\s+/g, "_");
}

const PROGRESS_RANK_BY_STATUS: Record<string, number> = {
  CANCELLED: -1,
  CREATED: 0,
  ACCEPTED: 1,
  PREPARING: 2,
  OUT_FOR_DELIVERY: 3,
  DELIVERED: 4,
};

export function clientOrderProgressRank(status: string): number {
  return PROGRESS_RANK_BY_STATUS[normalizeStatus(status)] ?? 0;
}

export function isClientLiveOrderCandidate(order: OrderResponse): boolean {
  if (order.status === "DELIVERED" || order.status === "CANCELLED") {
    return false;
  }

  return clientOrderProgressRank(order.status) >= 1;
}

export function selectLatestLiveClientOrder(orders: OrderResponse[]): OrderResponse | null {
  const candidates = orders.filter(isClientLiveOrderCandidate);

  if (candidates.length === 0) {
    return null;
  }

  return [...candidates].sort((a, b) => {
    const ta = new Date(a.createdAt).getTime();
    const tb = new Date(b.createdAt).getTime();
    if (Number.isFinite(tb) && Number.isFinite(ta) && tb !== ta) {
      return tb - ta;
    }
    return b.id - a.id;
  })[0];
}

export function formatLiveOrderEta(order: OrderResponse): string {
  if (!order.expectedDelivery) {
    return "—";
  }

  const etaMs = new Date(order.expectedDelivery).getTime();

  if (Number.isNaN(etaMs)) {
    return "—";
  }

  const remainingMin = Math.round((etaMs - Date.now()) / 60_000);

  if (remainingMin <= 0) {
    return "Soon";
  }

  if (remainingMin < 60) {
    return `${remainingMin} min`;
  }

  const h = Math.floor(remainingMin / 60);
  const m = remainingMin % 60;
  return `${h}h ${m}m`;
}

export type LiveOrderStageVm = {
  label: string;
  isActive?: boolean;
};

export function buildLiveOrderStages(order: OrderResponse): LiveOrderStageVm[] {
  const rank = clientOrderProgressRank(order.status);

  return [
    { label: "Confirmed", isActive: rank >= 1 },
    { label: "Preparing", isActive: rank >= 2 },
    { label: "Out for delivery", isActive: rank >= 3 },
  ];
}

export function liveOrderProgressPercent(order: OrderResponse): number {
  const rank = clientOrderProgressRank(order.status);

  if (rank <= 0) {
    return 0;
  }

  if (rank === 1) {
    return 33;
  }

  if (rank === 2) {
    return 66;
  }

  return 100;
}
