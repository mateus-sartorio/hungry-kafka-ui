"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useClientIdentity } from "./use-client-identity";
import { stompSubscribe } from "../lib/websocket/stomp-client";
import {
  LEAD_ITEMS_DESTINATION,
  HOT_ITEMS_DESTINATION,
} from "../lib/websocket/events";

const TOAST_STYLE = {
  padding: "16px 20px",
  borderRadius: "16px",
  backgroundColor: "#f7faf8",
  color: "#4c6700",
  fontWeight: "bold",
  boxShadow:
    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
};

export function HotItemsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { clientId } = useClientIdentity();

  useEffect(() => {
    // Lead items are targeted at a specific client, so they only show once we
    // know who this client is.
    const unsubscribeLeads = clientId
      ? stompSubscribe(LEAD_ITEMS_DESTINATION, (body) => {
          try {
            const payload = body as { productId?: number; clientId?: number };

            if (payload?.productId) {
              if (payload.clientId && payload.clientId !== clientId) {
                return;
              }

              const productId = payload.productId;
              toast.success(
                `🔥 You got a discount coupon for this product! Click here to redeem it!`,
                {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  style: TOAST_STYLE,
                  onClick: () => {
                    router.push(`/client/products/${productId}`);
                  },
                },
              );
            }
          } catch (err) {
            console.error("Failed to handle lead item event", err);
          }
        })
      : undefined;

    // Hot items are globally trending products, not tied to a single client, so
    // they show to everyone.
    const unsubscribeHotItems = stompSubscribe(HOT_ITEMS_DESTINATION, (body) => {
      try {
        const payload = body as { productId?: number };

        if (payload?.productId) {
          const productId = payload.productId;
          toast.success(
            `🔥 This item is trending right now! Click here to check it out!`,
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              style: TOAST_STYLE,
              onClick: () => {
                router.push(`/client/products/${productId}`);
              },
            },
          );
        }
      } catch (err) {
        console.error("Failed to handle hot item event", err);
      }
    });

    return () => {
      unsubscribeLeads?.();
      unsubscribeHotItems();
    };
  }, [router, clientId]);

  return <>{children}</>;
}
