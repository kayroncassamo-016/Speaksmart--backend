
import type { Request, Response, NextFunction } from "express";
import { AdminAuthService } from "../services/admin/AdminAuthService";

const COOKIE_NAME = "speaksmart_admin_session";

async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const admin = await AdminAuthService.validateSession(token);

    if (!admin) {
      res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });

      return res.status(401).json({
        message: "Invalid or expired session.",
      });
    }

    res.locals.admin = admin;

    return next();
  } catch (error) {
    return next(error);
  }
}

export { requireAdmin };
