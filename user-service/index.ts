// import express from "express";
// import dotenv from "dotenv";
// import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import { createAuthRouter } from "./interfaces/http/routes";
// import { DrizzleUserRepositoryAdapter } from "./infrastructure/db/DrizzleUserRepositoryAdapter";
// import { SnsSqsEventPublisherAdapter } from "./infrastructure/events/SnsSqsEventPublisherAdapter";

// import { RegisterUserUseCase } from "./application/RegisterUserUseCase";
// import * as schema from "./infrastructure/db/schema";
// import { UserService } from "./core/UserService";

// dotenv.config();

// const app = express();
// app.use(express.json());

// async function main() {
  
//   const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });
//   const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });

//   // Adapters
//   const userRepository = new DrizzleUserRepositoryAdapter(db);
//   const eventPublisher = new SnsSqsEventPublisherAdapter(
//     process.env.AWS_REGION!,
//     process.env.SNS_TOPIC_ARN!
//   );

  
//   const userService = new UserService(userRepository, eventPublisher);

  
//   const registerUserUseCase = new RegisterUserUseCase(userService);

  
//   app.use("/user", createAuthRouter(registerUserUseCase));

//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`User Service running on port ${PORT}`);
//   });
// }

// main().catch((err) => {
//   console.error("Error starting User Service:", err);
//   process.exit(1);
// });


