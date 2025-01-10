import "server-only";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { AUTH_COOKIE } from "@/features/auth/constants";

type AdditionalContext = {
  Variables: {
    user: String;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {

    const session = getCookie(c, AUTH_COOKIE);

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

  


    await next();
  }
);
