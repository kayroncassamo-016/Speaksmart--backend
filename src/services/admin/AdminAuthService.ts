
import { randomBytes, createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { prismaClient } from "../../../Prisma";

const SESSION_DURATION_DAYS = 7;

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const AdminAuthService = {
  login: async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    const admin = await prismaClient.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin) {
      throw new Error("Invalid credentials.");
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.passwordHash
    );

    if (!passwordMatches) {
      throw new Error("Invalid credentials.");
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);

    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + SESSION_DURATION_DAYS
    );

    await prismaClient.adminSession.create({
      data: {
        tokenHash,
        adminId: admin.id,
        expiresAt,
      },
    });

    return {
      token,
      expiresAt,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  },

  validateSession: async (token: string) => {
    const tokenHash = hashToken(token);

    const session = await prismaClient.adminSession.findUnique({
      where: { tokenHash },
      include: { admin: true },
    });

    if (!session) {
      return null;
    }

    if (session.expiresAt <= new Date()) {
      await prismaClient.adminSession.delete({
        where: { id: session.id },
      });

      return null;
    }

    return {
      id: session.admin.id,
      email: session.admin.email,
      role: session.admin.role,
    };
  },

  logout: async (token: string) => {
    const tokenHash = hashToken(token);

    await prismaClient.adminSession.deleteMany({
      where: { tokenHash },
    });
  },
};

export { AdminAuthService };
