'use client'

import { AuthProvider } from '@/lib/auth-context'
import { DashboardLayout } from '@/components/dashboard-layout'
import { InventoryManagement } from '@/components/inventory-management'

export default function InventoryPage() {
  return (
    <AuthProvider>
      <DashboardLayout>
        <InventoryManagement />
      </DashboardLayout>
    </AuthProvider>
  )
}
