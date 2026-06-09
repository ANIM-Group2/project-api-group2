// App.jsx
import { useState } from 'react'
import axios from 'axios'
import './App.css'

const ACCOUNTS = [
  { email: 'karim@aeronexis.com',    role: 'Operator',  color: '#3b82f6' },
  { email: 'claire@aeronexis.com',   role: 'Logistics', color: '#22c55e' },
  { email: 'sophie@aeronexis.com',   role: 'Sales',     color: '#e8a020' },
  { email: 'philippe@aeronexis.com', role: 'Admin',     color: '#1b2b4b' },
]

export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await axios.post('http://localhost:4000/auth/login', { email, password })
      localStorage.setItem('aeronexis_token', data.token)
      localStorage.setItem('aeronexis_role',  data.role)
      localStorage.setItem('aeronexis_user',  JSON.stringify({
        firstName: data.firstName,
        lastName:  data.lastName,
        role:      data.role,
      }))
      window.location.href = `${data.redirectTo}?token=${data.token}&role=${data.role}`
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fillAccount = (acc) => {
    setEmail(acc.email)
    setPassword('password')
  }

  return (
    <div className="login">
      {/* LEFT PANEL — branding */}
      <aside className="brand">
        <div className="brand-mesh" aria-hidden="true" />
        <div className="brand-inner">
          <div className="brand-top">
            <div className="logo-row">
              <div className="logo-mark" aria-hidden="true">✈</div>
              <div className="logo-text">
                <span className="logo-name">AERONEXIS</span>
                <span className="logo-sub">DYNAMICS</span>
              </div>
            </div>

            <h1 className="tagline">Precision Beyond Limits</h1>
            <p className="descriptor">
              The integrated ERP suite engineered for aerospace manufacturing —
              unifying production, inventory, and intelligence in one command platform.
            </p>

            <ul className="features">
              <li className="feature">
                <span className="feature-dot" aria-hidden="true" />
                Production Tracking
              </li>
              <li className="feature">
                <span className="feature-dot" aria-hidden="true" />
                Inventory Management
              </li>
              <li className="feature">
                <span className="feature-dot" aria-hidden="true" />
                Sales Analytics
              </li>
              <li className="feature">
                <span className="feature-dot" aria-hidden="true" />
                AI Assistant ARIA
              </li>
            </ul>
          </div>

          <div className="brand-bottom">
            <div className="brand-rule" />
            <span className="brand-badge">Secure ERP Platform — v2.0</span>
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL — form */}
      <main className="panel">
        <div className="card">
          <header className="card-head">
            <h2 className="welcome">Welcome back</h2>
            <p className="subtitle">Sign in to your workspace</p>
          </header>

          {error && (
            <div className="error" role="alert">
              <span className="error-icon" aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form className="form" onSubmit={handleLogin}>
            <div className="field">
              <label className="label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@aeronexis.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button className="submit" type="submit" disabled={loading}>
              {loading ? (
                <svg className="spinner" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <circle className="spinner-track" cx="12" cy="12" r="10" fill="none" strokeWidth="3" />
                  <path className="spinner-head" d="M12 2a10 10 0 0 1 10 10" fill="none" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* QUICK-ACCESS ACCOUNTS */}
          <div className="quick">
            <div className="divider"><span>Quick Access</span></div>

            <div className="accounts">
              {ACCOUNTS.map((acc) => (
                <button
                  type="button"
                  key={acc.email}
                  className={`account ${acc.role === 'Admin' ? 'account-admin' : ''}`}
                  onClick={() => fillAccount(acc)}
                >
                  <span className="avatar" style={{ background: acc.color }}>
                    {acc.role.charAt(0)}
                  </span>
                  <span className="account-info">
                    <span className="account-role">{acc.role}</span>
                    <span className="account-email">{acc.email}</span>
                  </span>
                  <span className="account-arrow" aria-hidden="true">→</span>
                </button>
              ))}
            </div>

            <p className="hint">Click any card to autofill · password: password</p>
          </div>
        </div>
      </main>
    </div>
  )
}
