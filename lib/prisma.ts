<<<<<<< HEAD
import { PrismaClient } from '@prisma/client';
=======
import { PrismaClient } from "@prisma/client";
>>>>>>> b1f49a1dde3a0dc9d15ad9c9bde1fe766b755667

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
<<<<<<< HEAD
    log: ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
=======
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
>>>>>>> b1f49a1dde3a0dc9d15ad9c9bde1fe766b755667
