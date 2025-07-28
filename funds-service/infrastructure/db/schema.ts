import { pgTable, serial, text, timestamp ,integer, uuid, real, jsonb} from 'drizzle-orm/pg-core';
import { stat } from 'fs';

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

export const outbox=pgTable('outbox',{
    id:uuid('id').defaultRandom().primaryKey(),
    event_type:text('event_type').notNull(),
    payload:jsonb('payload').notNull(),
    status:text('status').notNull().default('pending'),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
     lockedBy: text('locked_by'), // the poller instance or worker ID
  publishedAt: timestamp("published_at", { withTimezone: true }),
})