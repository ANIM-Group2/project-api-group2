'use client'

import { AuthProvider } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { DashboardOverview } from '@/components/dashboard-overview'

export default function HomePage() {
  return (
    <AuthProvider>
      <DashboardLayout>
        <DashboardOverview />
      </DashboardLayout>
    </AuthProvider>
  )
}
