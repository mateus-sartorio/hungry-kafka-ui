export type CatalogItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  photoUrl: string;
  category: {
    id: number;
    name: string;
  };
};

export type CartItem = {
  productId: number;
  name: string;
  unitPrice: number;
  quantity: number;
  image: string;
};

export type ClientHomeData = {
  products: CatalogItem[];
  cartItems: CartItem[];
};

export const CART_STORAGE_KEY = "queue-sine.client-cart";

let cachedStoredCartRaw = "";
let cachedStoredCartItems: CartItem[] = [];

export function readStoredCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawCartItems = localStorage.getItem(CART_STORAGE_KEY);

  if (rawCartItems === cachedStoredCartRaw) {
    return cachedStoredCartItems;
  }

  if (!rawCartItems) {
    cachedStoredCartRaw = "";
    cachedStoredCartItems = [];
    return [];
  }

  try {
    const parsedItems = JSON.parse(rawCartItems) as unknown;

    if (!Array.isArray(parsedItems)) {
      return [];
    }

    const nextItems = parsedItems.filter((item): item is CartItem => {
      return (
        typeof item === "object" &&
        item !== null &&
        "productId" in item &&
        "name" in item &&
        "unitPrice" in item &&
        "quantity" in item &&
        "image" in item &&
        typeof item.productId === "number" &&
        typeof item.name === "string" &&
        typeof item.unitPrice === "number" &&
        typeof item.quantity === "number" &&
        typeof item.image === "string"
      );
    });

    cachedStoredCartRaw = rawCartItems;
    cachedStoredCartItems = nextItems;

    return nextItems;
  } catch {
    cachedStoredCartRaw = "";
    cachedStoredCartItems = [];
    return [];
  }
}

export function writeStoredCartItems(cartItems: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  const rawCartItems = JSON.stringify(cartItems);

  localStorage.setItem(CART_STORAGE_KEY, rawCartItems);
  cachedStoredCartRaw = rawCartItems;
  cachedStoredCartItems = cartItems;
}

export const clientHomeData: ClientHomeData = {
  products: [],
  cartItems: [],
};