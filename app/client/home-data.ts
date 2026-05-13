export type CatalogItem = {
  name: string;
  price: string;
  unitPrice: number;
  image: string;
};

export type CartItem = {
  name: string;
  unitPrice: number;
  qty: number;
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
        "name" in item &&
        "unitPrice" in item &&
        "qty" in item &&
        "image" in item &&
        typeof item.name === "string" &&
        typeof item.unitPrice === "number" &&
        typeof item.qty === "number" &&
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
  products: [
    {
      name: "The Onyx Burger",
      price: "$28.00",
      unitPrice: 28,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAy2M0EO8QSjAn83DZ5ulE703qjgmVPaQK_ecWe10MD2an628SlGh2vkOxDlPIvQB8-iyLZvKKozTCeBM_K66cFzBmaoFEstrbPuqGggawRCw9v16d9o4AXc0NIyggm68M0b4vZJpqWqyjjr05xOnIcMBujmt-Lp9HAP9Vp9mzhcHC97IMvIlSfBRWNS276eXjvkoDmyvPUTAX9QF1dfL8VB8GjyECXAwuM7EqKih4lxo6rNebSV0MdTFSDw-8JFhbUMtEvLavTbg",
    },
    {
      name: "Luminous Toast",
      price: "$16.00",
      unitPrice: 16,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAXyTUqfqK0aknpNt6xaqVsB814ZYXTbhVDIZaRsa33jvBYsXG7pYEG1OJcpfgWjkBHjSPgzy5xDHyrUoLtFU-76eYNT9BU21_2Mp7bxjvCXVyC937kK-ld3lJFfW_Ia8aj3T9p_tg6eW8wkju2ZTqUDBuFlXW2flJBrX-KaAf8-qKe-iqovFcHwZTuY5Owjzbj-fsC7SzaiBD6nTrBt7ZbJ2oOXpAFOY0fpqUEO6NccQlHuP-pAgoAO65ic4JL9jhA90YdCn6Tgg",
    },
    {
      name: "Truffle Reserve Mac",
      price: "$19.00",
      unitPrice: 19,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCm7NECFuPO9S3Owje-Ny1c2WtB0QkvNRQst5BEkLQkpQPbRWjl9u5d6KoGT5zev059Vc4-7i5T-U3CNHe_olj-VoQuH0an95wR3AaopW5CR8vKgeviI6F7JXeuhtsxSUX_XcUfhMzgPyMqTcYe9vWX75z7mtcpPhezIbreAxrfvs4JJB2UkUSTN2hexMMv-RYc37RJMDYIYMgcfoSLspS_CiELVfPIoAGENUH2MmIWSpCcFVWZ-5qKSfKSf-zMjr4t4ygx_UYJ6w",
    },
    {
      name: "Kinetic Scallops",
      price: "$24.50",
      unitPrice: 24.5,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBlUoFWHJfis-k37S7Ef7VjnOBfWwyDE7VTXS1aOD5E25Y3tZSPkDa6PitH3Lr8jSePOkU-7qfFCn4aoAEKKH7p39Z-tXVwCOkthcfS4oMZcTYQ74-zNoL5dLdhXlnDtFWzsI51SkJivVtm1S2zDS2yYXpVYvloRolT9BITTI_GS3ZVEWZjL5FJg0b8UOHENDrVxqYshrlDAgeGlUU5RSS_OXLEd7r5BMu20VumQoIaZNS0WFjtyWMRWPbOPeWv_AfzOyr-IMKynQ",
    },
    {
      name: "Neon Mochi Plate",
      price: "$12.00",
      unitPrice: 12,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD_VQ7ASbZnb_K6j23t5eIRkuxCByDIOprqP9rjmi5aa5djyILCL9CZUU2vvaSyJQq0YFKlBVoZeny9cFhZ8I4ZeQnxCWzi44opLK7upY2UnVUHkVgVsHity7gH6ZZGWdqhefpIiFt02pL3a0ngOt4z7UWu238YL80s2qid4NKoHu10YrTyHlmwoPxwL7skdCt7zgJGQG0iJ_mlfpVBKsNnV298V-2KvLp62ZPMxcn5cPdMjUDAJOYjkpVRifEq7GL8GqQkjx-m2g",
    },
  ],
  cartItems: [],
};