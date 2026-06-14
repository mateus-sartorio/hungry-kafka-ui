import { NextRequest } from "next/server";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "hungry-kafka-ui-store-events",
  brokers: ["localhost:9092"],
});

export async function GET(request: NextRequest) {
  const topic = "order-status-changed";
  const consumer = kafka.consumer({ groupId: `hungry-kafka-ui-store-group-${Date.now()}` });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: false });

        await consumer.run({
          eachMessage: async ({ message }) => {
            if (!message.value) return;
            const data = message.value.toString();
            controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
          },
        });

        request.signal.addEventListener("abort", () => {
          consumer.disconnect().catch(console.error);
        });
      } catch (error) {
        console.error("Kafka consumer error:", error);
        controller.error(error);
      }
    },
    cancel() {
      consumer.disconnect().catch(console.error);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
