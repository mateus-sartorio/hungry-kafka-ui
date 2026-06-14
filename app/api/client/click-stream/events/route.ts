import { NextRequest, NextResponse } from "next/server";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "hungry-kafka-ui-click-events",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, clientId } = body;

    if (!productId || !clientId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await producer.connect();
    
    await producer.send({
      topic: "item-view-events",
      messages: [
        {
          key: String(clientId),
          value: JSON.stringify({ productId, clientId }),
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to publish click-stream event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
