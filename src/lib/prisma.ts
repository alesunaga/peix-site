// src/lib/prisma.ts
//
// Singleton do Prisma Client — evita esgotar conexões do Postgres durante
// hot-reload do Next.js em desenvolvimento (padrão recomendado pela própria
// documentação do Prisma para uso com Next.js).

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
