const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Demo products data
const products = [
  { id:'p1', name:'iPhone 15 Pro 256GB', slug:'iphone-15-pro', category:'electronics', price:45000, oldPrice:52000, rating:4.9, reviews:234, stock:15, sku:'JL-001234', badge:'sale', featured:true, active:true, images:[], brand:'Apple', weight:0.187, description:'Smartphone Apple premium' },
  { id:'p2', name:'Samsung Galaxy S24 Ultra', slug:'samsung-s24-ultra', category:'electronics', price:52000, rating:4.8, reviews:189, stock:8, sku:'JL-001235', badge:'new', featured:true, active:true, images:[], brand:'Samsung', description:'Flagship Samsung' },
  { id:'p3', name:'MacBook Air M2', slug:'macbook-air-m2', category:'electronics', price:85000, oldPrice:95000, rating:4.9, reviews:312, stock:5, sku:'JL-001236', badge:'hot', featured:true, active:true, images:[], brand:'Apple', description:'Laptop Apple léger' },
  { id:'p4', name:'Robe de Soirée Élégante', slug:'robe-soiree', category:'fashion', price:8500, oldPrice:12000, rating:4.7, reviews:98, stock:22, sku:'JL-001237', badge:'sale', active:true, images:[], description:'Robe élégante' },
  { id:'p5', name:'Chaussures Nike Air Max', slug:'nike-air-max', category:'sports', price:14500, rating:4.8, reviews:156, stock:30, sku:'JL-001238', badge:'new', active:true, images:[], brand:'Nike', description:'Chaussures sport' },
];

// GET all products
router.get('/', (req, res) => {
  let result = products.filter(p => p.active);
  const { cat, q, sort, filter, min, max, page = 1, limit = 20 } = req.query;
  if (cat) result = result.filter(p => p.category === cat);
  if (q) result = result.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  if (filter === 'promo') result = result.filter(p => p.oldPrice);
  if (filter === 'new') result = result.filter(p => p.badge === 'new');
  if (filter === 'featured') result = result.filter(p => p.featured);
  if (min) result = result.filter(p => p.price >= parseInt(min));
  if (max) result = result.filter(p => p.price <= parseInt(max));
  if (sort === 'price-asc') result.sort((a,b) => a.price - b.price);
  else if (sort === 'price-desc') result.sort((a,b) => b.price - a.price);
  else if (sort === 'rating') result.sort((a,b) => b.rating - a.rating);
  const total = result.length;
  const start = (parseInt(page) - 1) * parseInt(limit);
  result = result.slice(start, start + parseInt(limit));
  res.json({ products: result, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

// GET single product
router.get('/:id', (req, res) => {
  const p = products.find(x => x.id === req.params.id || x.slug === req.params.id);
  if (!p) return res.status(404).json({ error: 'Produit non trouvé.' });
  res.json(p);
});

// Admin: CREATE
router.post('/', adminMiddleware, (req, res) => {
  const { name, category, price, stock, sku } = req.body;
  if (!name || !category || !price) return res.status(400).json({ error: 'Champs obligatoires manquants.' });
  const product = { id: 'p_' + Date.now(), ...req.body, slug: name.toLowerCase().replace(/\s+/g,'-'), active: true, createdAt: new Date() };
  products.push(product);
  res.status(201).json(product);
});

// Admin: UPDATE
router.put('/:id', adminMiddleware, (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Produit non trouvé.' });
  products[idx] = { ...products[idx], ...req.body, updatedAt: new Date() };
  res.json(products[idx]);
});

// Admin: DELETE
router.delete('/:id', adminMiddleware, (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Produit non trouvé.' });
  products.splice(idx, 1);
  res.json({ message: 'Produit supprimé.' });
});

module.exports = router;
