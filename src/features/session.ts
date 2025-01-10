"use server";

const ROLES = {
    ADMIN: "admin",
};
  
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getActiveSession(session: any) {
  // Find All sessions
  const findAllSessions = await prisma.sessions.findMany({
    where: {
      session_id: session?.sid
    }
  });

  for (const rol in ROLES) {
    if (session[rol]) delete session[rol];
  }
  if (findAllSessions?.length) {
    for (const ses of findAllSessions) {
      session[ses.role] = ses;
    }
  }
  return session;
}

export async function createSession(user: any, session: any) {
  try {
    const findSession = await prisma.sessions.findFirst({
      where: {
        user_id: user.Id,
        role: user.type,
        session_id: session.sid
      }
    });
    if (!findSession) {
      await prisma.sessions.create({
        data: {
          access_token: user?.api_token,
          role_id: user?.RoleId,
          session_token: session?.sessionToken,
          session_id: session?.sid,
          user_id: user?.Id,
          expires: new Date(session?.expires),
          activePath: "",
          role: user.type,
          access_role_id: user?.AccessRoleIds
        }
      });
    } else {
      await prisma.sessions.update({
        where: {
          id: findSession.id
        },
        data: {
          expires: new Date(session.expires)
        }
      });
    }
    return session;
  } catch (error) {
    console.error("Error creating session:", error);
    return null;
  }
}

export async function logoutSession(session: any) {
  if (session?.session_id) {
    const user = session;
    const res = await fetch("/api/auth/signOut", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(user)
    });
    return await res.json();
  }
}

export async function validateAuthentication(
  sessionId: string,
  role: string,
  pathname: string
) {
  if (sessionId) {
    const res = await fetch(`${process.env.BASE_URL}/api/auth/validate`, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ sessionId, role, pathname })
      // next: { revalidate: 3600 / 2 }
    });
    const data = await res.json();
    return data;
  } else {
    return {
      status: false,
      data: null
    };
  }
}
