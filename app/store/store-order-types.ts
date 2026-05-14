export type ClientDto = {
  clientId: number;
  clientName: string;
};

export type StoreOrderProduct = {
  id: number;
  name: string;
  description?: string;
  price: number;
  photo?: string;
};

export type StoreOrderItemResponse = {
  product: StoreOrderProduct;
  amount: number;
};

export type StoreOrderResponse = {
  id: number;
  client: ClientDto;
  items: StoreOrderItemResponse[];
  createdAt: string;
  status: string;
};
