import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthGuard } from './components/AuthGuard'
import { OperatorLayout } from './components/OperatorLayout'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Batches from './pages/Batches'
import Incidents from './pages/Incidents'
import History from './pages/History'
import ProfileSettings from './pages/ProfileSettings'

function App() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <OperatorLayout>
          <Routes>
            <Route path="/"           element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/orders"     element={<Orders />} />
            <Route path="/batches"    element={<Batches />} />
            <Route path="/incidents"  element={<Incidents />} />
            <Route path="/history"    element={<History />} />
            <Route path="/profile"    element={<ProfileSettings />} />
          </Routes>
        </OperatorLayout>
      </AuthGuard>
    </BrowserRouter>
  )
}

export default App