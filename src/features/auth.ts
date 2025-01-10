import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/prismaClient";
import { z } from "zod";
import CryptoJS from "crypto-js"; 

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || "pic-impact",
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      id: "Credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "example@qq.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await db.users.findFirst({
            where: {
              email: email,
            },
          });

          const hashedPassword = CryptoJS.HmacSHA512(
            password,
            process.env.AUTH_SECRET!
          ).toString();

          if (user && hashedPassword === user.password) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: "user.Image.png",
            };
          }
        }

        return null as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ token, session }) {
      if (token) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.name = token.name;
        // @ts-ignore
        session.user.email = token.email;
        // @ts-ignore
        session.user.image = token.image;
      }

      return session;
    },
  },
});
