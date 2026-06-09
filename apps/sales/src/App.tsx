import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SalesLayout } from '@/components/SalesLayout'
import Orders from '@/pages/Orders'
import Customers from '@/pages/Customers'
import Analytics from '@/pages/Analytics'
import Approvals from '@/pages/Approvals'
import ProfileSettings from '@/pages/ProfileSettings'
import NotFound from '@/pages/NotFound'
import Unauthorized from '@/pages/Unauthorized'

const LOGIN_URL = 'http://localhost:3000'
const APP_ROLE  = 'sales'

function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch { return false }
}

export default function App() {
  const token = localStorage.getItem('aeronexis_token')
  const role  = localStorage.getItem('aeronexis_role')

  if (!token || !isTokenValid(token)) {
    localStorage.removeItem('aeronexis_token')
    localStorage.removeItem('aeronexis_role')
    localStorage.removeItem('aeronexis_user')
    window.location.href = LOGIN_URL
    return null
  }

  if (role !== APP_ROLE) {
    return (
      <BrowserRouter>
        <Routes><Route path="*" element={<Unauthorized />} /></Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/orders" replace />} />
        <Route element={<SalesLayout />}>
          <Route path="/orders"    element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/profile"   element={<ProfileSettings />} />
          <Route path="*"          element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}