

import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "dotenv";

import { DrizzleOrderRepositoryAdapter } from "./infrastructure/db/DrizzleOrderRepositoryAdapter";
import { EventPublisherAdapter } from "./infrastructure/messaging/EventPublisherAdapter";
import { OrderService } from "./core/OrderService";
import { PlaceOrderUseCase } from "./application/PlaceOrderUseCase";
import { GetUserOrdersUseCase } from "./application/GetUserOrdersUseCase";
import { GetOrderDetailsUseCase } from "./application/GetOrderDetailsUseCase";
import { UpdateOrderUseCase } from "./application/UpdateOrderUseCase";
import { CancelOrderUseCase } from "./application/CancelOrderUseCase";
import { createOrderRouter } from "./infrastructure/api/orderRouter";
config(); 

const app = express();
app.use(express.json());


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

const db = drizzle(pool);


const topicMap = {
  "order.placed": process.env.SNS_TOPIC_ORDER_PLACED!,
  "order.updated": process.env.SNS_TOPIC_ORDER_UPDATED!,
};

const region = process.env.AWS_REGION!;