const express = require('express');
const router = express.Router();
const { adminMiddleware } = require('../middleware/auth');
const ADMIN_EMAILS = ['jloodna@gmail.com'];

// Validate admin email
router.post('/verify', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requis.' });
  if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
    return res.status(403).json({ error: "Email non autorisé pour l'accès admin.", redirect: '/access-denied.html' });
  }
  res.json({ authorized: true, message: 'Email autorisé.' });
});

// Dashboard stats
router.get('/stats', adminMiddleware, (req, res) => {
  res.json({
    revenue_today: 285000,
    orders_today: 47,
    new_clients: 12,
    pending_orders: 8,
    revenue_month: 4200000,
    total_products: 2847,
    total_clients: 15432,
    low_stock: 5,
    currency: 'HTG',
    symbol: 'G'
  });
});

// Admin audit log
const auditLogs = [];
router.post('/log', adminMiddleware, (req, res) => {
  const { action, details } = req.body;
  const log = { id: 'log_'+Date.now(), adminEmail: req.admin.email, action, details, ip: req.ip, timestamp: new Date() };
  auditLogs.unshift(log);
  if (auditLogs.length > 500) auditLogs.splice(500);
  res.json({ log });
});

router.get('/logs', adminMiddleware, (req, res) => {
  res.json(auditLogs.slice(0, 100));
});

module.exports = router;
