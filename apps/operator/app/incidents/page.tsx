'use client'

import { AuthProvider } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { IncidentReporting } from '@/components/incident-reporting'

export default function IncidentsPage() {
  return (
    <AuthProvider>
      <DashboardLayout>
        <IncidentReporting />
      </DashboardLayout>
    </AuthProvider>
  )
}
