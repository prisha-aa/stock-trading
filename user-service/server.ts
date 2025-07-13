import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "dotenv";

import { DrizzleUserRepositoryAdapter } from "./infrastructure/db/DrizzleUserRepositoryAdapter";
import { EventPublisherAdapter } from "./infrastructure/messaging/EventPublisherAdapter";
import { UserService } from "./core/UserService";
import { RegisterUserUseCase } from "./application/RegisterUserUseCase";
import { createAuthRouter } from "./infrastructure/api/authRouter";
import { DrizzleTokenRepository } from "./infrastructure/db/DrizzleTokenRepository";
import {  LoginUserUseCase } from "./application/LoginUserUseCase";
import { LogoutUserUseCase } from "./application/LogoutUserUseCase";


config(); 

const app = express();
app.use(express.json());


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

const db = drizzle(pool);


const userRepo = new DrizzleUserRepositoryAdapter(db);
const eventPublisher = new EventPublisherAdapter("ap-south-1", process.env.SNS_TOPIC_ARN!);
const tokenRepo = new DrizzleTokenRepository(db);
const userService = new UserService(userRepo, eventPublisher,tokenRepo);


const registerUserUseCase = new RegisterUserUseCase(userService);
const loginUserUseCase = new LoginUserUseCase(userService);
const logoutUserUseCase = new LogoutUserUseCase(userService);

app.use("/user", createAuthRouter(registerUserUseCase,loginUserUseCase,logoutUserUseCase));


app.listen(3000, () => {
  console.log("✅ User service running on port 3000");
});
