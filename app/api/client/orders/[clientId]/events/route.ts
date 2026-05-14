import { NextRequest } from "next/server";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "queue-sine-ui-events",
  brokers: ["localhost:9092"],
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;

  if (!clientId) {
    return new Response("Missing client ID", { status: 400 });
  }

  const topic = `order-status-changed-${clientId}`;
  const consumer = kafka.consumer({ groupId: `queue-sine-ui-group-${clientId}-${Date.now()}` });

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
