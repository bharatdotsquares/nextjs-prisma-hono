import 'server-only'
import {  Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "@/features/user/server/route";
 
const app = new Hono().basePath("/api");
app.use('*', async (c, next) => {
    await next()
})

const routes = app.route("/auth", auth);

export const GET = handle(app);
export const POST = handle(app);
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export type AppType = typeof routes

