import { LogisticsLayout } from '@/components/logistics-layout'
import { ReservationsPage } from '@/components/logistics-manager/reservations'

export default function ReservationsRoute() {
  return (
    <LogisticsLayout>
      <ReservationsPage />
    </LogisticsLayout>
  )
}
