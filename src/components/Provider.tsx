"use client"
import { SessionProvider } from "@hono/auth-js/react";
function Provider({children}:{children:React.ReactNode}) {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default Provider