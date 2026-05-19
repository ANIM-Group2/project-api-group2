import { LogisticsLayout } from '@/components/logistics-layout'
import { StockPage } from '@/components/logistics-manager/stock'

export default function StockRoute() {
  return (
    <LogisticsLayout>
      <StockPage />
    </LogisticsLayout>
  )
}
