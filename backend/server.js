/**
 * Jloodna | Global Trading — Backend Server
 * Node.js + Express
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── SECURITY MIDDLEWARE ─────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' }
});
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: { error: 'Trop de requêtes. Ralentissez.' }
});

app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', loginLimiter);
app.use('/api/', apiLimiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'jloodna_secret_2025'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'jloodna_session_secret_2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24h
    sameSite: 'strict'
  }
}));

// Static files
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// ── ROUTES ──────────────────────────────────────────────────
const authRoutes     = require('./routes/auth');
const productRoutes  = require('./routes/products');
const orderRoutes    = require('./routes/orders');
const userRoutes     = require('./routes/users');
const paymentRoutes  = require('./routes/payments');
const notifRoutes    = require('./routes/notifications');
const adminRoutes    = require('./routes/admin');
const searchRoutes   = require('./routes/search');

app.use('/api/auth',         authRoutes);
app.use('/api/products',     productRoutes);
app.use('/api/orders',       orderRoutes);
app.use('/api/users',        userRoutes);
app.use('/api/payments',     paymentRoutes);
app.use('/api/notifications',notifRoutes);
app.use('/api/admin',        adminRoutes);
app.use('/api/search',       searchRoutes);

// ── HEALTH CHECK ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date(), version: '1.0.0', currency: 'HTG' });
});

// ── SERVE FRONTEND ───────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});
app.get('/admin', (req, res) => {
  res.redirect('/admin/pages/login.html');
});

// ── 404 HANDLER ─────────────────────────────────────────────
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Route non trouvée' });
  }
  res.sendFile(path.join(__dirname, '../frontend/pages/404.html'));
});

// ── ERROR HANDLER ────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === 'production' ? 'Erreur interne du serveur' : err.message
  });
});

// ── START ────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Jloodna Server running on http://localhost:${PORT}`);
    console.log(`📦 Frontend: http://localhost:${PORT}/frontend/pages/index.html`);
    console.log(`🔐 Admin:    http://localhost:${PORT}/admin/pages/dashboard.html`);
    console.log(`💰 Devise:   HTG (Gourdes Haïtiennes)`);
    console.log(`🌍 Env:      ${process.env.NODE_ENV || 'development'}\n`);
  });
}

module.exports = app;
