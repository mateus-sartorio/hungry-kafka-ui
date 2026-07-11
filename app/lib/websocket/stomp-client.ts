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
    const body = JSON.parse(message.body);
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
      for (const registration of registrations.values()) {
        registration.subscription = activateSubscription(registration);
      }
      flushPendingPublishes();
    },
    onWebSocketClose: () => {
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

export function stompSubscribe(
  destination: string,
  handler: MessageHandler,
): () => void {
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

export function stompPublish(destination: string, body: unknown): void {
  const activeClient = ensureClient();
  const message = { destination, body: JSON.stringify(body) };

  if (activeClient.connected) {
    activeClient.publish(message);
  } else {
    pendingPublishes.push(message);
  }
}
