import { pgTable, serial, text, timestamp ,integer, uuid } from 'drizzle-orm/pg-core';
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const tokens = pgTable('tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: integer('user_id').notNull(),
  token: text('token').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
