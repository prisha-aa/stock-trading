import request from "supertest";
import { createFundRouter } from "../infrastructure/api/fundRouter";
import express from "express";



jest.mock("../infrastructure/api/authMiddleware", () => ({
    authMiddleware: jest.fn((req, _res, next) => {
        (req as any).userId = 123;
        next();
    }),
}));

describe("Fund Router", () => {
    let app: express.Express;
    let createTransactionUseCase: any;
    let getTransactionsUseCase: any;
    beforeEach(() => {
        createTransactionUseCase = {
            execute: jest.fn(),
        };
        getTransactionsUseCase = {
            execute: jest.fn(),
        };
        app = express();
        app.use(express.json());
        app.use("/funds", createFundRouter(createTransactionUseCase, getTransactionsUseCase));
    });

    describe("POST /funds/transactions", () => {
        it("should create a transaction successfully (201)", async () => {
            const fakeTransaction = {
                transactionId: "t1",
                userId: 123,
                type: "deposit",
                amount: 100,
                description: "test",
                date: new Date(),
            };
            createTransactionUseCase.execute.mockResolvedValue(fakeTransaction);
            const res = await request(app).post("/funds/transactions").send({ type: "deposit", amount: 100, description: "test" });
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("transactionId", "t1");
            expect(createTransactionUseCase.execute).toHaveBeenCalledWith(123, "deposit", 100, "test");
        });

        it("should return 401 if userId missing", async () => {
            const authMiddleware = require("../infrastructure/api/authMiddleware").authMiddleware;
            authMiddleware.mockImplementationOnce((req: any, _res: any, next: any) => {
                next();
            });
            const res = await request(app).post("/funds/transactions").send({ type: "deposit", amount: 50 });
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized");
        });

        it("should return 400 for validation error", async () => {
            const res = await request(app).post("/funds/transactions").send({ type: "deposit", amount: -10 });
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Validation failed");
            expect(res.body.details).toContain("amount");
        });

        it("should handle Unauthorized error from useCase", async () => {
            createTransactionUseCase.execute.mockRejectedValue(new Error("Unauthorized"));
            const res = await request(app).post("/funds/transactions").send({ type: "deposit", amount: 100 });
            expect(res.status).toBe(401);
            expect(res.body.details).toContain("authentication");
        });

        it("should handle not found error", async () => {
            createTransactionUseCase.execute.mockRejectedValue(new Error("User not found"));
            const res = await request(app).post("/funds/transactions").send({ type: "deposit", amount: 100 });
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Not Found");
        });

        it("should handle generic error (500)", async () => {
            createTransactionUseCase.execute.mockRejectedValue(new Error("DB connection failed"));
            const res = await request(app).post("/funds/transactions").send({ type: "deposit", amount: 100 });
            expect(res.status).toBe(500);
            expect(res.body.message).toBe("Internal server error");
        });

    });

    describe("GET /funds/overview", () => {
        it("should return 200 and balance and transactions", async () => {
            const result ={
                balance:1000,
                transactions:[
                    {
                        transactionId:"t1",
                        type:"deposit",
                        amount:100,
                        description:"test",
                        date:new Date()
                    }
                ]   
            };
            getTransactionsUseCase.execute.mockResolvedValue(result);
            const res = await request(app).get("/funds/overview");
            expect(res.status).toBe(200);
            expect(res.body.balance).toBe(1000);
            expect(res.body.transactions.length).toBe(1);
        });

        it("should return 401 if userId missing", async () => {
            const authMiddleware = require("../infrastructure/api/authMiddleware").authMiddleware;
            authMiddleware.mockImplementationOnce((req: any, _res: any, next: any) => {
                next();
            });
            const res = await request(app).get("/funds/overview");
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized");
        });
        it("should handle Unauthorized error", async () => {
            getTransactionsUseCase.execute.mockRejectedValue(new Error("Unauthorized"));
            const res = await request(app).get("/funds/overview");
            expect(res.status).toBe(401);
        });

        it("should handle generic error (500)", async () => {
            getTransactionsUseCase.execute.mockRejectedValue(new Error("DB connection failed"));
            const res = await request(app).get("/funds/overview");
            expect(res.status).toBe(500);
        });
    });

});

        
            