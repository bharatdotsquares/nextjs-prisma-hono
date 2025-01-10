"use client"
import { useSession } from "@hono/auth-js/react"

export default function Home() { 
  const { data: session, update } = useSession()

  return <p>{JSON.stringify(session)}</p>
}
