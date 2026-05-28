const { verifyToken } = require('../utils/jwt.util');

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader)
    return res.status(401).json({ error: 'No authorization header' });

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded)
    return res.status(401).json({ error: 'Invalid or expired token' });

  req.user = decoded;
  next();
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ error: 'Not authenticated' });

    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: 'Forbidden — insufficient role' });

    next();
  };
}

module.exports = { authenticate, authorize };