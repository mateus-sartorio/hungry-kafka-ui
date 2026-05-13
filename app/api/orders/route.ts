import { Kafka } from "kafkajs";

type OrderItemInput = {
  productId: number;
  quantity: number;
};

type CreateOrderRequest = {
  clientId: number;
  items: OrderItemInput[];
};

const kafkaBrokers = (process.env.KAFKA_BROKERS ?? "localhost:9092,localhost:9094,localhost:9096")
  .split(",")
  .map((broker) => broker.trim())
  .filter(Boolean);

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID ?? "queue-sine-ui",
  brokers: kafkaBrokers,
});

const producer = kafka.producer();

async function sendOrderEvent(payload: CreateOrderRequest) {
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