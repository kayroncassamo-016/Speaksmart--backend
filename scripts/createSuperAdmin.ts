import "dotenv/config";
import bcrypt from "bcryptjs";
import { prismaClient } from "../Prisma";

async function createSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD are required.");
  }

  if (password.length < 16) {
    throw new Error("The password must contain at least 16 characters.");
  }

  const existingAdmin = await prismaClient.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    throw new Error("An administrator with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prismaClient.admin.create({
    data: {
      email,
      passwordHash,
      role: "SUPER_ADMIN",
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  console.log("SUPER_ADMIN created successfully:");
  console.log(admin);
}

createSuperAdmin()
  .catch((error) => {
    console.error("Failed to create SUPER_ADMIN:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });