import { Order } from "../domain/Order";
import { OrderDomainService } from "../domain/OrderDomainService";
import { EventPublisherPort } from "../domain/ports/EventPublisherPort";
import { OrderRepositoryPort } from "../domain/ports/OrderRepositoryPort";
import { v4 as uuidv4 } from "uuid";

export class PlaceOrderUseCase {
    constructor(
        private eventPublisher: EventPublisherPort,
        private orderRepository: OrderRepositoryPort,
        private orderDomainService: OrderDomainService
    ) {}
    async execute(orderData: Omit<Order, 'orderId' | 'status' | 'createdAt'>): Promise<Order> {
        const newOrder: Order = {
            orderId: uuidv4(),
            userId: orderData.userId,
            type: orderData.type,
            stockSymbol: orderData.stockSymbol,
            quantity: orderData.quantity,
            price: orderData.price,
            status: "pending",
            createdAt: new Date(),
        };
        this.orderDomainService.validateQuantity(newOrder);

        await this.orderRepository.save(newOrder);
        await this.eventPublisher.publish('order.placed', {
      orderId: newOrder.orderId,
      type: newOrder.type,
      stockSymbol: newOrder.stockSymbol,
      quantity: newOrder.quantity,
      price: newOrder.price,
      status: newOrder.status,
      createdAt: newOrder.createdAt
    });
        return newOrder;
    }
}