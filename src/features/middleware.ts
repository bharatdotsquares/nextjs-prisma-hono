import { withAuth } from "next-auth/middleware";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validateAuthentication } from "./lib/session";

export default withAuth(
  async function middleware(req) {
    try {
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-pathname", req.nextUrl.pathname);
      const nextAuthSid = cookies().get("next-auth-sid")?.value;
      const role = req.nextUrl.pathname?.split("/")[1];
      if (role) {
        const excludedPaths = [
          `/${role}`,
          `/${role}/forgot-password`,
          `/${role}/reset-password`,
          `/${role}/login`,
          `/${role}/two-way-authentication`
        ];

        if (req.nextUrl?.pathname?.includes("two-way-authentication")) {
          const pathUrlSplit = req.nextUrl?.pathname
            .split("/")
            .slice(0, 3)
            .join("/");
          req.nextUrl.pathname = pathUrlSplit;
        }
        const { data: session, status } = (await validateAuthentication(
          nextAuthSid as string,
          role,
          req.nextUrl.pathname
        )) as any;
        if (!status) {
          if (
            !status &&
            !session?.access_token &&
            !(
              req.nextUrl.pathname === `/${role}` ||
              excludedPaths.includes(req.nextUrl.pathname as string)
            )
          ) {
            return NextResponse.redirect(new URL(`/${role}/login`, req.url));
          }
        }
        if (
          status &&
          session?.access_token &&
          excludedPaths.includes(req.nextUrl.pathname as string)
        ) {
          return NextResponse.redirect(new URL(`/${role}/home`, req.url));
        }
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders
        }
      });
    } catch (error) {
      console.log("klg-51", JSON.stringify(error, null, 4));
    }
  },
  {
    callbacks: {
      authorized: () => {
        return true;
      }
    }
  }
);

export const config = {
  matcher: [
    "/api/auth/[...nextauth]",
    "/admin/:path*",
  ]
};
