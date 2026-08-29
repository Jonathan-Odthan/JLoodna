const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

router.put('/me', authMiddleware, (req, res) => {
  const { name, phone } = req.body;
  res.json({ message: 'Profil mis à jour.', user: { ...req.user, name, phone } });
});

router.get('/', adminMiddleware, (req, res) => {
  res.json([
    { id:'u_1', name:'Marie Jean', email:'marie.jean@email.com', role:'customer', orders:12, totalSpent:245000, createdAt:'2024-08-12' },
    { id:'u_2', name:'Pierre Dupont', email:'pierre.dupont@gmail.com', role:'customer', orders:5, totalSpent:89000, createdAt:'2024-10-05' },
    { id:'u_3', name:'Sophie Louis', email:'sophie.louis@yahoo.com', role:'customer', orders:23, totalSpent:512000, createdAt:'2024-06-20' },
  ]);
});

module.exports = router;
