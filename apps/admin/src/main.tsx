import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Pick up token + role from URL params (set by login app on redirect)
const params = new URLSearchParams(window.location.search)
const token  = params.get('token')
const role   = params.get('role')

if (token) {
  localStorage.setItem('aeronexis_token', token)
  localStorage.setItem('aeronexis_role',  role ?? '')

  // Decode JWT payload to get user info (no verification needed here)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    localStorage.setItem('aeronexis_user', JSON.stringify({
      firstName: payload.firstName,
      lastName:  payload.lastName,
      role:      payload.role,
      userId:    payload.userId,
    }))
  } catch { /* ignore decode errors */ }

  // Clean URL so token doesn't stay visible
  window.history.replaceState({}, '', '/overview')
}

// Apply dark mode
document.documentElement.classList.add('dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)