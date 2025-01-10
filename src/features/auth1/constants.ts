import { PrismaClient } from "@prisma/client";

export const AUTH_COOKIE = "cwa-session";
export type Context = { Variables: { prisma: PrismaClient } }