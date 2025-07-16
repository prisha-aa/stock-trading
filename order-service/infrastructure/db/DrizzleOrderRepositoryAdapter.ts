import { Order, OrderStatus, OrderType } from "../../domain/Order";
import { orders } from "./schema";
import { OrderRepositoryPort } from "../../domain/ports/OrderRepositoryPort";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { OrderUpdateData } from "../../domain/Order";



function toDomain(record: any): Order {
  console.log("DB record created_at:", record.createdAt); 
  return {
    orderId: record.orderId,
    userId: record.userId,
    type: record.type,
    stockSymbol: record.stockSymbol,
    quantity: record.quantity,
    price: record.price,
    status: record.status,
    createdAt: record.createdAt ? new Date(record.createdAt) : new Date(0),
  };
}

export class DrizzleOrderRepositoryAdapter implements OrderRepositoryPort {
  constructor(private db: NodePgDatabase) {}
  async save(order: Order): Promise<Order> {
    const createdAt = order.createdAt ?? new Date();
    console.log("Saving order with createdAt:", createdAt); 
    const [result] = await this.db
      .insert(orders)
      .values({
        orderId: order.orderId,
        userId: order.userId,
        type: order.type,
        stockSymbol: order.stockSymbol,
        quantity: order.quantity,
        price: order.price,
        status: order.status,
        createdAt: order.createdAt, 
        
      })
      .returning();

    return toDomain(result);
  }
  // async findById(id: string): Promise<Order | null> {
  //   const result = await this.db
  //     .select()
  //     .from(orders)
  //     .where(eq(orders.orderId, id));

  //   return result.length ? toDomain(result[0]) : null;
  // }

  async findById(id: string): Promise<Order | null> {
  const result = await this.db
    .select({
      orderId: orders.orderId,
      userId: orders.userId,
      type: orders.type,
      stockSymbol: orders.stockSymbol,
      quantity: orders.quantity,
      price: orders.price,
      status: orders.status,
      createdAt: orders.createdAt,  // alias to camelCase property
    })
    .from(orders)
    .where(eq(orders.orderId, id));

  return result.length ? toDomain(result[0]) : null;
}


  // async findByUserId(userId: number): Promise<Order[]> {
  //   const result = await this.db
  //     .select()
  //     .from(orders)
  //     .where(eq(orders.userId, userId));

  //   return result.map(toDomain);
  // }
  async findByUserId(userId: number): Promise<Order[]> {
  const result = await this.db
    .select({
      orderId: orders.orderId,
      userId: orders.userId,
      type: orders.type,
      stockSymbol: orders.stockSymbol,
      quantity: orders.quantity,
      price: orders.price,
      status: orders.status,
      createdAt: orders.createdAt,   // camelCase alias
    })
    .from(orders)
    .where(eq(orders.userId, userId));

  return result.map(record => ({
  ...record,
  type: record.type as OrderType,
  status: record.status as OrderStatus,
  createdAt: new Date(record.createdAt),
}));

}

  async update(orderId: string, data: OrderUpdateData): Promise<Order | null> {
  const [updated] = await this.db
    .update(orders)
    .set({
      quantity: data.quantity,
      price: data.price,
    })
    .where(eq(orders.orderId, orderId))
    .returning();

  return updated ? toDomain(updated) : null;
}

async delete(orderId: string): Promise<boolean> {
  const [deleted] = await this.db
    .delete(orders)
    .where(eq(orders.orderId, orderId))
    .returning();

  return !!deleted;
}

}