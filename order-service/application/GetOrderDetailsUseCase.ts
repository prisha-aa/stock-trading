import { Order } from "../domain/Order";
import { OrderDomainService } from "../domain/OrderDomainService";
import { OrderRepositoryPort } from "../domain/ports/OrderRepositoryPort";

export class GetOrderDetailsUseCase {
    constructor(
        private orderRepository: OrderRepositoryPort,
        private orderDomainService: OrderDomainService
    ) {}
    async execute(userId: number, orderId: string): Promise<Order | null> {
        const order = await this.orderRepository.findById(orderId);
        if (!order) throw new Error("Order not found");
        console.log("Checking permission for userId:", userId, "against order.userId:", order.userId);

        this.orderDomainService.validateUserPermission(userId, order);
        return order;
    }
}