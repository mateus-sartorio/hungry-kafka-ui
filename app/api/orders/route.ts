import { kafkaOrderUi } from "./kafka-client";

type OrderItemInput = {
  productId: number;
  quantity: number;
};

type CreateOrderRequest = {
  clientId: number;
  items: OrderItemInput[];
};

async function sendOrderEvent(payload: CreateOrderRequest) {
  const producer = kafkaOrderUi.producer();

  await producer.connect();

  try {
    await producer.send({
      topic: "order",
      messages: [
        {
          key: String(payload.clientId),
          value: JSON.stringify({
            clientId: payload.clientId,
            items: payload.items,
          }),
        },
      ],
    });
  } finally {
    await producer.disconnect();
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateOrderRequest;

  if (!body.clientId || !Array.isArray(body.items) || body.items.length === 0) {
    return Response.json({ message: "Invalid order payload" }, { status: 400 });
  }

  await sendOrderEvent(body);

  return Response.json({ ok: true });
}