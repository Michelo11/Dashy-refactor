import { PrismaClient } from "@prisma/client";
export * from "@prisma/client";

const getPrisma = () => {
  return new PrismaClient();
};

const globalForPrisma = globalThis as { prisma?: ReturnType<typeof getPrisma> };

export const prisma = globalForPrisma.prisma || getPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;