'use client'

import { AuthProvider } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { AnalyticsDashboard } from '@/components/analytics-dashboard'

export default function AnalyticsPage() {
  return (
    <AuthProvider>
      <DashboardLayout>
        <AnalyticsDashboard />
      </DashboardLayout>
    </AuthProvider>
  )
}
