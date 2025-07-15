import { EventPublisherPort } from "../../user-service/domain/ports/EventPublisherPort";
import { Order, OrderUpdateData } from "../domain/Order";
import { OrderDomainService } from "../domain/OrderDomainService";
import { OrderRepositoryPort } from "../domain/ports/OrderRepositoryPort";
import { OrderServicePort } from "../domain/ports/OrderServicePort";
import { v4 as uuidv4 } from 'uuid';

export class OrderService implements OrderServicePort {
    private orderDomainService:OrderDomainService;
  constructor(
    private orderRepository: OrderRepositoryPort,
    
  ) {this.orderDomainService = new OrderDomainService();}
  async placeOrder(orderData: Omit<Order, 'orderId' | 'status' | 'createdAt'>): Promise<Order> {
    const newOrder:Order={
        orderId:uuidv4(),
        userId:orderData.userId,
        type:orderData.type,
        stockSymbol:orderData.stockSymbol,
        quantity:orderData.quantity,
        price:orderData.price,
        status:"pending",
        createdAt:new Date()
        }
        this.orderDomainService.validateQuantity(newOrder);

        await this.orderRepository.save(newOrder);
        return newOrder;

    }
    async getUserOrders(userId:number): Promise<Order[]> {
        
        const orders = await this.orderRepository.findByUserId(userId);
        return orders;
    }

    async getOrderDetails(userId:number,orderId:string): Promise<Order | null> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) throw new Error("Order not found");
        this.orderDomainService.validateUserPermission(userId,order);
        return order;
    }

    async updateOrder(userId:number,orderId:string, data:OrderUpdateData): Promise<Order | null> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) throw new Error("Order not found");
        this.orderDomainService.validateUserPermission(userId,order);
        this.orderDomainService.validateOrderStatusForUpdate(order);
        
        const updateOrder= await this.orderRepository.update(order.orderId,data);
        return updateOrder;
    }

    async cancelOrder(userId:number,orderId:string): Promise<boolean> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) throw new Error("Order not found");
        this.orderDomainService.validateUserPermission(userId,order);
        this.orderDomainService.validateOrderStatusForCancel(order);
        
        const cancelOrder= await this.orderRepository.delete(order.orderId);
        return cancelOrder;
}
}