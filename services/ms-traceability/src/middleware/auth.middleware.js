require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'aeronexis_super_secret_key_2026';

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided — please log in' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      userId:    decoded.userId,
      email:     decoded.email,
      role:      decoded.role,
      firstName: decoded.firstName,
      lastName:  decoded.lastName,
    };
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Token expired — please log in again'
      : 'Invalid token';
    return res.status(401).json({ error: message });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ error: 'Not authenticated' });

    if (!roles.includes(req.user.role))
      return res.status(403).json({
        error: `Access denied — role '${req.user.role}' is not allowed here`,
      });

    next();
  };
}

module.exports = { authenticate, authorize };