import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SalesLayout } from '@/components/SalesLayout'
import Orders from '@/pages/Orders'
import Customers from '@/pages/Customers'
import Analytics from '@/pages/Analytics'
import Approvals from '@/pages/Approvals'
import ProfileSettings from '@/pages/ProfileSettings'
import AuthGuard from '@/components/AuthGuard'

function AppRoutes() {
  return (
    <SalesLayout>
      <Routes>
        <Route path="/"           element={<Navigate to="/orders" replace />} />
        <Route path="/orders"     element={<Orders />} />
        <Route path="/customers"  element={<Customers />} />
        <Route path="/analytics"  element={<Analytics />} />
        <Route path="/approvals"  element={<Approvals />} />
        <Route path="/profile"    element={<ProfileSettings />} />
      </Routes>
    </SalesLayout>
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