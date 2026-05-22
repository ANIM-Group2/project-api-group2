import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { SalesLayout } from '@/components/SalesLayout'
import Orders from '@/pages/Orders'
import Customers from '@/pages/Customers'
import Analytics from '@/pages/Analytics'
import Approvals from '@/pages/Approvals'
import AuthGuard from '@/components/AuthGuard'



function AppRoutes() {
  return (
    
      <SalesLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/approvals" element={<Approvals />} />
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