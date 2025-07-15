import {Order} from "./Order";
export class OrderDomainService {
    validateQuantity(order:Order):void{
        if (order.quantity <= 0) throw new Error("Quantity must be a positive number");
        }
    
    validateOrderStatusForUpdate(order: Order): void {
    if (order.status === "pending") {
      throw new Error("Cannot update order while it is pending.");
    }
  }

  validateOrderStatusForCancel(order: Order): void {
    if (order.status === "completed" || order.status === "cancelled") {
      throw new Error("Cannot cancel an order that is completed or already cancelled.");
    }
  }

    
validateUserPermission(userId: number, order: Order): void {
    if (order.userId !== userId) {
      throw new Error("User does not have permission to modify this order.");
    }
  }
}