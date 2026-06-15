"use client";

import { Client, type StompSubscription } from "@stomp/stompjs";

const BROKER_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080/ws";

type MessageHandler = (body: unknown) => void;

type Registration = {
  id: number;
  destination: string;
  handler: MessageHandler;
  subscription?: StompSubscription;
};

let client: Client | null = null;
let nextRegistrationId = 1;

const registrations = new Map<number, Registration>();
const pendingPublishes: { destination: string; body: string }[] = [];

function activateSubscription(
  registration: Registration,
): StompSubscription | undefined {
  if (!client) {
    return undefined;
  }

  return client.subscribe(registration.destination, (message) => {
    let body: unknown = message.body;
    try {
      body = JSON.parse(message.body);
    } catch {
      // Leave the raw string as the payload when it is not valid JSON.
    }
    registration.handler(body);
  });
}

function flushPendingPublishes() {
  if (!client) {
    return;
  }

  while (pendingPublishes.length > 0) {
    const message = pendingPublishes.shift();
    if (message) {
      client.publish(message);
    }
  }
}

function ensureClient(): Client {
  if (client) {
    return client;
  }

  client = new Client({
    brokerURL: BROKER_URL,
    reconnectDelay: 5000,
    onConnect: () => {
      // (Re)subscribe every active registration. On a reconnect the previous
      // STOMP subscriptions are gone, so they are recreated here.
      for (const registration of registrations.values()) {
        registration.subscription = activateSubscription(registration);
      }
      flushPendingPublishes();
    },
    onWebSocketClose: () => {
      // The socket dropped: invalidate every subscription handle so the next
      // onConnect recreates them instead of reusing dead ones.
      for (const registration of registrations.values()) {
        registration.subscription = undefined;
      }
    },
    onStompError: (frame) => {
      console.error(
        "[stomp] broker error",
        frame.headers["message"],
        frame.body,
      );
    },
    onWebSocketError: (event) => {
      console.error("[stomp] websocket error", event);
    },
  });

  client.activate();
  return client;
}

/**
 * Subscribe to a STOMP destination. The handler receives the parsed JSON body
 * (or the raw string when the payload is not JSON). Returns an unsubscribe
 * function. Subscriptions survive reconnects automatically.
 */
export function stompSubscribe(
  destination: string,
  handler: MessageHandler,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const activeClient = ensureClient();
  const registration: Registration = {
    id: nextRegistrationId++,
    destination,
    handler,
  };
  registrations.set(registration.id, registration);

  if (activeClient.connected) {
    registration.subscription = activateSubscription(registration);
  }

  return () => {
    const current = registrations.get(registration.id);
    current?.subscription?.unsubscribe();
    registrations.delete(registration.id);
  };
}

/**
 * Publish a JSON-serializable body to a STOMP destination. If the connection is
 * not established yet, the message is queued and flushed once connected.
 */
export function stompPublish(destination: string, body: unknown): void {
  if (typeof window === "undefined") {
    return;
  }

  const activeClient = ensureClient();
  const message = { destination, body: JSON.stringify(body) };

  if (activeClient.connected) {
    activeClient.publish(message);
  } else {
    pendingPublishes.push(message);
  }
}
