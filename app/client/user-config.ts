export const USERNAME_STORAGE_KEY = "queue-sine.username";

export function readStoredUsername(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(USERNAME_STORAGE_KEY)?.trim() ?? "";
}
