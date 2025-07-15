import { Order } from "../../domain/Order";
import { orders } from "./schema";
import { OrderRepositoryPort } from "../../domain/ports/OrderRepositoryPort";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { OrderUpdateData } from "../../domain/Order";


function toDomain(record: any): Order {
  return {
    orderId: record.order_id,
    userId: record.user_id,
    type: record.type,
    stockSymbol: record.stock_symbol,
    quantity: record.quantity,
    price: record.price,
    status: record.status,
    createdAt: record.created_at,
  };
}

export class DrizzleOrderRepositoryAdapter implements OrderRepositoryPort {
  constructor(private db: NodePgDatabase) {}
  async save(order: Order): Promise<Order> {
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
  async findById(id: string): Promise<Order | null> {
    const result = await this.db
      .select()
      .from(orders)
      .where(eq(orders.orderId, id));

    return result.length ? toDomain(result[0]) : null;
  }

  async findByUserId(userId: number): Promise<Order[]> {
    const result = await this.db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId));

    return result.map(toDomain);
  }
  async update(orderId: string, data: OrderUpdateData): Promise<Order | null> {
    const result = await this.db
      .update(orders)
      .set({
        quantity: data.quantity ?? undefined,
        price: data.price ?? undefined,
      })
      .where(eq(orders.orderId, orderId));

    return result.length ? toDomain(result[0]) : null;
  }

  async delete(orderId: string): Promise<boolean> {
    const result = await this.db
      .delete(orders)
      .where(eq(orders.orderId, orderId));

    return result.rowCount > 0;
  }
}