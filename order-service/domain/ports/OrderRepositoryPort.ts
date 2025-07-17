import { Order, OrderUpdateData } from "../Order";


export interface OrderRepositoryPort {
    save(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    findByUserId(userId:number): Promise<Order[]>;
    update(orderId: string, data: OrderUpdateData): Promise<Order | null>;
    delete(orderId: string): Promise<boolean>;
    updateStatus(orderId: string, status: "pending" | "completed"): Promise<void>;
    getPendingOrdersOlderThan(minutes: number): Promise<Order[]>;
}