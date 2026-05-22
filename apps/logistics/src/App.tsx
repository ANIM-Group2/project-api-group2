
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { LogisticsLayout } from '@/components/LogisticsLayout'
import Dashboard from '@/pages/Dashboard'
import Stock from '@/pages/Stock'
import Reservations from '@/pages/Reservations'
import Shipments from '@/pages/Shipments'
import Alerts from '@/pages/Alerts'
import AuthGuard from '@/components/AuthGuard'




function AppRoutes() {
  return (
    
      <LogisticsLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </LogisticsLayout>
   
  )
}





export default function App() {
  return (
    <AuthGuard>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    </AuthGuard>
  )
}