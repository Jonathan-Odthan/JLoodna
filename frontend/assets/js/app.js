/**
 * Jloodna | Global Trading - Core App JS
 * Currency: HTG (Gourdes Haïtiennes) - Symbol G
 */

'use strict';

// ============================================================
// CONSTANTS & CONFIG
// ============================================================
const APP_CONFIG = {
  name: 'Jloodna | Global Trading',
  currency: { code: 'HTG', symbol: 'G', name: 'Gourde Haïtienne' },
  cshdireck_id: '202518760458266',
  admin_emails: ['jloodna@gmail.com', 'odthanempire@gmail.com'],
  admin_username: '@JLoodna20021996',
  api_base: '/api',
  ws_url: window.location.protocol === 'https:' ? 'wss://' + location.host + '/ws' : 'ws://' + location.host + '/ws',
  rates: { USD: 134.5, EUR: 146.2, CAD: 99.3, HTG: 1 }
};

// ============================================================
// CURRENCY UTILS
// ============================================================
const Currency = {
  current: 'HTG',
  rates: APP_CONFIG.rates,

  format(amount, code) {
    const cur = code || this.current;
    const converted = this.convert(amount, 'HTG', cur);
    if (cur === 'HTG') return `G ${Number(converted).toLocaleString('fr-HT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const symbols = { USD: '$', EUR: '€', CAD: 'CA$' };
    return `${symbols[cur] || cur} ${Number(converted).toLocaleString('fr-HT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },

  convert(amount, from, to) {
    if (from === to) return amount;
    const inHTG = from === 'HTG' ? amount : amount * (this.rates[from] || 1);
    return to === 'HTG' ? inHTG : inHTG / (this.rates[to] || 1);
  },

  setCurrency(code) {
    this.current = code;
    localStorage.setItem('jl_currency', code);
    document.dispatchEvent(new CustomEvent('currencyChanged', { detail: { code } }));
    this.updateAll();
  },

  updateAll() {
    document.querySelectorAll('[data-price]').forEach(el => {
      const htg = parseFloat(el.dataset.price);
      el.textContent = this.format(htg);
    });
  },

  init() {
    const saved = localStorage.getItem('jl_currency');
    if (saved) this.current = saved;
    document.querySelectorAll('.currency-switcher').forEach(sel => {
      sel.value = this.current;
      sel.addEventListener('change', e => this.setCurrency(e.target.value));
    });
  }
};

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
const Toast = {
  container: null,

  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(title, msg = '', type = 'default', duration = 4000) {
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️', default: '🔔', order: '📦', promo: '🎁' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.default}</div>
      <div class="toast-content">
        <div class="toast-title">${this._esc(title)}</div>
        ${msg ? `<div class="toast-msg">${this._esc(msg)}</div>` : ''}
      </div>
      <button onclick="this.parentElement.remove()" style="color:#9CA3AF;font-size:1.1rem;margin-left:8px">×</button>`;
    this.container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    if (duration > 0) setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, duration);
    return toast;
  },

  success(t, m) { return this.show(t, m, 'success'); },
  error(t, m) { return this.show(t, m, 'error'); },
  info(t, m) { return this.show(t, m, 'info'); },
  warning(t, m) { return this.show(t, m, 'warning'); },
  _esc(s) { return String(s).replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
};

// ============================================================
// CART
// ============================================================
const Cart = {
  items: [],
  isOpen: false,

  init() {
    const saved = localStorage.getItem('jl_cart');
    if (saved) { try { this.items = JSON.parse(saved); } catch (e) { this.items = []; } }
    this.render();
    this._bindEvents();
  },

  _save() { localStorage.setItem('jl_cart', JSON.stringify(this.items)); },

  add(product) {
    const existing = this.items.find(i => i.id === product.id && i.variant === (product.variant || ''));
    if (existing) {
      existing.qty = Math.min(existing.qty + (product.qty || 1), product.stock || 99);
    } else {
      this.items.push({ ...product, qty: product.qty || 1 });
    }
    this._save();
    this.render();
    Toast.success('Ajouté au panier', product.name);
    this.open();
  },

  remove(id, variant = '') {
    this.items = this.items.filter(i => !(i.id === id && i.variant === variant));
    this._save();
    this.render();
  },

  updateQty(id, variant = '', qty) {
    const item = this.items.find(i => i.id === id && i.variant === variant);
    if (item) {
      item.qty = Math.max(1, qty);
      this._save();
      this.render();
    }
  },

  clear() { this.items = []; this._save(); this.render(); },

  get count() { return this.items.reduce((s, i) => s + i.qty, 0); },
  get subtotal() { return this.items.reduce((s, i) => s + i.price * i.qty, 0); },
  get shipping() { return this.subtotal > 15000 ? 0 : 800; },
  get total() { return this.subtotal + this.shipping; },

  render() {
    const badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = this.count;
    const body = document.getElementById('cart-body');
    if (!body) return;
    if (this.items.length === 0) {
      body.innerHTML = `<div style="text-align:center;padding:60px 20px;color:#6B7280"><div style="font-size:3rem;margin-bottom:16px">🛒</div><div style="font-weight:600;margin-bottom:8px">Panier vide</div><div style="font-size:.875rem">Ajoutez des produits pour commencer</div></div>`;
    } else {
      body.innerHTML = this.items.map(item => `
        <div class="cart-item">
          <img src="${item.image || 'assets/images/placeholder.png'}" alt="${item.name}" loading="lazy">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            ${item.variant ? `<div class="cart-item-variant">${item.variant}</div>` : ''}
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px">
              <div class="qty-control">
                <button class="qty-btn" onclick="Cart.updateQty('${item.id}','${item.variant||''}',${item.qty-1})">−</button>
                <span class="qty-val">${item.qty}</span>
                <button class="qty-btn" onclick="Cart.updateQty('${item.id}','${item.variant||''}',${item.qty+1})">+</button>
              </div>
              <div class="cart-item-price">${Currency.format(item.price * item.qty)}</div>
            </div>
          </div>
          <button onclick="Cart.remove('${item.id}','${item.variant||''}')" style="color:#9CA3AF;font-size:1.1rem;align-self:flex-start;padding:2px">×</button>
        </div>`).join('');
    }
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const totalEl = document.getElementById('cart-total');
    if (subtotalEl) subtotalEl.textContent = Currency.format(this.subtotal);
    if (shippingEl) shippingEl.textContent = this.shipping === 0 ? 'Gratuit' : Currency.format(this.shipping);
    if (totalEl) totalEl.textContent = Currency.format(this.total);
  },

  open() {
    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.classList.add('open');
    this.isOpen = true;
  },

  close() {
    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.classList.remove('open');
    this.isOpen = false;
  },

  _bindEvents() {
    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) this.close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && this.isOpen) this.close(); });
  }
};

// ============================================================
// WISHLIST
// ============================================================
const Wishlist = {
  items: [],
  init() {
    const s = localStorage.getItem('jl_wishlist');
    if (s) { try { this.items = JSON.parse(s); } catch(e) { this.items = []; } }
    this._updateBtns();
  },
  _save() { localStorage.setItem('jl_wishlist', JSON.stringify(this.items)); },
  has(id) { return this.items.some(i => i.id === id); },
  toggle(product) {
    if (this.has(product.id)) {
      this.items = this.items.filter(i => i.id !== product.id);
      Toast.info('Retiré des favoris', product.name);
    } else {
      this.items.push(product);
      Toast.success('Ajouté aux favoris', product.name);
    }
    this._save();
    this._updateBtns();
    const badge = document.getElementById('wishlist-badge');
    if (badge) badge.textContent = this.items.length;
  },
  _updateBtns() {
    document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      btn.classList.toggle('active', this.has(btn.dataset.wishlistId));
    });
  }
};

// ============================================================
// REAL-TIME NOTIFICATIONS (WebSocket simulation + SSE fallback)
// ============================================================
const RealtimeNotif = {
  notifications: [],
  unreadCount: 0,
  ws: null,
  reconnectDelay: 3000,
  isOpen: false,

  init() {
    const saved = localStorage.getItem('jl_notifs');
    if (saved) { try { this.notifications = JSON.parse(saved); } catch(e) {} }
    this.unreadCount = this.notifications.filter(n => !n.read).length;
    this._updateBadge();
    this._bindPanel();
    this._startPolling(); // Polling fallback for demo
  },

  _startPolling() {
    // In production: replace with WebSocket connect
    // Simulates real-time by periodically checking for new notifs
    this._simulateRealtime();
    setInterval(() => this._simulateRealtime(), 30000);
  },

  _simulateRealtime() {
    // Demo notifications — in production, fetch from /api/notifications
    const demos = [
      { id: Date.now(), type: 'promo', title: 'Offre spéciale!', desc: 'Jusqu\'à 40% sur l\'électronique', time: 'À l\'instant', read: false },
      { id: Date.now()+1, type: 'system', title: 'Livraison rapide', desc: 'Commande #JL-00123 expédiée', time: 'Il y a 2 min', read: false }
    ];
    // Only add if no recent notifs
    if (this.notifications.length === 0) {
      demos.forEach(n => this.push(n));
    }
  },

  push(notif) {
    this.notifications.unshift(notif);
    if (this.notifications.length > 50) this.notifications = this.notifications.slice(0, 50);
    if (!notif.read) {
      this.unreadCount++;
      this._updateBadge();
      this._renderPanel();
      // Show toast for real-time notif
      const icons = { order: '📦', promo: '🎁', system: '🔔' };
      Toast.show(notif.title, notif.desc, notif.type === 'order' ? 'order' : 'info', 5000);
    }
    localStorage.setItem('jl_notifs', JSON.stringify(this.notifications));
  },

  markAllRead() {
    this.notifications.forEach(n => n.read = true);
    this.unreadCount = 0;
    this._updateBadge();
    this._renderPanel();
    localStorage.setItem('jl_notifs', JSON.stringify(this.notifications));
  },

  _updateBadge() {
    const b = document.getElementById('notif-badge');
    if (b) { b.textContent = this.unreadCount; b.style.display = this.unreadCount > 0 ? 'flex' : 'none'; }
  },

  _renderPanel() {
    const body = document.getElementById('notif-panel-body');
    if (!body) return;
    if (this.notifications.length === 0) {
      body.innerHTML = `<div style="padding:40px;text-align:center;color:#6B7280"><div style="font-size:2.5rem;margin-bottom:12px">🔔</div><div>Aucune notification</div></div>`;
      return;
    }
    const iconMap = { order: '📦', promo: '🎁', system: '⚙️' };
    body.innerHTML = this.notifications.slice(0, 20).map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}" onclick="RealtimeNotif._markRead('${n.id}')">
        <div class="notif-item-icon ${n.type}">${iconMap[n.type] || '🔔'}</div>
        <div class="notif-item-content">
          <div class="notif-item-title">${n.title}</div>
          <div class="notif-item-desc">${n.desc}</div>
          <div class="notif-item-time">${n.time}</div>
        </div>
        ${!n.read ? '<div style="width:8px;height:8px;background:#E63946;border-radius:50%;flex-shrink:0;margin-top:4px"></div>' : ''}
      </div>`).join('');
  },

  _markRead(id) {
    const n = this.notifications.find(x => String(x.id) === String(id));
    if (n && !n.read) { n.read = true; this.unreadCount = Math.max(0, this.unreadCount - 1); this._updateBadge(); this._renderPanel(); localStorage.setItem('jl_notifs', JSON.stringify(this.notifications)); }
  },

  _bindPanel() {
    const btn = document.getElementById('notif-btn');
    const panel = document.getElementById('notif-panel');
    if (!btn || !panel) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      this.isOpen = !this.isOpen;
      panel.classList.toggle('open', this.isOpen);
      if (this.isOpen) this._renderPanel();
    });
    document.addEventListener('click', e => {
      if (this.isOpen && !panel.contains(e.target) && e.target !== btn) {
        this.isOpen = false;
        panel.classList.remove('open');
      }
    });
  },

  openPanel() { const p = document.getElementById('notif-panel'); if(p) { p.classList.add('open'); this.isOpen = true; this._renderPanel(); } }
};

// ============================================================
// AUTH
// ============================================================
const Auth = {
  user: null,

  init() {
    const saved = localStorage.getItem('jl_user');
    if (saved) { try { this.user = JSON.parse(saved); } catch(e) {} }
    this._updateUI();
  },

  login(email, password) {
    // In production: POST /api/auth/login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          const user = { id: 'u_' + Date.now(), email, name: email.split('@')[0], role: 'customer', token: 'tok_' + Math.random().toString(36).slice(2) };
          this.user = user;
          localStorage.setItem('jl_user', JSON.stringify(user));
          this._updateUI();
          resolve(user);
        } else {
          reject(new Error('Email ou mot de passe incorrect'));
        }
      }, 800);
    });
  },

  logout() {
    this.user = null;
    localStorage.removeItem('jl_user');
    this._updateUI();
    Toast.info('Déconnecté', 'À bientôt!');
    setTimeout(() => { window.location.href = '/'; }, 1000);
  },

  isLoggedIn() { return !!this.user; },
  isAdmin() { return this.user && (APP_CONFIG.admin_emails.includes(this.user.email) || this.user.role === 'admin'); },

  requireAuth(redirect = 'login.html') {
    if (!this.isLoggedIn()) { window.location.href = redirect; return false; }
    return true;
  },

  requireAdmin() {
    if (!this.isAdmin()) { window.location.href = 'access-denied.html'; return false; }
    return true;
  },

  _updateUI() {
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    if (loginBtn) loginBtn.style.display = this.user ? 'none' : 'flex';
    if (userMenu) userMenu.style.display = this.user ? 'flex' : 'none';
    if (userName && this.user) userName.textContent = this.user.name;
  }
};

// ============================================================
// SEARCH
// ============================================================
const Search = {
  query: '',
  results: [],

  init() {
    const bar = document.getElementById('main-search');
    const btn = document.getElementById('search-btn');
    if (bar) {
      bar.addEventListener('keydown', e => { if (e.key === 'Enter') this.go(bar.value); });
      bar.addEventListener('input', e => this._suggest(e.target.value));
    }
    if (btn) btn.addEventListener('click', () => { if (bar) this.go(bar.value); });
  },

  go(query) {
    if (!query.trim()) return;
    window.location.href = `shop.html?q=${encodeURIComponent(query.trim())}`;
  },

  _suggest(query) {
    // Live suggestions — in production fetch from API
    const box = document.getElementById('search-suggestions');
    if (!box) return;
    if (query.length < 2) { box.style.display = 'none'; return; }
    const fakes = ['iPhone 15 Pro', 'Samsung Galaxy', 'MacBook Air', 'Chaussures Nike', 'Robe de soirée', 'Télévision 4K', 'Laptop Gaming', 'Écouteurs Bluetooth'];
    const matches = fakes.filter(f => f.toLowerCase().includes(query.toLowerCase()));
    if (!matches.length) { box.style.display = 'none'; return; }
    box.innerHTML = matches.map(m => `<div class="suggestion-item" onclick="Search.go('${m}')">${m}</div>`).join('');
    box.style.display = 'block';
  }
};

// ============================================================
// SCROLL & UI
// ============================================================
const UI = {
  init() {
    this._scrollTop();
    this._mobileMenu();
    this._dropdowns();
    this._smoothReveal();
  },

  _scrollTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  },

  _mobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
  },

  _dropdowns() {
    document.querySelectorAll('[data-dropdown]').forEach(trigger => {
      const target = document.getElementById(trigger.dataset.dropdown);
      if (!target) return;
      trigger.addEventListener('click', e => { e.stopPropagation(); target.classList.toggle('open'); });
      document.addEventListener('click', () => target.classList.remove('open'));
    });
  },

  _smoothReveal() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  Currency.init();
  Cart.init();
  Wishlist.init();
  Auth.init();
  Search.init();
  UI.init();
  RealtimeNotif.init();
});
