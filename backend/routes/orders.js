const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const orders = [
  { id:'JL-002341', userId:'u_1', customer:'Marie Jean', email:'marie@email.com', items:[{productId:'p1',name:'iPhone 15 Pro',price:45000,qty:1}], subtotal:45000, shipping:800, total:45800, paymentMethod:'cshdireck', status:'pending', deliveryAddress:{city:'Pétion-Ville',address:'Rue A'},createdAt: new Date(Date.now()-7200000) },
  { id:'JL-002340', userId:'u_2', customer:'Pierre Dupont', items:[{productId:'p4',name:'Robe de Soirée',price:8500,qty:2}], subtotal:17000, shipping:800, total:17800, paymentMethod:'natcash', status:'shipped', createdAt: new Date(Date.now()-86400000) },
  { id:'JL-002339', userId:'u_3', customer:'Sophie Louis', items:[{productId:'p5',name:'Nike Air Max',price:8500,qty:1}], subtotal:8500, shipping:0, total:8500, paymentMethod:'visa', status:'delivered', createdAt: new Date(Date.now()-172800000) },
];

const STATUS_FLOW = ['pending','processing','shipped','delivered','cancelled'];

router.get('/', authMiddleware, (req, res) => {
  const userOrders = req.user.role === 'admin' ? orders : orders.filter(o => o.userId === req.user.id);
  res.json(userOrders);
});

router.get('/:id', authMiddleware, (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Commande non trouvée.' });
  if (req.user.role !== 'admin' && order.userId !== req.user.id) return res.status(403).json({ error: 'Accès refusé.' });
  res.json(order);
});

router.post('/', authMiddleware, (req, res) => {
  const { items, deliveryAddress, paymentMethod, shippingOption } = req.body;
  if (!items?.length || !deliveryAddress || !paymentMethod) return res.status(400).json({ error: 'Données de commande incomplètes.' });
  const subtotal = items.reduce((s,i) => s + i.price * i.qty, 0);
  const shipping = shippingOption === 'express' ? 2000 : subtotal >= 15000 ? 0 : 800;
  const order = {
    id: 'JL-' + String(Date.now()).slice(-6),
    userId: req.user.id,
    customer: req.user.name,
    email: req.user.email,
    items, subtotal, shipping, total: subtotal + shipping,
    paymentMethod, deliveryAddress,
    status: 'pending',
    createdAt: new Date()
  };
  orders.unshift(order);
  res.status(201).json({ order, message: 'Commande créée avec succès!' });
});

router.patch('/:id/status', adminMiddleware, (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Commande non trouvée.' });
  const { status } = req.body;
  if (!STATUS_FLOW.includes(status)) return res.status(400).json({ error: 'Statut invalide.' });
  order.status = status;
  order.updatedAt = new Date();
  res.json({ order, message: 'Statut mis à jour.' });
});

module.exports = router;
