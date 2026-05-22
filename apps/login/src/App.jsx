import { useState } from 'react'
import axios from 'axios'
import './App.css'

export default function App() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

 const handleLogin = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    const { data } = await axios.post('http://localhost:4000/auth/login', {
      email,
      password,
    })

    // Store in localStorage only (cookies don't work cross-port)
    localStorage.setItem('aeronexis_token', data.token)
    localStorage.setItem('aeronexis_role', data.role)
    localStorage.setItem('aeronexis_user', JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    }))

    // Redirect to the right app
    // window.location.href = data.redirectTo
    window.location.href = `${data.redirectTo}?token=${data.token}&role=${data.role}`

  } catch (err) {
    setError(err.response?.data?.error || 'Login failed')
  } finally {
    setLoading(false)
  }
}

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>✈</div>
          <div>
            <div style={styles.brand}>AERONEXIS</div>
            <div style={styles.sub}>DYNAMICS</div>
          </div>
        </div>

        <h1 style={styles.title}>Sign in</h1>
        <p style={styles.desc}>Access your workspace</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@aeronexis.com"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={styles.hints}>
          <div style={styles.hintsTitle}>Test accounts</div>
          {[
            { email: 'karim@aeronexis.com',    role: 'Operator' },
            { email: 'claire@aeronexis.com',   role: 'Logistics' },
            { email: 'sophie@aeronexis.com',   role: 'Sales' },
            { email: 'philippe@aeronexis.com', role: 'Admin' },
          ].map(u => (
            <div
              key={u.email}
              style={styles.hint}
              onClick={() => { setEmail(u.email); setPassword('password') }}
            >
              <span style={styles.hintRole}>{u.role}</span>
              <span style={styles.hintEmail}>{u.email}</span>
            </div>
          ))}
          <div style={styles.hintNote}>Click any account to fill in · password: password</div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  bg: { minHeight:'100vh', background:'#0a0b0d', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'system-ui, sans-serif' },
  card: { background:'#111318', border:'1px solid #1f2430', borderRadius:12, padding:'40px 36px', width:420, maxWidth:'90vw' },
  logo: { display:'flex', alignItems:'center', gap:12, marginBottom:32 },
  logoIcon: { width:40, height:40, background:'#e8a020', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 },
  brand: { fontSize:14, fontWeight:700, letterSpacing:'.1em', color:'#e8a020' },
  sub: { fontSize:10, color:'#4a5060', letterSpacing:'.12em' },
  title: { fontSize:24, fontWeight:800, color:'#e8eaf0', margin:'0 0 4px' },
  desc: { fontSize:13, color:'#4a5060', margin:'0 0 28px' },
  form: { display:'flex', flexDirection:'column', gap:16 },
  field: { display:'flex', flexDirection:'column', gap:6 },
  label: { fontSize:11, fontWeight:700, color:'#4a5060', letterSpacing:'.1em', textTransform:'uppercase' },
  input: { background:'#181c23', border:'1px solid #2a3040', borderRadius:6, color:'#e8eaf0', fontSize:13, padding:'10px 14px', outline:'none' },
  error: { background:'rgba(232,64,64,.1)', border:'1px solid rgba(232,64,64,.3)', color:'#e84040', borderRadius:6, padding:'10px 14px', fontSize:12 },
  btn: { background:'#e8a020', color:'#000', border:'none', borderRadius:6, padding:'12px', fontSize:13, fontWeight:700, cursor:'pointer', marginTop:4 },
  hints: { marginTop:28, borderTop:'1px solid #1f2430', paddingTop:20 },
  hintsTitle: { fontSize:10, fontWeight:700, color:'#4a5060', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 },
  hint: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 10px', borderRadius:6, cursor:'pointer', marginBottom:4, background:'#181c23', border:'1px solid #1f2430' },
  hintRole: { fontSize:11, fontWeight:700, color:'#e8a020' },
  hintEmail: { fontSize:11, color:'#4a5060' },
  hintNote: { fontSize:10, color:'#4a5060', marginTop:8, textAlign:'center' },
}