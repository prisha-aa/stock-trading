import { Order, OrderUpdateData } from "../Order";

export interface OrderServicePort {
    placeOrder(orderData:Omit<Order, 'orderId' | 'status' | 'createdAt'>): Promise<Order>;
    getUserOrders(userId:number): Promise<Order[]>;
    getOrderDetails(userId:number,orderId:string): Promise<Order | null>;
    updateOrder(userId:number,orderId:string, data:OrderUpdateData): Promise<Order | null>;
    cancelOrder(userId:number,orderId:string): Promise<boolean>;
}