import { useEffect, useState, ReactNode } from 'react'

const LOGIN_URL = 'http://localhost:3000'
const API_URL   = 'http://localhost:4000'
const APP_ROLE  = 'sales'

export default function AuthGuard({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    const verify = async () => {
      // Step 1: Read token from URL if coming from login redirect
      const params = new URLSearchParams(window.location.search)
      const urlToken = params.get('token')
      const urlRole  = params.get('role')

      if (urlToken && urlRole) {
        localStorage.setItem('aeronexis_token', urlToken)
        localStorage.setItem('aeronexis_role', urlRole)
        window.history.replaceState({}, '', window.location.pathname)
      }

      // Step 2: Read from localStorage
      const token = localStorage.getItem('aeronexis_token')
      const role  = localStorage.getItem('aeronexis_role')

      // Step 3: Check role
      if (!token || role !== APP_ROLE) {
        window.location.href = LOGIN_URL
        return
      }

      // Step 4: Verify with API
      try {
        const res = await fetch(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()

        if (data.valid) {
          setStatus('allowed')
        } else {
          localStorage.clear()
          window.location.href = LOGIN_URL
        }
      } catch {
        // API down — still allow if token + role present
        setStatus('allowed')
      }
    }

    verify()
  }, [])

  if (status === 'checking') return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0b0d',
      color: '#e8a020',
      fontFamily: 'monospace',
      fontSize: 13,
      letterSpacing: '.1em'
    }}>
      VERIFYING ACCESS...
    </div>
  )

  return children
}