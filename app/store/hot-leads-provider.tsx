"use client";

import { useEffect, useState, ReactNode } from "react";
import Image from "next/image";
import { stompSubscribe } from "../lib/websocket/stomp-client";
import {
  LEAD_ITEMS_DESTINATION,
  HOT_ITEMS_DESTINATION,
  ABANDONED_CARTS_DESTINATION,
} from "../lib/websocket/events";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:8080";

// Hot-item events are not tied to a specific client, but the only catalog
// endpoint is per-client (/products/{clientId}). The product list it returns is
// the store's shared menu, so we use a default client id purely to resolve the
// product's name and photo. If it can't be resolved the card degrades to the
// product id.
const DEFAULT_CATALOG_CLIENT_ID = 1;

type CartProduct = {
  productId: number;
  name?: string;
  photo?: string;
};

type ClientEvent =
  | {
      id: string;
      type: "hot-item";
      product: CartProduct;
      timestamp: number;
    }
  | {
      id: string;
      type: "hot-lead";
      clientId: number;
      clientName?: string;
      product: CartProduct;
      timestamp: number;
    }
  | {
      id: string;
      type: "abandoned-cart";
      clientId: number;
      clientName?: string;
      products: CartProduct[];
      timestamp: number;
    };

async function fetchClientName(clientId: number): Promise<string | undefined> {
  // The /api/clients/{id} payload serializes the client's preferences with a
  // back-reference to the client, so the body is enormous (and effectively
  // recursive). We can't JSON.parse it, but the client's own "name" is the
  // first field, so we stream just the start of the response, grab the name,
  // and abort the rest of the download.
  const controller = new AbortController();
  try {
    const response = await fetch(`${API_BASE}/api/clients/${clientId}`, {
      signal: controller.signal,
    });
    if (!response.ok || !response.body) {
      return undefined;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const namePattern = /"name"\s*:\s*"((?:\\.|[^"\\])*)"/;
    let text = "";

    while (text.length < 8192) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      text += decoder.decode(value, { stream: true });
      const match = text.match(namePattern);
      if (match) {
        controller.abort();
        return match[1];
      }
    }

    return text.match(namePattern)?.[1];
  } catch {
    return undefined;
  } finally {
    controller.abort();
  }
}

async function fetchCartProducts(
  clientId: number,
  productIds: number[],
): Promise<CartProduct[]> {
  try {
    // There is no fetch-by-id endpoint, so we pull the client's catalog and
    // filter it down to the products that were left in the cart.
    const response = await fetch(`${API_BASE}/products/${clientId}`);
    if (!response.ok) {
      return productIds.map((productId) => ({ productId }));
    }
    const catalog = (await response.json()) as {
      id: number;
      name: string;
      photo: string;
    }[];
    const byId = new Map(catalog.map((product) => [product.id, product]));
    return productIds.map((productId) => {
      const match = byId.get(productId);
      return { productId, name: match?.name, photo: match?.photo };
    });
  } catch {
    return productIds.map((productId) => ({ productId }));
  }
}

function ProductRow({ product }: { product: CartProduct }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded border border-gray-200 p-1.5">
      <div className="relative w-10 h-10 shrink-0 rounded overflow-hidden bg-gray-200">
        {product.photo && (
          <Image
            src={product.photo}
            alt={product.name ?? `Product ${product.productId}`}
            fill
            unoptimized
            sizes="40px"
            className="object-cover"
          />
        )}
      </div>
      <span className="text-xs font-medium text-gray-700 truncate">
        {product.name ?? `Product #${product.productId}`}
      </span>
    </div>
  );
}

export function HotLeadsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<ClientEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unsubscribeHotItems = stompSubscribe(LEAD_ITEMS_DESTINATION, (body) => {
      try {
        const payload = body as { productId?: number; clientId?: number };
        if (payload?.productId && payload?.clientId) {
          const { clientId, productId } = payload;
          const id = crypto.randomUUID();
          const newEvent: ClientEvent = {
            id,
            type: "hot-lead",
            clientId,
            product: { productId },
            timestamp: Date.now(),
          };
          setEvents(prev => [newEvent, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast.info(`New Hot Lead! Customer ${clientId} is interested in Product ${productId}`, {
            position: "bottom-right",
            autoClose: 5000,
          });

          // Enrich the card with the client's name and product details.
          void Promise.all([
            fetchClientName(clientId),
            fetchCartProducts(clientId, [productId]),
          ]).then(([clientName, products]) => {
            setEvents(prev =>
              prev.map(event =>
                event.id === id && event.type === "hot-lead"
                  ? { ...event, clientName, product: products[0] ?? event.product }
                  : event,
              ),
            );
          });
        }
      } catch (err) {
        console.error("Failed to parse hot lead event", err);
      }
    });

    const unsubscribeAbandonedCarts = stompSubscribe(
      ABANDONED_CARTS_DESTINATION,
      (body) => {
        try {
          const payload = body as {
            clientId?: number;
            productIds?: number[];
          };
          if (payload?.clientId && Array.isArray(payload.productIds)) {
            const { clientId, productIds } = payload;
            const id = crypto.randomUUID();
            const newEvent: ClientEvent = {
              id,
              type: "abandoned-cart",
              clientId,
              products: productIds.map((productId) => ({ productId })),
              timestamp: Date.now(),
            };
            setEvents(prev => [newEvent, ...prev]);
            setUnreadCount(prev => prev + 1);
            toast.warn(`Abandoned Cart! Customer ${clientId} left ${productIds.length} item(s) behind`, {
              position: "bottom-right",
              autoClose: 5000,
            });

            // Enrich the card with the client's name and product details.
            void Promise.all([
              fetchClientName(clientId),
              fetchCartProducts(clientId, productIds),
            ]).then(([clientName, products]) => {
              setEvents(prev =>
                prev.map(event =>
                  event.id === id && event.type === "abandoned-cart"
                    ? { ...event, clientName, products }
                    : event,
                ),
              );
            });
          }
        } catch (err) {
          console.error("Failed to parse abandoned cart event", err);
        }
      }
    );

    const unsubscribeHotItemsTrending = stompSubscribe(
      HOT_ITEMS_DESTINATION,
      (body) => {
        try {
          const payload = body as { productId?: number };
          if (payload?.productId) {
            const { productId } = payload;
            const id = crypto.randomUUID();
            const newEvent: ClientEvent = {
              id,
              type: "hot-item",
              product: { productId },
              timestamp: Date.now(),
            };
            setEvents(prev => [newEvent, ...prev]);
            setUnreadCount(prev => prev + 1);
            toast.info(`Hot Item! Product ${productId} is trending right now`, {
              position: "bottom-right",
              autoClose: 5000,
            });

            // Enrich the card with the product's name and photo. Hot items have
            // no client, so we resolve against the default shared catalog.
            void fetchCartProducts(DEFAULT_CATALOG_CLIENT_ID, [productId]).then(
              (products) => {
                setEvents(prev =>
                  prev.map(event =>
                    event.id === id && event.type === "hot-item"
                      ? { ...event, product: products[0] ?? event.product }
                      : event,
                  ),
                );
              },
            );
          }
        } catch (err) {
          console.error("Failed to parse hot item event", err);
        }
      }
    );

    return () => {
      unsubscribeHotItems();
      unsubscribeAbandonedCarts();
      unsubscribeHotItemsTrending();
    };
  }, []);

  const openPanel = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  return (
    <div className="relative w-full h-full">
      {/* App Content */}
      <div className="w-full h-full">
        {children}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 bg-orange-500 text-white font-bold shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Client Activity</span>
            <span className="bg-orange-700 px-2 py-0.5 rounded text-xs">{events.length}</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="p-4 flex-1 min-h-0 overflow-y-auto bg-gray-50 flex flex-col gap-3">
          {events.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <span className="text-4xl mb-2 block">📡</span>
              <p className="text-sm">Monitoring activity...</p>
            </div>
          ) : (
            events.map((event) => {
              if (event.type === "hot-item") {
                return (
                  <div key={event.id} className="shrink-0 bg-white p-3 rounded-lg border border-red-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-400 group-hover:bg-red-600 transition-colors"></div>
                    <div className="pl-2">
                      <p className="font-bold text-red-700 text-sm mb-1 flex items-center">
                        <span className="mr-1">🔥</span> Hot Item
                      </p>
                      <div className="text-sm">
                        <span className="text-gray-600">Trending now:</span>
                        <div className="mt-1.5">
                          <ProductRow product={event.product} />
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2 text-right">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              }

              if (event.type === "hot-lead") {
                return (
                  <div key={event.id} className="shrink-0 bg-white p-3 rounded-lg border border-orange-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-400 group-hover:bg-orange-600 transition-colors"></div>
                    <div className="pl-2">
                      <p className="font-bold text-orange-700 text-sm mb-1 flex items-center">
                        <span className="mr-1">🔥</span> High Intent!
                      </p>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-semibold text-gray-800">
                          {event.clientName ?? `#${event.clientId}`}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Interested in:</span>
                        <div className="mt-1.5">
                          <ProductRow product={event.product} />
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2 text-right">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={event.id} className="shrink-0 bg-white p-3 rounded-lg border border-amber-200 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-400 group-hover:bg-amber-600 transition-colors"></div>
                  <div className="pl-2">
                    <p className="font-bold text-amber-700 text-sm mb-1 flex items-center">
                      <span className="mr-1">🛒</span> Abandoned Cart
                    </p>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-semibold text-gray-800">
                        {event.clientName ?? `#${event.clientId}`}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Cart items ({event.products.length}):</span>
                      {event.products.length === 0 ? (
                        <p className="text-gray-400 italic mt-1">Empty</p>
                      ) : (
                        <div className="flex flex-col gap-1.5 mt-1.5">
                          {event.products.map((product) => (
                            <ProductRow key={product.productId} product={product} />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-right">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={openPanel}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl z-30 transition-transform hover:scale-105 active:scale-95"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
