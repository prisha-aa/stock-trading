import { pgTable, serial, text, timestamp ,integer, uuid, real} from 'drizzle-orm/pg-core';

export const transactions = pgTable('transactions',{
    transactionId:uuid('transaction_id').defaultRandom().primaryKey(),
    userId:integer('user_id').notNull(),
    type:text('type').notNull(),
    amount:real('amount').notNull(),
    description:text('description'),
    date:timestamp('date').defaultNow().notNull()
})
export const user_balances=pgTable('user_balances',{
    userId:integer('user_id').notNull().primaryKey(),
    balance:real('balance').notNull(),
})
