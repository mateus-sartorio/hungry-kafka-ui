export const USERNAME_STORAGE_KEY = "queue-sine.username";
export const CLIENT_ID_STORAGE_KEY = "queue-sine.client-id";

const CLIENT_STORAGE_CHANGE_EVENT = "queue-sine.client-storage-change";

export function readStoredUsername(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(USERNAME_STORAGE_KEY)?.trim() ?? "";
}

export function writeStoredUsername(username: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(USERNAME_STORAGE_KEY, username.trim());
  window.dispatchEvent(new Event(CLIENT_STORAGE_CHANGE_EVENT));
}

export function readStoredClientId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(CLIENT_ID_STORAGE_KEY)?.trim() ?? "";
}

function generateUuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);

  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));

  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

export function ensureStoredClientId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const existingClientId = readStoredClientId();

  if (existingClientId) {
    return existingClientId;
  }

  const nextClientId = generateUuidV4();

  localStorage.setItem(CLIENT_ID_STORAGE_KEY, nextClientId);
  window.dispatchEvent(new Event(CLIENT_STORAGE_CHANGE_EVENT));

  return nextClientId;
}

export type ClientIdentity = {
  username: string;
  clientId: string;
};

export function readStoredClientIdentity(): ClientIdentity {
  return {
    username: readStoredUsername(),
    clientId: readStoredClientId(),
  };
}

export const clientStorageChangeEventName = CLIENT_STORAGE_CHANGE_EVENT;
