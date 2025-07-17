import express from "express";
import { config } from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import { EventPublisherAdapter } from "./infrastructure/messaging/EventPublisherAdapter";

import { CreateTransactionUseCase } from "./application/CreateTransaction";
import { GetTransactionsUseCase } from "./application/GetTransactionsUseCase";
import { FundDomainService } from "./domain/FundDomainService";
import { DrizzleUserBalanceRepositoryAdapter } from "./infrastructure/db/DrizzleUserBalanceRepositryAdapter";
import { DrizzleTransactionRepositoryAdapter } from "./infrastructure/db/DrizzleTransactionRepositoryAdapter";
import { createFundRouter } from "./infrastructure/api/fundRouter";


config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

const transactionRepository = new DrizzleTransactionRepositoryAdapter(db);
const userBalanceRepository = new DrizzleUserBalanceRepositoryAdapter(db);
const eventPublisher = new EventPublisherAdapter("ap-south-1", process.env.SNS_TOPIC_FUND_UPDATES!);

const fundDomainService = new FundDomainService();
const createTransactionUseCase = new CreateTransactionUseCase(
  transactionRepository,
  eventPublisher,
  fundDomainService,
  userBalanceRepository
);
const getTransactionsUseCase = new GetTransactionsUseCase(
  transactionRepository,

);

const app = express();
app.use(express.json());

app.use("/funds", createFundRouter(createTransactionUseCase, getTransactionsUseCase));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`🚀 Fund Service running on port ${PORT}`);
});
