import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

import type { NextAuthOptions } from "next-auth";
//import type { Adapter } from "@auth/core/adapters";
import { createSession } from "@/lib/session";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
/*!SECTION

model Sessions {
  id             String   @id @default(cuid())
  user_id        String
  expires        DateTime
  session_token  String   @db.Text
  access_token   String   @db.Text
  session_id     String   @db.VarChar(1000)
  activePath     String
  role           String
  role_id        String
  access_role_id String
  created_at     DateTime @default(now())
  updated_at     DateTime @updatedAt
}

*/
const prisma = new PrismaClient();

const adapter: any = {
  ...PrismaAdapter(prisma)
};

const generateSessionToken = () => {
  return randomUUID();
};

const fromDate = (time: number, date = Date.now()) => {
  return new Date(date + time * 1000);
};

export const createAuthSession = async (user: any) => {
  const session: {
    sessionToken: string;
    sid: string;
    expires: Date;
  } = {
    sessionToken: "",
    sid: "",
    expires: new Date()
  };
  const sessionMaxAge = 60 * 60 * 24 * 30;
  const sessionExpiry = fromDate(sessionMaxAge);
  session.sessionToken = generateSessionToken();
  const nextAuthSid = cookies().get("next-auth-sid")?.value;
  session.sid = nextAuthSid || generateSessionToken();
  session.expires = sessionExpiry;
  cookies().set({
    name: "next-auth-sid",
    value: session.sid,
    httpOnly: true
  });
  return await createSession(user, session);
};

export const authOptions: NextAuthOptions = {
  adapter: adapter as any,

  secret: process.env.JWT_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 60 * 60 * 24 * 30
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email address", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials: any) => {
        try {
          const params = {
            email: credentials.email,
            password: credentials.password,
            type: credentials.role
          };
          const url = `${process.env.SERVER_API_URL}/auth/login`;
          const { data } = await axios.post(url, params);
          if (data.status) {
            const session: {
              sessionToken: string;
              sid: string;
              expires: Date;
            } = {
              sessionToken: "",
              sid: "",
              expires: new Date()
            };
            const user = data.data;
            const sessionMaxAge = 60 * 60 * 24 * 30;
            const sessionExpiry = fromDate(sessionMaxAge);
            session.sessionToken = generateSessionToken();
            const nextAuthSid = cookies().get("next-auth-sid")?.value;
            session.sid = nextAuthSid || generateSessionToken();
            session.expires = sessionExpiry;
            cookies().set({
              name: "next-auth-sid",
              value: session.sid,
              httpOnly: true
            });
            if (user.IsTwoFA) {
              throw new Error(
                JSON.stringify({
                  status: false,
                  message: "Two Auth Authentication Required",
                  twoAuth: true,
                  id: user.Id
                })
              );
            }
            // Create session data
            await createSession(user, session);

            return user;
          } else {
            throw new Error(data.message);
          }
        } catch (e: any) {
          throw new Error(e.message);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },
    async session({ session, token }: any) {
      session.sid = cookies().get("next-auth-sid")?.value || "";
      if (session && token.user) {
        // const newsession = await getActiveSession(session);
        // return newsession;
      }
      return session;
    }
  }
};
