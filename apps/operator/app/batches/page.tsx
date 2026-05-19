'use client'

import { AuthProvider } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { BatchTraceability } from '@/components/batch-traceability'

export default function BatchesPage() {
  return (
    <AuthProvider>
      <DashboardLayout>
        <BatchTraceability />
      </DashboardLayout>
    </AuthProvider>
  )
}
