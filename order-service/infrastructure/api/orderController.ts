import {z, ZodError} from 'zod';
import { NextFunction, Request, Response } from "express";
import { PlaceOrderUseCase } from "../../application/PlaceOrderUseCase";
import { GetUserOrdersUseCase } from "../../application/GetUserOrdersUseCase";
import { GetOrderDetailsUseCase } from "../../application/GetOrderDetailsUseCase";
import { UpdateOrderUseCase } from "../../application/UpdateOrderUseCase";
import { CancelOrderUseCase } from "../../application/CancelOrderUseCase";
import { authMiddleware } from "./authMiddleware";
import { ErrorResponse, OrderResponse } from '../../src/clients/self';
import { Order } from '../../domain/Order';

const PlaceOrderSchema = z.object({
  type: z.enum(["buy", "sell"]),
  stockSymbol: z.string().min(1, "Stock symbol is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  price: z.number().positive("Price must be a positive number"),    
});

export type PlaceOrder= z.infer<typeof PlaceOrderSchema>;

export interface PlaceOrderRequest extends PlaceOrder{
  userId: number;

}


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

  router.post("/", authMiddleware, async (req: Request, res: Response) => {
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

    // const orderRequest: PlaceOrderRequest = {
    //     userId:userId,
    //     type: validated.type,
    //     stockSymbol: validated.stockSymbol,
    //     quantity: validated.quantity,
    //     price: validated.price,
        
    //   };

const orderRequest: Omit<Order, "orderId" | "status" | "createdAt"> = {
  userId,
  type: validated.type,
  stockSymbol: validated.stockSymbol,
  quantity: validated.quantity,
  price: validated.price,
};

      const order = await placeOrderUseCase.execute(orderRequest);

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
      return handleError(error, res);
    }
  });

router.get('/healthCheck', async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'OK' });
});

  

  router.get("/",authMiddleware, async (req: Request, res: Response) => {
    try {
      const { userId } = req as AuthenticatedRequest;
      if (!userId) {
        return res.status(401).json({
          code: 401,
          message: "Unauthorized",
          details: "Missing user ID in request",
        } satisfies ErrorResponse);
      }

      const orders = await getUserOrdersUseCase.execute(userId);
      // const response: Array<OrderResponse> = orders.map((order) => ({
      //   orderId: order.orderId,
      //   type: order.type,
      //   stockSymbol: order.stockSymbol,
      //   quantity: order.quantity,
      //   price: order.price,
      //   status: order.status,
      //   createdAt: order.createdAt.toISOString(),
        
      // }));
      const response: Array<OrderResponse> = orders.map((order) => {
  console.log("CreatedAt value:", order.createdAt);
  console.log("Type:", typeof order.createdAt);

  return {
    orderId: order.orderId,
    type: order.type,
    stockSymbol: order.stockSymbol,
    quantity: order.quantity,
    price: order.price,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  };
});

      

      return res.status(200).json(response);
    }  catch (error) {
      return handleError(error, res);
    }
  });

  router.get("/:orderId",authMiddleware, async (req: Request, res: Response) => {
    try {
      const { userId } = req as AuthenticatedRequest;
      const { orderId } = req.params;
      if (!userId) {
        return res.status(401).json({
          code: 401,
          message: "Unauthorized",
          details: "Missing user ID in request",
        } satisfies ErrorResponse);
      }

      const order = await getOrderDetailsUseCase.execute(userId, orderId);
      if (!order) {
        return res.status(404).json({
          code: 404,
          message: "Order not found",
          details: "No order found with the given orderId",
        } satisfies ErrorResponse);
      }
      const response: OrderResponse = {
        orderId: order.orderId,
        type: order.type,
        stockSymbol: order.stockSymbol,
        quantity: order.quantity,
        price: order.price,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      };

      return res.status(200).json(response);
    } catch (error) {
      return handleError(error, res);
    }
  });

  router.put("/:orderId",authMiddleware, async (req: Request, res: Response) => {
    try {
      const { userId } = req as AuthenticatedRequest;
      const { orderId } = req.params;
      if (!userId) {
        return res.status(401).json({
          code: 401,
          message: "Unauthorized",
          details: "Missing user ID in request",
        } satisfies ErrorResponse);
      }

       const validated = UpdateOrderSchema.pick({
      quantity: true,
      price: true,
    }).parse(req.body);

    const order = await updateOrderUseCase.execute(userId, orderId, validated);
    if (!order) {
  return res.status(404).json({
    code: 404,
    message: "Order not found",
    details: `No order found with orderId ${orderId}`,
  } satisfies ErrorResponse);
}



      const response: OrderResponse = {
        orderId: order.orderId,
        type: order.type,
        stockSymbol: order.stockSymbol,
        quantity: order.quantity,
        price: order.price,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      };
      return res.status(200).json(response);
    } catch (error) {
      return handleError(error, res);
    }
});

  router.delete("/:orderId",authMiddleware, async (req: Request, res: Response) => {try {
      const { userId } = req as AuthenticatedRequest;
      const { orderId } = req.params;
      if (!userId) throw new Error("Unauthorized");

      await cancelOrderUseCase.execute(userId, orderId);
      return res.status(200).json({ message: "Order cancelled successfully." });
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