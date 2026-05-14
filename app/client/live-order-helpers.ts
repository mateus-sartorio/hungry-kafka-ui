import type { OrderResponse } from "./orders/order-types";

function normalizeStatus(status: string) {
  return status.trim().toUpperCase().replace(/\s+/g, "_");
}

function isCancelledStatus(status: string) {
  return normalizeStatus(status).includes("CANCEL");
}

function isDeliveredStatus(status: string) {
  const u = normalizeStatus(status);
  return u.includes("DELIVERED") || u.includes("COMPLETED");
}

/** 0 = CREATED, 1 = confirmed+, 2 = preparing+, 3 = out for delivery */
export function clientOrderProgressRank(status: string): number {
  if (isCancelledStatus(status)) {
    return -1;
  }

  const u = normalizeStatus(status);

  if (u === "CREATED") {
    return 0;
  }

  if (u === "ACCEPTED" || u === "CONFIRMED") {
    return 1;
  }

  if (u === "PREPARING" || u === "IN_PREPARATION") {
    return 2;
  }

  if (u === "OUT_FOR_DELIVERY") {
    return 3;
  }

  if (u.includes("PREPAR")) {
    return 2;
  }

  if (u.includes("OUT") && u.includes("DELIV")) {
    return 3;
  }

  if (u.includes("DISPATCH")) {
    return 3;
  }

  if (isDeliveredStatus(status)) {
    return 4;
  }

  return 0;
}

/** In-flight orders from confirmed onward, excluding delivered / cancelled. */
export function isClientLiveOrderCandidate(order: OrderResponse): boolean {
  if (isCancelledStatus(order.status)) {
    return false;
  }

  if (isDeliveredStatus(order.status)) {
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

function parseIsoDurationToMinutes(iso: string): number | null {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/i.exec(iso.trim());

  if (!match) {
    return null;
  }

  const hours = Number.parseInt(match[1] || "0", 10);
  const minutes = Number.parseInt(match[2] || "0", 10);
  const seconds = Number.parseInt(match[3] || "0", 10);
  return hours * 60 + minutes + Math.round(seconds / 60);
}

export function formatLiveOrderEta(order: OrderResponse): string {
  if (!order.expectedDelivery) {
    return "—";
  }

  const totalMinutes = parseIsoDurationToMinutes(order.expectedDelivery);

  if (totalMinutes === null || totalMinutes <= 0) {
    return "—";
  }

  const createdMs = new Date(order.createdAt).getTime();

  if (Number.isNaN(createdMs)) {
    return "—";
  }

  const etaMs = createdMs + totalMinutes * 60_000;
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
