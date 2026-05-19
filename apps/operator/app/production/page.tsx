'use client'

import { AuthProvider } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { ProductionManagement } from '@/components/production-management'

export default function ProductionPage() {
  return (
    <AuthProvider>
      <DashboardLayout>
        <ProductionManagement />
      </DashboardLayout>
    </AuthProvider>
  )
}
