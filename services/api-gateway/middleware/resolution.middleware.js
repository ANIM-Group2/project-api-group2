const { verifyToken } = require('../utils/jwt.util');

/**
 * Resolution Controller
 * Verifies JWT token and routes requests to the correct microservice
 * based on path prefix and user role.
 */

const ROLE_ALLOWED_PREFIXES = {
  operator:  ['/api/production', '/api/traceability'],
  logistics: ['/api/inventory', '/api/traceability'],
  sales:     ['/api/orders', '/api/traceability'],
  admin:     ['/api/production', '/api/inventory', '/api/orders', '/api/traceability'],
};

function resolve(req, res, next) {
  // Skip auth routes
  if (req.path.startsWith('/api/auth')) return next();

  const authHeader = req.headers['authorization'];
  if (!authHeader)
    return res.status(401).json({ error: 'No authorization header' });

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded)
    return res.status(401).json({ error: 'Invalid or expired token' });

  req.user = decoded;

  // Check role-based access to this route prefix
  const allowedPrefixes = ROLE_ALLOWED_PREFIXES[decoded.role] || [];
  const isAllowed = allowedPrefixes.some(prefix => req.path.startsWith(prefix));

  // Admin can access everything
  if (decoded.role === 'admin') return next();

  if (!isAllowed)
    return res.status(403).json({ error: `Role '${decoded.role}' cannot access ${req.path}` });

  next();
}

module.exports = { resolve };