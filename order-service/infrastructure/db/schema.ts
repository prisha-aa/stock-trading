
import { pgTable, serial, text, timestamp ,integer, uuid, real} from 'drizzle-orm/pg-core';
export const orders= pgTable('orders',{
    orderId:uuid('order_id').defaultRandom().primaryKey(),
    userId:integer('user_id').notNull(),
    type:text('type').notNull(),
    stockSymbol:text('stock_symbol').notNull(),
    quantity:integer('quantity').notNull(),
    price:real('price').notNull(),
    status:text('status').notNull(),
    createdAt:timestamp('created_at').defaultNow().notNull()
})