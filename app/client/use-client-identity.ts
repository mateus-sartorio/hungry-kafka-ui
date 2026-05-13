"use client";

import { useSyncExternalStore } from "react";
import {
  clientStorageChangeEventName,
  CLIENT_ID_STORAGE_KEY,
  USERNAME_STORAGE_KEY,
  readStoredClientIdentity,
} from "./user-config";

function getSnapshot() {
  return JSON.stringify(readStoredClientIdentity());
}

function getServerSnapshot() {
  return JSON.stringify({ username: "", clientId: "" });
}

function subscribe(onStoreChange: () => void) {
  function handleStorageEvent(event: StorageEvent) {
    if (
      event.key !== CLIENT_ID_STORAGE_KEY &&
      event.key !== USERNAME_STORAGE_KEY &&
      event.key !== null
    ) {
      return;
    }

    onStoreChange();
  }

  function handleClientStorageChange() {
    onStoreChange();
  }

  window.addEventListener("storage", handleStorageEvent);
  window.addEventListener(clientStorageChangeEventName, handleClientStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageEvent);
    window.removeEventListener(clientStorageChangeEventName, handleClientStorageChange);
  };
}

export function useClientIdentity() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return JSON.parse(snapshot) as {
    username: string;
    clientId: number | null;
  };
}