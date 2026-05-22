import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthGuard } from './components/AuthGuard'
import { OperatorLayout } from './components/OperatorLayout'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Batches from './pages/Batches'
import Incidents from './pages/Incidents'
import History from './pages/History'

function App() {
  return (
    <AuthGuard>
      <OperatorLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </OperatorLayout>
    </AuthGuard>
  )
}

export default App
