import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from './components/AdminLayout'
import Overview from './pages/Overview'
import Production from './pages/Production'
import Incidents from './pages/Incidents'
import Sites from './pages/Sites'
import Reports from './pages/Reports'
import ProfileSettings from './pages/ProfileSettings'
import NotFound from './pages/NotFound'
import AriaHistory from './pages/AriaHistory'
import Logs from './pages/Logs'
import Unauthorized from './pages/Unauthorized'

const LOGIN_URL = 'http://localhost:3000'

function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

function App() {
  const token = localStorage.getItem('aeronexis_token')
  const role  = localStorage.getItem('aeronexis_role')

  if (!token || role !== 'admin' || !isTokenValid(token)) {
    localStorage.removeItem('aeronexis_token')
    localStorage.removeItem('aeronexis_role')
    localStorage.removeItem('aeronexis_user')
    window.location.href = LOGIN_URL
    return null
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/403" element={<Unauthorized />} />
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route element={<AdminLayout />}>
          <Route path="/overview"   element={<Overview />} />
          <Route path="/production" element={<Production />} />
          <Route path="/incidents"  element={<Incidents />} />
          <Route path="/sites"      element={<Sites />} />
          <Route path="/reports"    element={<Reports />} />
          <Route path="/profile"    element={<ProfileSettings />} />
          <Route path="/aria-history" element={<AriaHistory />} />
          <Route path="/logs"         element={<Logs />} />
          <Route path="*"           element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App