const express = require('express');
const router = express.Router();

const searchData = [
  { id:'p1', type:'product', name:'iPhone 15 Pro 256GB', category:'electronics', price:45000 },
  { id:'p2', type:'product', name:'Samsung Galaxy S24 Ultra', category:'electronics', price:52000 },
  { id:'p3', type:'product', name:'MacBook Air M2', category:'electronics', price:85000 },
  { id:'p4', type:'product', name:'Robe de Soirée Élégante', category:'fashion', price:8500 },
  { id:'p5', type:'product', name:'Chaussures Nike Air Max', category:'sports', price:14500 },
];

router.get('/', (req, res) => {
  const { q, limit = 8 } = req.query;
  if (!q || q.length < 2) return res.json([]);
  const results = searchData
    .filter(item => item.name.toLowerCase().includes(q.toLowerCase()))
    .slice(0, parseInt(limit));
  res.json(results);
});

router.get('/suggestions', (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json([]);
  const suggestions = searchData
    .filter(i => i.name.toLowerCase().includes(q.toLowerCase()))
    .map(i => i.name)
    .slice(0, 6);
  res.json(suggestions);
});

module.exports = router;
