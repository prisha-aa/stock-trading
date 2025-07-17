import { Order, OrderUpdateData } from "../domain/Order";
import { OrderDomainService } from "../domain/OrderDomainService";
import { EventPublisherPort } from "../domain/ports/EventPublisherPort";
import { OrderRepositoryPort } from "../domain/ports/OrderRepositoryPort";

export class UpdateOrderUseCase {
    constructor(
        private eventPublisher: EventPublisherPort,
        private orderRepository: OrderRepositoryPort,
        private orderDomainService: OrderDomainService
    ) {}
    async execute(userId: number, orderId: string, data: OrderUpdateData): Promise<Order | null> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) throw new Error("Order not found");
        this.orderDomainService.validateUserPermission(userId, order);
        this.orderDomainService.validateOrderStatusForUpdate(order);
        
        const updated = await this.orderRepository.update(order.orderId, data);
        if (!updated) return null;

        await this.eventPublisher.publish('order.updated', {
      orderId: updated.orderId,
      quantity: updated.quantity,
      price: updated.price,
      updatedAt: new Date().toISOString(),
      status: updated.status,
    });
        return updated;
    }
}