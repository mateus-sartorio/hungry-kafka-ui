export type OrderProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  photo: string;
};

export type OrderLineResponse = {
  product: OrderProduct;
  amount: number;
};

export type OrderResponse = {
  id: number;
  clientId: number;
  items: OrderLineResponse[];
  createdAt: string;
  status: string;
  expectedDelivery?: string | null;
};
