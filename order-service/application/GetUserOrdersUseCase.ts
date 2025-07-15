import { Order } from "../domain/Order";
import { OrderDomainService } from "../domain/OrderDomainService";
import { OrderRepositoryPort } from "../domain/ports/OrderRepositoryPort";

export class GetUserOrdersUseCase {
    constructor(
        private orderRepository: OrderRepositoryPort,
        private orderDomainService: OrderDomainService
    ) {}
    async execute(userId: number): Promise<Order[]> {
        const orders = await this.orderRepository.findByUserId(userId);
        return orders;
    }}