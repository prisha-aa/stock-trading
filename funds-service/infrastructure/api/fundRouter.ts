import { CreateTransaction201Response, ErrorResponse, GetFundsOverview200Response } from "../../src/clients/self";
import { authMiddleware } from "./authMiddleware";
import { Request, Response } from "express";
import { CreateTransactionUseCase } from "../../application/CreateTransaction";
import { GetTransactionsUseCase } from "../../application/GetTransactionsUseCase";
import z from "zod";
import { ZodError } from "zod";


const CreateTransactionSchema = z.object({
    type: z.enum(["deposit", "withdrawal"]),
    amount: z.number().positive("Amount must be a positive number"),
    description: z.string().optional(),
});

const GetTransactionsSchema = z.object({
    userId: z.number().min(1, "User ID is required"),
});

interface AuthenticatedRequest extends Request {
    userId?: number;
}

export const createFundRouter = (
    createTransactionUseCase: CreateTransactionUseCase,
    getTransactionsUseCase: GetTransactionsUseCase
) => {
    const router = require("express").Router();
    router.post("/transactions", authMiddleware, async (req: Request, res: Response) => {
        try {
            const { userId } = req as AuthenticatedRequest;
            if (!userId) {
                return res.status(401).json({
                    code: 401,
                    message: "Unauthorized",
                    details: "Missing user ID in request",
                } satisfies ErrorResponse);
            }
            const validated = CreateTransactionSchema.parse(req.body);
            const transaction = await createTransactionUseCase.execute(userId, validated.type, validated.amount, validated.description);
            const response: CreateTransaction201Response = {
                transactionId: transaction.transactionId,
                userId: transaction.userId,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                date: transaction.date.toISOString(),
            };
            return res.status(201).json(response);
        } catch (error) {
            return handleError(error, res);
        }
    });
    router.get("/overview", authMiddleware, async (req: Request, res: Response) => {
        try {
            const { userId } = req as AuthenticatedRequest;
            if (!userId) {
                return res.status(401).json({
                    code: 401,
                    message: "Unauthorized",
                    details: "Missing user ID in request",
                } satisfies ErrorResponse);
            }
            const result = await getTransactionsUseCase.execute(userId);
                const response:GetFundsOverview200Response = {
  balance: result.balance,
  transactions: result.transactions.map((transaction) => ({
    transactionId: transaction.transactionId,
    type: transaction.type,
    amount: transaction.amount,
    description: transaction.description,
    date: transaction.date.toISOString(),
  })),
};

            return res.status(200).json(response);
        } catch (error) {
            return handleError(error, res);
        }
    });
    return router;
};

function handleError(error: unknown, res: Response) {
    if (error instanceof ZodError) {
        const details = Object.entries(error.flatten().fieldErrors)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
            .join(" | ");
        const response: ErrorResponse = {
            code: 400,
            message: "Validation failed",
            details,
        };
        return res.status(400).json(response);
    }
    if ((error as Error).message === "Unauthorized") {
        const response: ErrorResponse = {
            code: 401,
            message: "Unauthorized",
            details: "Missing or invalid authentication token",
        };
        return res.status(401).json(response);
    }
    if ((error as Error).message?.includes("not found")) {
        const response: ErrorResponse = {
            code: 404,
            message: "Not Found",
            details: (error as Error).message,
        };
        return res.status(404).json(response);
    }
    const response: ErrorResponse = {
        code: 500,
        message: "Internal server error",
        details: (error as Error).message ?? "Unexpected error",
    };
    return res.status(500).json(response);
}
            