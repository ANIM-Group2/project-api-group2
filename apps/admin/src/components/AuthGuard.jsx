import { useEffect, useState } from 'react'

const LOGIN_URL = 'http://localhost:3000'
const API_URL   = 'http://localhost:4000'
const APP_ROLE  = 'admin' // ← change per app

export default function AuthGuard({ children }) {
  const [status, setStatus] = useState('checking') // 'checking' | 'allowed' | 'denied'

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('aeronexis_token')
      const role  = localStorage.getItem('aeronexis_role')

      if (!token || role !== APP_ROLE) {
        window.location.href = LOGIN_URL
        return
      }

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