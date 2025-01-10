"use client"
import { SessionProvider } from "@hono/auth-js/react";
import {QueryProvider} from "@/components/QueryProvider";
function Provider({children}:{children:React.ReactNode}) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </SessionProvider>
  )
}

export default Provider