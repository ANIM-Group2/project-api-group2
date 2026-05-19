'use client'

import { AuthProvider } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { LogisticsDashboard } from '@/components/logistics-dashboard'

export default function LogisticsPage() {
  return (
    <AuthProvider>
      <DashboardLayout>
        <LogisticsDashboard />
      </DashboardLayout>
    </AuthProvider>
  )
}
