import { prismaClient } from "../../../Prisma";


const cleanupAdminSessions = async () => {
  try {
    const result = await prismaClient.adminSession.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    });

    console.log(
      `[Session Cleanup] ${result.count} expired sessions deleted.`
    );
  } catch (error) {
    console.error("[Session Cleanup] Failed:", error);
  }
};

export { cleanupAdminSessions };