"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useClientIdentity } from "./use-client-identity";

export function HotItemsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { clientId } = useClientIdentity();

  useEffect(() => {
    if (!clientId) return;

    const eventSource = new EventSource(`/api/client/hot-items/events?clientId=${clientId}`);

    eventSource.onopen = () => {
      console.log("[HotItemsProvider] EventSource connected");
    };

    eventSource.onerror = (err) => {
      console.error("[HotItemsProvider] EventSource error", err);
    };

    eventSource.onmessage = (event) => {
      console.log("[HotItemsProvider] Received SSE message:", event.data);
      try {
        let payload = JSON.parse(event.data);
        
        // The backend KafkaTemplate uses JsonSerializer, but the payload passed was a raw String.
        // This causes the string to be JSON-serialized *again*, making it a string inside a string.
        // We double-parse it here to get the actual object.
        if (typeof payload === "string") {
          payload = JSON.parse(payload);
        }

        if (payload.productId) {
          console.log("[HotItemsProvider] Firing toast for product", payload.productId);
          toast.success(`🔥 A product is HOT right now! Click here to check it out!`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
              padding: "16px 20px",
              borderRadius: "16px",
              backgroundColor: "#f7faf8",
              color: "#4c6700",
              fontWeight: "bold",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            },
            onClick: () => {
              router.push(`/client/products/${payload.productId}`);
            }
          });
        }
      } catch (err) {
        console.error("Failed to parse hot item event", err);
      }
    };

    return () => {
      console.log("[HotItemsProvider] Closing EventSource");
      eventSource.close();
    };
  }, [router, clientId]);

  return <>{children}</>;
}
