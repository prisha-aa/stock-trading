import {z} from 'zod';
import { NextFunction, Request, Response } from "express";
import { PlaceOrderUseCase } from "../../application/PlaceOrderUseCase";
import { GetUserOrdersUseCase } from "../../application/GetUserOrdersUseCase";
import { GetOrderDetailsUseCase } from "../../application/GetOrderDetailsUseCase";
import { UpdateOrderUseCase } from "../../application/UpdateOrderUseCase";
import { CancelOrderUseCase } from "../../application/CancelOrderUseCase";
import { authMiddleware } from "./authMiddleware";
import { ErrorResponse, OrderResponse, PlaceOrderRequest } from '../../src/clients/self';

const PlaceOrderSchema = z.object({
  type: z.enum(["buy", "sell"]).min(1, "Type is required (either sll or buy)"),
  stockSymbol: z.string().min(1, "Stock symbol is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  price: z.number().positive("Price must be a positive number"),    
});

const GetUserOrdersSchema = z.object({
  userId: z.number().min(1, "User ID is required"),
});

const GetOrderDetailsSchema = z.object({
  userId: z.number().min(1, "User ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
});

const UpdateOrderSchema = z.object({
  userId: z.number().min(1, "User ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  price: z.number().positive("Price must be a positive number"),
});

const CancelOrderSchema = z.object({
  userId: z.number().min(1, "User ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
});
interface AuthenticatedRequest extends Request {
  userId?: number;
}


export const createOrderRouter = (
  placeOrderUseCase: PlaceOrderUseCase,
  getUserOrdersUseCase: GetUserOrdersUseCase,
  getOrderDetailsUseCase: GetOrderDetailsUseCase,
  updateOrderUseCase: UpdateOrderUseCase,
  cancelOrderUseCase: CancelOrderUseCase
) => {
  const router = require("express").Router();

  router.post("/orders", authMiddleware, async (req: Request, res: Response) => {
    try {
      const { userId } = req as AuthenticatedRequest;
      if (!userId) {
        return res.status(401).json({
          code: 401,
          message: "Unauthorized",
          details: "Missing user ID in request",
        } satisfies ErrorResponse);
      }

      const validated = PlaceOrderSchema.parse(req.body);

     const orderRequest: PlaceOrderRequest = {
        type: validated.type,
        stockSymbol: validated.stockSymbol,
        quantity: validated.quantity,
        price: validated.price,
      };

      const order = await placeOrderUseCase.execute( orderRequest);

      const response: OrderResponse = {
        orderId: order.orderId,
        type: order.type,
        stockSymbol: order.stockSymbol,
        quantity: order.quantity,
        price: order.price,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      };



      return res.status(201).json(response);
    } catch (error) {
        if (error instanceof ZodError) {
          const details = Object.entries(error.flatten().fieldErrors)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
            .join(" | ");

          return res.status(400).json({
            code: 400,
            message: "Validation failed",
            details,
          });               
        }

       const errorResponse: ErrorResponse = {
        code: 500,
        message: "Order placement failed",
        details: (error as Error).message ?? "Unknown error",
      };
      return res.status(500).json(errorResponse);
    }
  });

