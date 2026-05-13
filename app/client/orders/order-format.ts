export function formatElapsed(createdAt: string) {
  const createdAtMs = new Date(createdAt).getTime();

  if (Number.isNaN(createdAtMs)) {
    return "—";
  }

  const elapsedMinutes = Math.max(0, (Date.now() - createdAtMs) / 60_000);

  if (elapsedMinutes < 60) {
    return `${elapsedMinutes.toFixed(1)} min`;
  }

  const elapsedHours = elapsedMinutes / 60;

  if (elapsedHours < 24) {
    return `${elapsedHours.toFixed(1)} h`;
  }

  return `${Math.floor(elapsedHours / 24)} d`;
}

export function formatOrderCode(orderId: number) {
  return `TXN-${String(orderId).padStart(5, "0")}`;
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
