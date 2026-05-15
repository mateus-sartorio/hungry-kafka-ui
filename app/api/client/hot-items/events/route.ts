import { NextRequest } from "next/server";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "queue-sine-ui-hot-items",
  brokers: ["localhost:9092"],
});

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get("clientId");
  if (!clientId) {
    return new Response("Missing client ID", { status: 400 });
  }

  const topic = "hot-item-events";
  const consumer = kafka.consumer({ groupId: `queue-sine-ui-hot-items-${clientId}` });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        await consumer.connect();
        console.log("[Hot Items] Consumer connected");
        await consumer.subscribe({ topic, fromBeginning: false });
        console.log("[Hot Items] Consumer subscribed to", topic);

        await consumer.run({
          eachMessage: async ({ message }) => {
            console.log("[Hot Items] Received message:", message.value?.toString());
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
      "Content-Encoding": "none",
    },
  });
}
