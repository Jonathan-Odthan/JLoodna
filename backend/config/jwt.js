const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'jloodna_jwt_secret_2025_HTG';
const ADMIN_SECRET = process.env.ADMIN_JWT_SECRET || 'jloodna_admin_jwt_2025';

module.exports = {
  sign(payload, expiresIn = '24h') {
    return jwt.sign(payload, SECRET, { expiresIn });
  },
  signAdmin(payload) {
    return jwt.sign(payload, ADMIN_SECRET, { expiresIn: '8h' });
  },
  verify(token) { return jwt.verify(token, SECRET); },
  verifyAdmin(token) { return jwt.verify(token, ADMIN_SECRET); }
};
