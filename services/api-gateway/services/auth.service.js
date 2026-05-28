const { hashPassword, comparePassword } = require('../utils/bcrypt.util');
const { generateToken } = require('../utils/jwt.util');
const User = require('../models/user.model');

const ROLE_REDIRECT = {
  operator:  'http://localhost:3001',
  logistics: 'http://localhost:3002',
  sales:     'http://localhost:3003',
  admin:     'http://localhost:3004',
};

async function login(email, password) {
  const user = await User.findOne({ where: { email, status: 'active' } });
  if (!user) throw new Error('Invalid credentials');

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) throw new Error('Invalid credentials');

  const token = generateToken({
    userId:    user.user_id,
    email:     user.email,
    role:      user.role,
    firstName: user.first_name,
    lastName:  user.last_name,
    siteId:    user.site_id,
  });

  return {
    token,
    role:       user.role,
    firstName:  user.first_name,
    lastName:   user.last_name,
    redirectTo: ROLE_REDIRECT[user.role],
  };
}

async function verify(token) {
  const { verifyToken } = require('../utils/jwt.util');
  const decoded = verifyToken(token);
  if (!decoded) throw new Error('Invalid or expired token');
  return decoded;
}

module.exports = { login, verify };