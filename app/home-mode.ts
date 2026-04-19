export type HomeMode = "client" | "store";

export function getHomeMode(): HomeMode {
  const mode = process.env.NEXT_PUBLIC_HOME_PAGE_MODE;
  return mode === "store" ? "store" : "client";
}
