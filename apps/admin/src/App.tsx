import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from './components/AdminLayout'
import Overview from './pages/Overview'
import Production from './pages/Production'
import Incidents from './pages/Incidents'
import Sites from './pages/Sites'
import Reports from './pages/Reports'
import ProfileSettings from './pages/ProfileSettings'

const LOGIN_URL = 'http://localhost:3000'

function App() {
  const token = localStorage.getItem('aeronexis_token')
  const role  = localStorage.getItem('aeronexis_role')

  if (!token || role !== 'admin') {
    window.location.href = LOGIN_URL
    return null
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route element={<AdminLayout />}>
          <Route path="/overview"   element={<Overview />} />
          <Route path="/production" element={<Production />} />
          <Route path="/incidents"  element={<Incidents />} />
          <Route path="/sites"      element={<Sites />} />
          <Route path="/reports"    element={<Reports />} />
          <Route path="/profile"    element={<ProfileSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App