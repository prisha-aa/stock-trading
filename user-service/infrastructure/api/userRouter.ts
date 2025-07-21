
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
  GetUserProfile200Response,
  UpdateUserProfile200Response,
  RequestPasswordReset200Response,
  ResetPassword200Response,
} from "../../generated-sdk/api";
import z, { ZodError } from "zod";
import { authMiddleware } from "./middleware/authMiddleware";
import { GetUserProfileUseCase } from "../../application/GetUserProfileUseCase";
import { UpdateUserProfileUseCase } from "../../application/UpdateUserProfileUseCase";
import { RequestPasswordResetUseCase } from "../../application/RequestPasswordResetUseCase";
import { ResetPasswordUseCase } from "../../application/ResetPasswordUseCase";

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

const UpdateUserProfileSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});
const PasswordResetSchema = z.object({
  email: z.string().email(),
});

const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export const createAuthRouter = (
  registerUserUseCase: RegisterUserUseCase,
  loginUserUseCase: LoginUserUseCase,
  logoutUserUseCase: LogoutUserUseCase,
  getUserProfileUseCase: GetUserProfileUseCase,
  updateUserProfileUseCase: UpdateUserProfileUseCase,
  requestPasswordResetUseCase: RequestPasswordResetUseCase,
  resetPasswordUseCase: ResetPasswordUseCase
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


  

   interface AuthenticatedRequest extends Request {
   userId?: number;
 }

  router.get("/profile",authMiddleware, async (req: Request, res: Response) => {
    




       try {
        console.log("🔍 Inside GET /profile route");
         const { userId } = req as AuthenticatedRequest;
          if (!userId) {
         return res.status(401).json({
        code: 401,
        message: "Unauthorized",
        details: "Missing user ID in request",
      });
    }
      const user = await getUserProfileUseCase.execute(userId);
      const response: GetUserProfile200Response = {
  userId: user.id,
  username: user.username,
  email: user.email,
  firstName: user.firstName ?? undefined,
  lastName: user.lastName ?? undefined,
};  
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
        code: 404,
        message: "User not found",
        details: (error as Error).message ?? "User not found",
      };

      return res.status(404).json(errorResponse);
    }});

    router.patch("/profile",authMiddleware, async (req: Request, res: Response) => {
      try {
        console.log("👀 Incoming PATCH /profile body:", req.body);

        const { userId } = req as AuthenticatedRequest;
        
          if (!userId) {
          return res.status(401).json({
            code: 401,
            message: "Unauthori chapters",
            details: "Missing user ID in request",
          });
        }
        const validated = UpdateUserProfileSchema.parse(req.body);
        await updateUserProfileUseCase.execute(userId, validated);
        const response: UpdateUserProfile200Response = {
          message: "User profile updated successfully",
        };
        return res.status(200).json(response);
      }
      catch (error) {
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
          message: "Update failed",
          details: (error as Error).message ?? "Unknown error",
        };

        return res.status(400).json(errorResponse);
      }
    });

    router.post("/password/reset-request", async (req: Request, res: Response) => {
      console.log("📩 Incoming password reset request:", req.body);
      try {
        const validated = PasswordResetSchema.parse(req.body);
        await requestPasswordResetUseCase.execute(validated.email);
        const response: RequestPasswordReset200Response = {
          message: "Password reset email sent",
        };
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
      }});

      router.post("/password/reset", async (req: Request, res: Response) => {
        try {
          const validated = ResetPasswordSchema.parse(req.body);
          await resetPasswordUseCase.execute(validated.token, validated.newPassword);
          const response: ResetPassword200Response = {
            message: "Password reset successfully",
          };
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
            code: 400,
            message: "Reset password failed",
            details: (error as Error).message ?? "Unknown error",
          };
          return res.status(400).json(errorResponse);
        }
      });

  

  return router;

  
};
