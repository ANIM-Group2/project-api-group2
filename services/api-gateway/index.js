// require('dotenv').config();
// const express = require('express');
// const cors    = require('cors');
// const jwt     = require('jsonwebtoken');
// const bcrypt  = require('bcrypt');
// const { Pool } = require('pg');
// const https   = require('http');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ── PostgreSQL ────────────────────────────────────────────────
// const pool = new Pool({
//   host:     process.env.DB_HOST,
//   port:     process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   user:     process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
// });

// pool.query('SELECT NOW()', (err, res) => {
//   if (err) console.error('❌ DB connection failed:', err.message);
//   else     console.log('✅ DB connected at', res.rows[0].now);
// });

// // ── Service URLs ──────────────────────────────────────────────
// const SERVICES = {
//   production:   process.env.MS_PRODUCTION_URL   || 'http://localhost:4001',
//   inventory:    process.env.MS_INVENTORY_URL    || 'http://localhost:4002',
//   orders:       process.env.MS_ORDERS_URL       || 'http://localhost:4003',
//   traceability: process.env.MS_TRACEABILITY_URL || 'http://localhost:4004',
// };

// // ── Role → allowed service prefixes ──────────────────────────
// const ROLE_ALLOWED = {
//   operator:  ['production', 'traceability'],
//   logistics: ['inventory', 'traceability', 'orders', 'production'],
//   sales:     ['orders', 'traceability'],
//   admin:     ['production', 'inventory', 'orders', 'traceability'],
// };

// // ── Role → frontend redirect ──────────────────────────────────
// const ROLE_REDIRECT = {
//   operator:  'http://localhost:3001',
//   logistics: 'http://localhost:3002',
//   sales:     'http://localhost:3003',
//   admin:     'http://localhost:3004',
// };

// // ── JWT helpers ───────────────────────────────────────────────
// function verifyToken(token) {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET);
//   } catch {
//     return null;
//   }
// }

// // ── Resolution middleware — verify JWT + check role access ────
// function resolve(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   if (!authHeader || !authHeader.startsWith('Bearer '))
//     return res.status(401).json({ error: 'No token provided' });

//   const decoded = verifyToken(authHeader.split(' ')[1]);
//   if (!decoded)
//     return res.status(401).json({ error: 'Invalid or expired token' });

//   req.user = decoded;

//   // Extract service name from path: /api/production/... → 'production'
//   const parts = req.path.split('/').filter(Boolean); // ['api','production','batches']
//   const service = parts[1]; // 'production'

//   if (!service || !SERVICES[service])
//     return res.status(404).json({ error: `Unknown service: ${service}` });

//   const allowed = ROLE_ALLOWED[decoded.role] || [];
//   if (!allowed.includes(service))
//     return res.status(403).json({
//       error: `Role '${decoded.role}' cannot access /${service}`,
//     });

//   req.targetService = service;
//   req.targetUrl     = SERVICES[service];
//   next();
// }

// // ── Generic proxy function ────────────────────────────────────
// async function proxyRequest(req, res) {
//   // Strip only /api prefix: /api/production/batches → /production/batches
//   // The service name stays because each microservice mounts routes with it:
//   // ms-production: app.use('/production/orders', ...)
//   // ms-inventory:  app.use('/stock', ...)  ← exception, handled below
//   const withoutApi  = req.path.replace(/^\/api/, '');          // /production/batches
//   const parts2      = withoutApi.split('/').filter(Boolean);   // ['production','batches']
//   const serviceName = parts2[0];                               // 'production'

//   // ms-inventory mounts at /stock not /inventory
//   // ms-orders mounts at /orders, /shipments, /customers, /stats (not /orders/...)
//   // ms-production mounts at /production/...
//   // ms-traceability mounts at /traceability/...
//   const STRIP_SERVICE = {
//     inventory:    true,
//     orders:       true,
//     traceability: false,
//     production:   false,
//   }

//   const targetPath = STRIP_SERVICE[serviceName]
//     ? '/' + parts2.slice(1).join('/')   // strip service name
//     : withoutApi                         // keep as-is
//   const query      = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
//   const url        = `${req.targetUrl}${targetPath}${query}`;

//   try {
//     const fetchRes = await fetch(url, {
//       method:  req.method,
//       headers: {
//         'Content-Type':  'application/json',
//         'Authorization': req.headers['authorization'],
//         'x-user-id':     String(req.user.userId),
//         'x-user-role':   req.user.role,
//         'x-user-name':   `${req.user.firstName} ${req.user.lastName}`,
//       },
//       body: ['GET', 'HEAD', 'DELETE'].includes(req.method)
//         ? undefined
//         : JSON.stringify(req.body),
//     });

//     const contentType = fetchRes.headers.get('content-type') || '';
//     const data = contentType.includes('application/json')
//       ? await fetchRes.json()
//       : await fetchRes.text();

//     res.status(fetchRes.status).json(data);
//   } catch (err) {
//     console.error(`❌ Proxy error → ${url}:`, err.message);
//     res.status(502).json({ error: `Service unavailable: ${req.targetService}` });
//   }
// }

// // ── Public routes — no auth ───────────────────────────────────
// app.get('/health', (req, res) => res.json({
//   status: 'UP',
//   service: 'api-gateway',
//   services: SERVICES,
// }));

// // POST /auth/login
// app.post('/auth/login', async (req, res) => {
//   const { email, password } = req.body;
//   console.log('🔐 Login attempt:', email);

//   try {
//     const result = await pool.query(
//       `SELECT u.*, r.role_name
//        FROM "user" u
//        JOIN role r ON u.role_id = r.role_id
//        WHERE u.email = $1 AND u.status = 'active'`,
//       [email]
//     );

//     const user = result.rows[0];
//     if (!user) return res.status(401).json({ error: 'Invalid credentials' });

//     const valid = await bcrypt.compare(password, user.password_hash);
//     if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

//     const token = jwt.sign(
//       {
//         userId:    user.user_id,
//         email:     user.email,
//         role:      user.role_name,
//         firstName: user.first_name,
//         lastName:  user.last_name,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
//     );

//     console.log('🎉 Login success:', user.role_name, '→', ROLE_REDIRECT[user.role_name]);

//     res.json({
//       token,
//       role:       user.role_name,
//       firstName:  user.first_name,
//       lastName:   user.last_name,
//       redirectTo: ROLE_REDIRECT[user.role_name],
//     });
//   } catch (err) {
//     console.error('💥 Login error:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // GET /auth/verify
// app.get('/auth/verify', (req, res) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'No token' });

//   const decoded = verifyToken(token);
//   if (!decoded) return res.status(401).json({ valid: false, error: 'Invalid token' });

//   res.json({ valid: true, user: decoded });
// });

// // ── Proxy all /api/* routes ───────────────────────────────────
// app.all('/api/*', resolve, proxyRequest);

// // ── Start ─────────────────────────────────────────────────────
// app.listen(process.env.PORT || 4000, () => {
//   console.log(`🚀 API Gateway running on port ${process.env.PORT || 4000}`);
//   console.log('   Proxying to:');
//   Object.entries(SERVICES).forEach(([name, url]) =>
//     console.log(`   /api/${name}/* → ${url}`)
//   );
// });




require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const { Pool } = require('pg');
const https   = require('http');

const app = express();
app.use(cors());
app.use(express.json());

// ── PostgreSQL ────────────────────────────────────────────────
const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('❌ DB connection failed:', err.message);
  else     console.log('✅ DB connected at', res.rows[0].now);
});

// ── Service URLs ──────────────────────────────────────────────
const SERVICES = {
  production:   process.env.MS_PRODUCTION_URL   || 'http://localhost:4001',
  inventory:    process.env.MS_INVENTORY_URL    || 'http://localhost:4002',
  orders:       process.env.MS_ORDERS_URL       || 'http://localhost:4003',
  traceability: process.env.MS_TRACEABILITY_URL || 'http://localhost:4004',
  agent:        process.env.MS_AGENT_URL        || 'http://localhost:5000',
};

// ── Role → allowed service prefixes ──────────────────────────
const ROLE_ALLOWED = {
  operator:  ['production', 'traceability'],
  logistics: ['inventory', 'traceability', 'orders', 'production'],
  sales:     ['orders', 'traceability'],
  admin:     ['production', 'inventory', 'orders', 'traceability', 'agent'],
};

// ── Role → frontend redirect ──────────────────────────────────
const ROLE_REDIRECT = {
  operator:  'http://localhost:3001',
  logistics: 'http://localhost:3002',
  sales:     'http://localhost:3003',
  admin:     'http://localhost:3004',
};

// ── JWT helpers ───────────────────────────────────────────────
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// ── Resolution middleware — verify JWT + check role access ────
function resolve(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' });

  const decoded = verifyToken(authHeader.split(' ')[1]);
  if (!decoded)
    return res.status(401).json({ error: 'Invalid or expired token' });

  req.user = decoded;

  // Extract service name from path: /api/production/... → 'production'
  const parts = req.path.split('/').filter(Boolean); // ['api','production','batches']
  const service = parts[1]; // 'production'

  if (!service || !SERVICES[service])
    return res.status(404).json({ error: `Unknown service: ${service}` });

  const allowed = ROLE_ALLOWED[decoded.role] || [];
  if (!allowed.includes(service))
    return res.status(403).json({
      error: `Role '${decoded.role}' cannot access /${service}`,
    });

  req.targetService = service;
  req.targetUrl     = SERVICES[service];
  next();
}

// ── Generic proxy function ────────────────────────────────────
async function proxyRequest(req, res) {
  // Strip only /api prefix: /api/production/batches → /production/batches
  // The service name stays because each microservice mounts routes with it:
  // ms-production: app.use('/production/orders', ...)
  // ms-inventory:  app.use('/stock', ...)  ← exception, handled below
  const withoutApi  = req.path.replace(/^\/api/, '');          // /production/batches
  const parts2      = withoutApi.split('/').filter(Boolean);   // ['production','batches']
  const serviceName = parts2[0];                               // 'production'

  // ms-inventory mounts at /stock not /inventory
  // ms-orders mounts at /orders, /shipments, /customers, /stats (not /orders/...)
  // ms-production mounts at /production/...
  // ms-traceability mounts at /traceability/...
  const STRIP_SERVICE = {
    inventory:    true,
    orders:       true,
    traceability: false,
    production:   false,
    agent:        true,   // /api/agent/chat → /chat
  }

  const targetPath = STRIP_SERVICE[serviceName]
    ? '/' + parts2.slice(1).join('/')   // strip service name
    : withoutApi                         // keep as-is
  const query      = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const url        = `${req.targetUrl}${targetPath}${query}`;

  try {
    const fetchRes = await fetch(url, {
      method:  req.method,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': req.headers['authorization'],
        'x-user-id':     String(req.user.userId),
        'x-user-role':   req.user.role,
        'x-user-name':   `${req.user.firstName} ${req.user.lastName}`,
      },
      body: ['GET', 'HEAD', 'DELETE'].includes(req.method)
        ? undefined
        : JSON.stringify(req.body),
    });

    const contentType = fetchRes.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await fetchRes.json()
      : await fetchRes.text();

    res.status(fetchRes.status).json(data);
  } catch (err) {
    console.error(`❌ Proxy error → ${url}:`, err.message);
    res.status(502).json({ error: `Service unavailable: ${req.targetService}` });
  }
}

// ── Public routes — no auth ───────────────────────────────────
app.get('/health', (req, res) => res.json({
  status: 'UP',
  service: 'api-gateway',
  services: SERVICES,
}));

// POST /auth/login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 Login attempt:', email);

  try {
    const result = await pool.query(
      `SELECT u.*, r.role_name
       FROM "user" u
       JOIN role r ON u.role_id = r.role_id
       WHERE u.email = $1 AND u.status = 'active'`,
      [email]
    );

    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      {
        userId:    user.user_id,
        email:     user.email,
        role:      user.role_name,
        firstName: user.first_name,
        lastName:  user.last_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    console.log('🎉 Login success:', user.role_name, '→', ROLE_REDIRECT[user.role_name]);

    res.json({
      token,
      role:       user.role_name,
      firstName:  user.first_name,
      lastName:   user.last_name,
      redirectTo: ROLE_REDIRECT[user.role_name],
    });
  } catch (err) {
    console.error('💥 Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /auth/verify
app.get('/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ valid: false, error: 'Invalid token' });

  res.json({ valid: true, user: decoded });
});

// ── Proxy all /api/* routes ───────────────────────────────────
app.all('/api/*', resolve, proxyRequest);

// ── Start ─────────────────────────────────────────────────────
app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 API Gateway running on port ${process.env.PORT || 4000}`);
  console.log('   Proxying to:');
  Object.entries(SERVICES).forEach(([name, url]) =>
    console.log(`   /api/${name}/* → ${url}`)
  );
});