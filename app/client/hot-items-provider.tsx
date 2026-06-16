"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useClientIdentity } from "./use-client-identity";
import { stompSubscribe } from "../lib/websocket/stomp-client";
import { HOT_ITEMS_DESTINATION } from "../lib/websocket/events";

export function HotItemsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { clientId } = useClientIdentity();

  useEffect(() => {
    if (!clientId) return;

    const unsubscribe = stompSubscribe(HOT_ITEMS_DESTINATION, (body) => {
      try {
        const payload = body as { productId?: number };

        if (payload?.productId) {
          const productId = payload.productId;
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
              router.push(`/client/products/${productId}`);
            }
          });
        }
      } catch (err) {
        console.error("Failed to handle hot item event", err);
      }
    });

    return unsubscribe;
  }, [router, clientId]);

  return <>{children}</>;
}
