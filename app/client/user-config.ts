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

export function readStoredClientId(): number | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedClientId = localStorage.getItem(CLIENT_ID_STORAGE_KEY)?.trim();

  if (!storedClientId) {
    return null;
  }

  const parsedClientId = Number(storedClientId);

  return Number.isInteger(parsedClientId) && parsedClientId > 0 ? parsedClientId : null;
}

export function writeStoredClientId(clientId: number) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(CLIENT_ID_STORAGE_KEY, String(clientId));
  window.dispatchEvent(new Event(CLIENT_STORAGE_CHANGE_EVENT));
}

export async function createStoredClientId(clientName: string): Promise<number> {
  if (typeof window === "undefined") {
    return 0;
  }

  const existingClientId = readStoredClientId();

  if (existingClientId) {
    return existingClientId;
  }

  const response = await fetch("/api/clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: clientName.trim() }),
  });

  if (!response.ok) {
    throw new Error("Failed to create client");
  }

  const createdClient = (await response.json()) as { id: number };
  const nextClientId = createdClient.id;

  writeStoredClientId(nextClientId);

  return nextClientId;
}

export async function updateStoredClientName(
  clientId: number,
  clientName: string,
): Promise<void> {
  const response = await fetch(`/api/clients/${clientId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: clientName.trim() }),
  });

  if (!response.ok) {
    throw new Error("Failed to update client");
  }
}

export type ClientIdentity = {
  username: string;
  clientId: number | null;
};

export function readStoredClientIdentity(): ClientIdentity {
  return {
    username: readStoredUsername(),
    clientId: readStoredClientId(),
  };
}

export const clientStorageChangeEventName = CLIENT_STORAGE_CHANGE_EVENT;
