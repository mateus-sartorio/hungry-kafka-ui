export type StoreOrderLifecyclePhase =
  | "CREATED"
  | "ACCEPTED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "UNKNOWN";

/** Normalizes API / persisted labels to a lifecycle phase (underscores and spacing tolerated). */
export function normalizeStoreOrderStatus(raw: string): StoreOrderLifecyclePhase {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "UNKNOWN";
  }

  const u = trimmed.toUpperCase().replace(/\s+/g, "_");

  if (u === "CREATED") {
    return "CREATED";
  }

  if (u === "ACCEPTED") {
    return "ACCEPTED";
  }

  if (u === "PREPARING" || u === "IN_PREPARATION") {
    return "PREPARING";
  }

  if (u === "OUT_FOR_DELIVERY") {
    return "OUT_FOR_DELIVERY";
  }

  if (u === "DELIVERED" || u === "COMPLETED") {
    return "DELIVERED";
  }

  if (u === "CANCELLED" || u === "CANCELED") {
    return "CANCELLED";
  }

  const loose = trimmed.toUpperCase();
  if (loose.includes("OUT") && loose.includes("DELIV")) {
    return "OUT_FOR_DELIVERY";
  }

  if (loose.includes("DISPATCH")) {
    return "OUT_FOR_DELIVERY";
  }

  if (loose.includes("PREPAR")) {
    return "PREPARING";
  }

  return "UNKNOWN";
}

/** Badge copy aligned with the documented chain (store handles through OUT FOR DELIVERY). */
export function formatStoreStatusBadge(phase: StoreOrderLifecyclePhase, raw: string): string {
  switch (phase) {
    case "CREATED":
      return "CREATED";
    case "ACCEPTED":
      return "ACCEPTED";
    case "PREPARING":
      return "PREPARING";
    case "OUT_FOR_DELIVERY":
      return "OUT FOR DELIVERY";
    case "DELIVERED":
      return "DELIVERED";
    case "CANCELLED":
      return "CANCELLED";
    default:
      return raw.trim() || "—";
  }
}

export type StoreKafkaOrderStatus = "ACCEPTED" | "PREPARING" | "OUT_FOR_DELIVERY" | "CANCELLED";
