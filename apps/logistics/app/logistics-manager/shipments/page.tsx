import { LogisticsLayout } from '@/components/logistics-layout'
import { ShipmentsPage } from '@/components/logistics-manager/shipments'

export default function ShipmentsRoute() {
  return (
    <LogisticsLayout>
      <ShipmentsPage />
    </LogisticsLayout>
  )
}
