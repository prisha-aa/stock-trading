
import { Router, Request, Response } from "express";
import { RegisterUserUseCase } from "../../application/RegisterUserUseCase";
import { LoginUserUseCase } from "../../application/LoginUserUseCase";
import { LogoutUserUseCase } from "../../application/LogoutUserUseCase";
import {
  RegisterUser201Response,
  ErrorResponse,
  LoginUserRequest,
  LoginUser200Response,
  LogoutUser200Response,
} from "../../generated-sdk/api";
import z, { ZodError } from "zod";

const RegisterUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

const LoginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const LogoutUserSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const createAuthRouter = (
  registerUserUseCase: RegisterUserUseCase,
  loginUserUseCase: LoginUserUseCase,
  logoutUserUseCase: LogoutUserUseCase
) => {
  const router = Router();

  router.post("/register", async (req: Request, res: Response) => {
    try {
      const validated = RegisterUserSchema.parse(req.body);

      const user = await registerUserUseCase.execute(
        validated.username,
        validated.email,
        validated.password
      );

      const response: RegisterUser201Response = {
        message: "User registered successfully",
        userId: user.id,
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
        code: 400,
        message: "Registration failed",
        details: (error as Error).message ?? "Unknown error",
      };

      return res.status(400).json(errorResponse);
    }
  });

  router.post("/login", async (req: Request, res: Response) => {
    try {
      const validated = LoginUserSchema.parse(req.body);

      const token = await loginUserUseCase.execute(
        validated.username,
        validated.password
      );

      const response: LoginUser200Response = { token };
      return res.status(200).json(response);
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
        code: 401,
        message: "Login failed",
        details: (error as Error).message ?? "Invalid credentials",
      };

      return res.status(401).json(errorResponse);
    }
  });

  router.post("/logout", async (req: Request, res: Response) => {
    try {
      const validated = LogoutUserSchema.parse(req.body);
      const token = validated.token;

      await logoutUserUseCase.execute(token);

      const response: LogoutUser200Response = { message: "Logged out" };
      return res.status(200).json(response);
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
        message: "Logout failed",
        details: (error as Error).message ?? "Unknown error",
      };
      return res.status(500).json(errorResponse);
    }
  });

  return router;
};
