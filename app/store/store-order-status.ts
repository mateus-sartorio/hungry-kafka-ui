export type StoreKafkaOrderStatus =
  | "CREATED"
  | "ACCEPTED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "UNKNOWN";
