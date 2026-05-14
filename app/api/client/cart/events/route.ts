import { NextRequest, NextResponse } from "next/server";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "queue-sine-ui-cart-events",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, currentAmount, productId, clientId } = body;

    if (!action || currentAmount === undefined || !productId || !clientId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await producer.connect();
    
    await producer.send({
      topic: "cart-events",
      messages: [
        {
          key: String(clientId),
          value: JSON.stringify({ action, currentAmount, productId, clientId }),
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to publish cart event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
