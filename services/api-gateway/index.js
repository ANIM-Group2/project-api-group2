const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { Pool } = require('pg')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

// Test DB connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ DB connection failed:', err.message)
  } else {
    console.log('✅ DB connected at', res.rows[0].now)
  }
})

// Role → app URL mapping
const ROLE_REDIRECT = {
  operator:  'http://localhost:3001',
  logistics: 'http://localhost:3002',
  sales:     'http://localhost:3003',
  admin:     'http://localhost:3004',
}

// POST /auth/login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body

  console.log('🔐 Login attempt:', email)

  try {
    const result = await pool.query(
      `SELECT u.*, r.role_name 
       FROM "user" u 
       JOIN role r ON u.role_id = r.role_id 
       WHERE u.email = $1 AND u.status = 'active'`,
      [email]
    )

    const user = result.rows[0]
    console.log('👤 User found:', user ? `${user.first_name} ${user.last_name} (${user.role_name})` : 'NOT FOUND')

    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    console.log('🔑 Hash in DB:', user.password_hash)

    const valid = await bcrypt.compare(password, user.password_hash)
    console.log('✅ Password valid:', valid)

    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      {
        userId:    user.user_id,
        email:     user.email,
        role:      user.role_name,
        firstName: user.first_name,
        lastName:  user.last_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    console.log('🎉 Login success, redirecting to:', ROLE_REDIRECT[user.role_name])

    res.json({
      token,
      role:       user.role_name,
      firstName:  user.first_name,
      lastName:   user.last_name,
      redirectTo: ROLE_REDIRECT[user.role_name],
    })
  } catch (err) {
    console.error('💥 Error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /auth/verify — verify token
app.get('/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ valid: true, user: decoded })
  } catch {
    res.status(401).json({ valid: false, error: 'Invalid token' })
  }
})

app.listen(process.env.PORT, () => {
  console.log(`🚀 Auth service running on port ${process.env.PORT}`)
})