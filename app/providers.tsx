'use client'

import { AuthProvider } from '@/lib/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@vercel/analytics/next'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
      <Analytics />
    </AuthProvider>
  )
}