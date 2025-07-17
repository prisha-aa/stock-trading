import cron from "node-cron";
import { DrizzleOrderRepositoryAdapter } from "../infrastructure/db/DrizzleOrderRepositoryAdapter";
import { db } from "../infrastructure/db/db";
import { EventPublisherAdapter } from "../infrastructure/messaging/EventPublisherAdapter";

async function updateOldOrders() {
  const orderRepo = new DrizzleOrderRepositoryAdapter(db);

  const topicMap = {
    "order.updated": process.env.SNS_TOPIC_ORDER_UPDATED!,
  };
  const eventPublisher = new EventPublisherAdapter(process.env.AWS_REGION!, topicMap);

  const orders = await orderRepo.getPendingOrdersOlderThan(2);

  for (const order of orders) {
    await orderRepo.updateStatus(order.orderId, "completed");
    await eventPublisher.publish("order.updated", {
      orderId: order.orderId,
      quantity: order.quantity,
      price: order.price,
      updatedAt: new Date().toISOString(),
      status: "completed",
    });

    console.log(`Order ${order.orderId} marked as completed and event published.`);
  }
}

// ⏰ Run every minute
cron.schedule("* * * * *", () => {
  console.log("Running scheduled job: updateOldOrders");
  updateOldOrders().catch(console.error);
});
