const jwtConfig = require('../config/jwt');
const ADMIN_EMAILS = ['jloodna@gmail.com', 'odthanempire@gmail.com'];

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.jl_token;
  if (!token) return res.status(401).json({ error: 'Non authentifié. Connectez-vous.' });
  try {
    req.user = jwtConfig.verify(token);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Session expirée. Reconnectez-vous.' });
  }
}

function adminMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.jl_admin_token;
  if (!token) return res.status(403).json({ error: 'Accès refusé.' });
  try {
    const decoded = jwtConfig.verifyAdmin(token);
    if (!ADMIN_EMAILS.includes(decoded.email?.toLowerCase())) {
      return res.status(403).json({ error: 'Email non autorisé pour l\'accès admin.' });
    }
    req.admin = decoded;
    next();
  } catch (e) {
    res.status(403).json({ error: 'Accès admin refusé.' });
  }
}

module.exports = { authMiddleware, adminMiddleware };
