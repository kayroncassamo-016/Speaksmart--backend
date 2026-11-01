
import type { Request, Response, NextFunction } from "express";
import { AdminAuthService } from "../../services/admin/AdminAuthService";

const COOKIE_NAME = "speaksmart_admin_session";


const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" as const : "lax" as const,
  path: "/",
};

class AdminAuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
      ) {
        return res.status(400).json({
          message: "Email and password are required.",
        });
      }

      const result = await AdminAuthService.login(email, password);

      res.cookie(COOKIE_NAME, result.token, {
        ...cookieOptions,
        expires: result.expiresAt,
      });

      return res.status(200).json({
        token: result.token,
        admin: result.admin,
        expiresAt: result.expiresAt,
      });
      
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid credentials.") {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }

      return next(error);
    }
  }

  async session(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.[COOKIE_NAME];

      if (!token) {
        return res.status(401).json({
          authenticated: false,
        });
      }

      const admin = await AdminAuthService.validateSession(token);

      if (!admin) {
        res.clearCookie(COOKIE_NAME, cookieOptions);

        return res.status(401).json({
          authenticated: false,
        });
      }

      return res.status(200).json({
        authenticated: true,
        admin,
      });
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.[COOKIE_NAME];

      if (token) {
        await AdminAuthService.logout(token);
      }

      res.clearCookie(COOKIE_NAME, cookieOptions);

      return res.status(200).json({
        message: "Logged out successfully.",
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { AdminAuthController };
