const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwtConfig = require('../config/jwt');
const { validateEmail, validatePassword } = require('../middleware/validate');

const ADMIN_EMAILS = ['jloodna@gmail.com'];
const ADMIN_ID = '@JLoodna-2002';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '@JLoodna2002';
// Seeded admin account for the real Jloodna shop administrator.
const users = [{
  id: ADMIN_ID,
  email: 'jloodna@gmail.com',
  name: 'Jloodna Admin',
  role: 'admin',
  hash: bcrypt.hashSync(ADMIN_PASSWORD, 12),
  createdAt: new Date()
}];

router.post('/register', async (req, res) => {
  try {
    const { fname, lname, email, password, phone } = req.body;
    if (!email || !password || !fname) return res.status(400).json({ error: 'Champs obligatoires manquants.' });
    if (!validateEmail(email)) return res.status(400).json({ error: 'Email invalide.' });
    if (!validatePassword(password)) return res.status(400).json({ error: 'Mot de passe trop court (min 8 caractères).' });
    if (users.find(u => u.email === email.toLowerCase())) return res.status(409).json({ error: 'Email déjà utilisé.' });
    const hash = await bcrypt.hash(password, 12);
    const user = { id: 'u_' + Date.now(), email: email.toLowerCase(), name: fname + ' ' + lname, phone, role: 'customer', hash, createdAt: new Date() };
    users.push(user);
    const token = jwtConfig.sign({ id: user.id, email: user.email, role: user.role });
    res.cookie('jl_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 86400000, sameSite: 'strict' });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis.' });
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    const valid = await bcrypt.compare(password, user.hash);
    if (!valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    const isAdmin = ADMIN_EMAILS.includes(user.email);
    const token = isAdmin ? jwtConfig.signAdmin({ id: user.id, email: user.email, role: 'admin' }) : jwtConfig.sign({ id: user.id, email: user.email, role: user.role });
    const cookieName = isAdmin ? 'jl_admin_token' : 'jl_token';
    res.cookie(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: isAdmin ? 28800000 : 86400000, sameSite: 'strict' });
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: isAdmin ? 'admin' : user.role
      },
      isAdmin
    });
  } catch (e) { res.status(500).json({ error: 'Erreur serveur.' }); }
});

router.post('/logout', (req, res) => {
  res.clearCookie('jl_token');
  res.clearCookie('jl_admin_token');
  res.json({ message: 'Déconnecté avec succès.' });
});

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email || !validateEmail(email)) return res.status(400).json({ error: 'Email invalide.' });
  // In production: send reset email
  res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
});

module.exports = router;
