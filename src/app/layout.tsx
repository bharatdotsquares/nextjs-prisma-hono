import type { Metadata } from 'next'
import Provider from '@/components/Provider'

export const metadata: Metadata = {
  title: 'Hono | nextjs',
  description: 'Generated by hono'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
       <Provider>
        <body>{children}</body>
       </Provider>
       
    </html>
  )
}
