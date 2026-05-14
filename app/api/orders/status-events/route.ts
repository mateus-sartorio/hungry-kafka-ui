import { randomUUID } from "crypto";
import { kafkaOrderUi } from "../kafka-client";

const ORDER_STATUS_TOPIC = "order-status-events";

const ORDER_STATUS_VALUES = ["ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"] as const;

type OrderStatusValue = (typeof ORDER_STATUS_VALUES)[number];

type PostOrderStatusEventBody = {
  orderId: number;
  status: OrderStatusValue;
  userId?: string | null;
  storeId?: string | null;
  category?: string | null;
  expectedDelivery?: string | null;
};

function isOrderStatusValue(value: unknown): value is OrderStatusValue {
  return typeof value === "string" && (ORDER_STATUS_VALUES as readonly string[]).includes(value);
}

async function sendOrderStatusEvent(payload: {
  eventId: string;
  orderId: string;
  userId: string;
  storeId: string;
  category: string;
  status: OrderStatusValue;
  occurredAt: string;
  expectedDelivery?: string | null;
}) {
  const producer = kafkaOrderUi.producer();

  await producer.connect();

  try {
    await producer.send({
      topic: ORDER_STATUS_TOPIC,
      messages: [
        {
          key: payload.orderId,
          value: JSON.stringify(payload),
        },
      ],
    });
  } finally {
    await producer.disconnect();
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as PostOrderStatusEventBody;

  if (
    typeof body.orderId !== "number" ||
    !Number.isInteger(body.orderId) ||
    body.orderId <= 0
  ) {
    return Response.json({ message: "orderId must be a positive integer" }, { status: 400 });
  }

  if (!isOrderStatusValue(body.status)) {
    return Response.json(
      { message: `status must be one of: ${ORDER_STATUS_VALUES.join(", ")}` },
      { status: 400 },
    );
  }

  const event = {
    eventId: randomUUID(),
    orderId: String(body.orderId),
    userId: typeof body.userId === "string" ? body.userId : "",
    storeId: typeof body.storeId === "string" ? body.storeId : "",
    category: typeof body.category === "string" && body.category.trim() ? body.category : "ORDER_STATUS",
    status: body.status,
    occurredAt: new Date().toISOString(),
    ...(body.status === "OUT_FOR_DELIVERY" && body.expectedDelivery
      ? { expectedDelivery: body.expectedDelivery }
      : {}),
  };

  try {
    await sendOrderStatusEvent(event);
  } catch {
    return Response.json({ message: "Failed to publish order status event" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
