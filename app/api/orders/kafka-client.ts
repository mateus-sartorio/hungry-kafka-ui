import { Kafka } from "kafkajs";

const kafkaBrokers = (process.env.KAFKA_BROKERS ?? "localhost:9092,localhost:9094,localhost:9096")
  .split(",")
  .map((broker) => broker.trim())
  .filter(Boolean);

export const kafkaOrderUi = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID ?? "queue-sine-ui",
  brokers: kafkaBrokers,
});
