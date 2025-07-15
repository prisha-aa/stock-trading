export type OrderType = 'buy' | 'sell';
export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
  orderId: string;
  userId: number;
  type: OrderType;
  stockSymbol: string;
  quantity: number;
  price: number;
  status: OrderStatus;
  createdAt: Date;
}
export type OrderUpdateData = {
  quantity?: number;
  price?: number;
};