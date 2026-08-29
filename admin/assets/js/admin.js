/**
 * =========================================================
 * JLOODNA ADMIN PANEL — REALTIME CORE SYSTEM
 * Ultra Professional Admin System
 * Secure + Live Monitoring + Instant Sync
 * =========================================================
 */

'use strict';

/* =========================================================
CONFIG
========================================================= */

const ADMIN_CONFIG = {

  allowedEmails: [
    'jloodna@gmail.com'
  ],

  adminId: '@JLoodna-2002',
  adminUsername: '@JLoodna-2002',
  paypal: {
    enabled: true,
    email: 'paypal@jloodna.ht',
    merchant: 'Jloodna Global Trading',
    accountId: '@JLoodna-2002'
  },

  currency: {
    code: 'HTG',
    symbol: 'G'
  },

  realtimeInterval: 5000,

  storage: {
    orders: 'jl_orders',
    users: 'jl_users',
    products: 'jl_products',
    notifications: 'jl_admin_notifications',
    stats: 'jl_admin_stats',
    logs: 'jl_admin_logs'
  }

};

/* =========================================================
AUTH SYSTEM
========================================================= */

const AdminAuth = {

  user: null,

  init() {

    try {

      const saved =
        localStorage.getItem('jl_admin_user') ||
        sessionStorage.getItem('jl_admin_user');

      if (!saved) {
        this.deny();
        return false;
      }

      this.user = JSON.parse(saved);

      if (!this.isAdmin()) {
        this.deny();
        return false;
      }

      if (!this.user.id && ADMIN_CONFIG.adminId) {
        this.user.id = ADMIN_CONFIG.adminId;
      }

      if (!this.user.name && ADMIN_CONFIG.adminUsername) {
        this.user.name = ADMIN_CONFIG.adminUsername;
      }

      this.updateUI();

      return true;

    } catch (error) {

      console.error(error);

      this.deny();

      return false;
    }

  },

  isAdmin() {

    if (!this.user) return false;

    const email = (this.user.email || '').trim().toLowerCase();
    const id = (this.user.id || '').trim();

    const validByEmail = ADMIN_CONFIG.allowedEmails.includes(email);
    const validById = id === ADMIN_CONFIG.adminId;

    return validByEmail || validById;
  },

  updateUI() {

    const name =
      document.getElementById('admin-user-name');

    const email =
      document.getElementById('admin-user-email');

    if (name) {
      name.textContent =
        this.user.name || 'Admin';
    }

    if (email) {
      email.textContent =
        this.user.email || '';
    }

  },

  logout() {

    localStorage.removeItem('jl_admin_user');
    sessionStorage.removeItem('jl_admin_user');

    location.href =
      '/admin/pages/login.html';

  },

  deny() {

    location.href =
      '/admin/pages/login.html';

  }

};

/* =========================================================
FORMATTERS
========================================================= */

const AdminFormat = {

  money(value) {

    return (
      ADMIN_CONFIG.currency.symbol +
      ' ' +
      Number(value).toLocaleString('fr-FR')
    );

  },

  number(value) {

    return Number(value).toLocaleString('fr-FR');

  },

  date(value) {

    return new Date(value).toLocaleString(
      'fr-FR',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }

};

/* =========================================================
TOAST SYSTEM
========================================================= */

const AdminToast = {

  container: null,

  init() {

    this.container =
      document.createElement('div');

    this.container.id =
      'admin-toast-container';

    this.container.style.cssText = `
      position:fixed;
      top:90px;
      right:20px;
      z-index:99999;
      display:flex;
      flex-direction:column;
      gap:10px;
      width:320px;
      max-width:90%;
    `;

    document.body.appendChild(
      this.container
    );

  },

  show(message, type = 'info') {

    const toast =
      document.createElement('div');

    const colors = {
      success: '#2DC653',
      error: '#E63946',
      warning: '#FFB703',
      info: '#2563EB'
    };

    toast.style.cssText = `
      background:#fff;
      border-left:5px solid ${colors[type]};
      padding:16px;
      border-radius:14px;
      box-shadow:0 10px 40px rgba(0,0,0,.12);
      transform:translateX(120%);
      transition:.4s;
      font-size:.9rem;
      font-weight:600;
      color:#111827;
    `;

    toast.innerHTML = message;

    this.container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform =
        'translateX(0)';
    });

    setTimeout(() => {

      toast.style.transform =
        'translateX(120%)';

      setTimeout(() => {
        toast.remove();
      }, 400);

    }, 4000);

  }

};

/* =========================================================
REALTIME SYSTEM
========================================================= */

const AdminRealtime = {

  stats: {
    revenue: 285000,
    orders: 47,
    clients: 12,
    pending: 8
  },

  notifications: [],

  init() {

    this.load();

    this.render();

    this.bindNotificationPanel();

    this.startRealtime();

    this.listenStorageChanges();

  },

  /* =====================================================
  START LIVE SYSTEM
  ===================================================== */

  startRealtime() {

    setInterval(() => {

      this.simulateActivity();

      this.refreshDashboard();

      this.updateCharts();

      this.save();

    }, ADMIN_CONFIG.realtimeInterval);

  },

  /* =====================================================
  SIMULATE LIVE SHOP ACTIVITY
  ===================================================== */

  simulateActivity() {

    const random = Math.random();

    if (random < 0.35) {

      this.newOrder();

    } else if (random < 0.60) {

      this.newCustomer();

    } else if (random < 0.80) {

      this.newPayment();

    } else {

      this.stockAlert();

    }

  },

  /* =====================================================
  NEW ORDER
  ===================================================== */

  newOrder() {

    const amount =
      Math.floor(
        Math.random() * 60000
      ) + 5000;

    this.stats.orders += 1;

    this.stats.revenue += amount;

    this.stats.pending += 1;

    this.pushNotification({
      type: 'order',
      title: 'Nouvelle commande',
      description:
        'Commande reçue — ' +
        AdminFormat.money(amount)
    });

  },

  /* =====================================================
  NEW CUSTOMER
  ===================================================== */

  newCustomer() {

    this.stats.clients += 1;

    this.pushNotification({
      type: 'user',
      title: 'Nouveau client',
      description:
        'Un nouveau client vient de créer un compte'
    });

  },

  /* =====================================================
  NEW PAYMENT
  ===================================================== */

  newPayment() {

    const amount =
      Math.floor(
        Math.random() * 40000
      ) + 3000;

    this.pushNotification({
      type: 'payment',
      title: 'Paiement confirmé',
      description:
        'Paiement reçu — ' +
        AdminFormat.money(amount)
    });

  },

  /* =====================================================
  STOCK ALERT
  ===================================================== */

  stockAlert() {

    this.pushNotification({
      type: 'stock',
      title: 'Stock faible',
      description:
        'Attention : Produit bientôt épuisé'
    });

  },

  /* =====================================================
  PUSH NOTIFICATION
  ===================================================== */

  pushNotification(data) {

    const notification = {

      id: Date.now(),

      read: false,

      time: AdminFormat.date(Date.now()),

      ...data

    };

    this.notifications.unshift(
      notification
    );

    if (
      this.notifications.length > 50
    ) {
      this.notifications.pop();
    }

    this.renderNotifications();

    this.updateBadge();

    AdminToast.show(
      `<strong>${notification.title}</strong><br>${notification.description}`,
      'info'
    );

  },

  /* =====================================================
  NOTIFICATION PANEL
  ===================================================== */

  renderNotifications() {

    const body =
      document.getElementById(
        'admin-notif-body'
      );

    if (!body) return;

    body.innerHTML =
      this.notifications
        .map(
          notif => `
        <div class="notif-item">

          <div class="notif-content">

            <div class="notif-title">
              ${notif.title}
            </div>

            <div class="notif-desc">
              ${notif.description}
            </div>

            <div class="notif-time">
              ${notif.time}
            </div>

          </div>

        </div>
      `
        )
        .join('');

  },

  updateBadge() {

    const badge =
      document.getElementById(
        'admin-notif-badge'
      );

    if (!badge) return;

    const unread =
      this.notifications.filter(
        n => !n.read
      ).length;

    badge.textContent = unread;

    badge.style.display =
      unread > 0 ? 'flex' : 'none';

  },

  bindNotificationPanel() {

    const btn =
      document.getElementById(
        'admin-notif-btn'
      );

    const panel =
      document.getElementById(
        'admin-notif-panel'
      );

    if (!btn || !panel) return;

    btn.addEventListener(
      'click',
      e => {

        e.stopPropagation();

        panel.style.display =
          panel.style.display ===
          'block'
            ? 'none'
            : 'block';

      }
    );

    document.addEventListener(
      'click',
      e => {

        if (
          !panel.contains(e.target) &&
          e.target !== btn
        ) {

          panel.style.display =
            'none';

        }

      }
    );

  },

  /* =====================================================
  DASHBOARD LIVE UPDATE
  ===================================================== */

  refreshDashboard() {

    this.updateText(
      'stat-revenue',
      AdminFormat.money(
        this.stats.revenue
      )
    );

    this.updateText(
      'stat-orders',
      AdminFormat.number(
        this.stats.orders
      )
    );

    this.updateText(
      'stat-clients',
      AdminFormat.number(
        this.stats.clients
      )
    );

    this.updateText(
      'stat-pending',
      AdminFormat.number(
        this.stats.pending
      )
    );

  },

  updateText(id, value) {

    const el =
      document.getElementById(id);

    if (!el) return;

    el.style.transform =
      'scale(1.08)';

    el.textContent = value;

    setTimeout(() => {

      el.style.transform =
        'scale(1)';

    }, 300);

  },

  /* =====================================================
  LIVE CHARTS
  ===================================================== */

  updateCharts() {

    const chart =
      document.getElementById(
        'revenue-chart'
      );

    if (!chart) return;

    const values = Array.from(
      { length: 7 },
      () =>
        Math.floor(
          Math.random() * 100
        ) + 20
    );

    const max = Math.max(...values);

    chart.innerHTML =
      values
        .map(
          value => `
        <div
          style="
            flex:1;
            background:linear-gradient(
              180deg,
              #C9A84C,
              #0A1628
            );
            border-radius:10px 10px 0 0;
            height:${(value / max) * 100}%;
            animation:growBar 1s ease;
          "
        ></div>
      `
        )
        .join('');

  },

  /* =====================================================
  STORAGE SYNC
  ===================================================== */

  save() {

    localStorage.setItem(
      ADMIN_CONFIG.storage.stats,
      JSON.stringify(this.stats)
    );

    localStorage.setItem(
      ADMIN_CONFIG.storage.notifications,
      JSON.stringify(
        this.notifications
      )
    );

  },

  load() {

    const savedStats =
      localStorage.getItem(
        ADMIN_CONFIG.storage.stats
      );

    const savedNotifications =
      localStorage.getItem(
        ADMIN_CONFIG.storage.notifications
      );

    if (savedStats) {

      this.stats =
        JSON.parse(savedStats);

    }

    if (savedNotifications) {

      this.notifications =
        JSON.parse(
          savedNotifications
        );

    }

  },

  listenStorageChanges() {

    window.addEventListener(
      'storage',
      () => {

        this.load();

        this.refreshDashboard();

        this.renderNotifications();

        this.updateBadge();

      }
    );

  },

  render() {

    this.refreshDashboard();

    this.renderNotifications();

    this.updateBadge();

    this.updateCharts();

  }

};

/* =========================================================
ADMIN UI
========================================================= */

const AdminUI = {

  init() {

    this.sidebar();

    this.activeMenu();

    this.liveClock();

  },

  sidebar() {

    const sidebar =
      document.getElementById(
        'admin-sidebar'
      );

    const toggle =
      document.getElementById(
        'sidebar-toggle'
      );

    if (!sidebar || !toggle) return;

    toggle.addEventListener(
      'click',
      () => {

        sidebar.classList.toggle(
          'collapsed'
        );

      }
    );

  },

  activeMenu() {

    const path =
      window.location.pathname
        .split('/')
        .pop();

    document
      .querySelectorAll(
        '.sidebar-item'
      )
      .forEach(link => {

        if (
          link.getAttribute('href') ===
          path
        ) {

          link.classList.add(
            'active'
          );

        }

      });

  },

  liveClock() {

    const el =
      document.getElementById(
        'dashboard-date'
      );

    if (!el) return;

    setInterval(() => {

      el.textContent =
        new Date().toLocaleString(
          'fr-FR',
          {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }
        );

    }, 1000);

  }

};

/* =========================================================
LIVE AUDIT LOGS
========================================================= */

const AdminLogs = {

  add(action) {

    let logs =
      JSON.parse(
        localStorage.getItem(
          ADMIN_CONFIG.storage.logs
        ) || '[]'
      );

    logs.unshift({
      action,
      time:
        new Date().toISOString()
    });

    logs = logs.slice(0, 200);

    localStorage.setItem(
      ADMIN_CONFIG.storage.logs,
      JSON.stringify(logs)
    );

  }

};

const AdminProducts = {

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_CONFIG.storage.products) || '[]');
    } catch (error) {
      return [];
    }
  },

  setAll(list) {
    localStorage.setItem(ADMIN_CONFIG.storage.products, JSON.stringify(list));
  },

  seed() {
    const existing = this.getAll();
    if (existing.length > 0) return existing;

    const demoProducts = [
      { id: 'p_1', name: 'iPhone 15 Pro', category: 'electronics', price: 45000, stock: 15, sku: 'JL-001', status: 'active' },
      { id: 'p_2', name: 'MacBook Air M2', category: 'electronics', price: 85000, stock: 7, sku: 'JL-002', status: 'active' },
      { id: 'p_3', name: 'Robe de Soirée', category: 'fashion', price: 8500, stock: 22, sku: 'JL-003', status: 'active' },
      { id: 'p_4', name: 'Chaussures Nike Air Max', category: 'sports', price: 14500, stock: 30, sku: 'JL-004', status: 'active' }
    ];

    this.setAll(demoProducts);
    return demoProducts;
  },

  render() {
    if (!/products\.html$/i.test(window.location.pathname)) return;

    const target = document.getElementById('page-main-content');
    if (!target) return;

    const products = this.seed();

    target.innerHTML = `
      <div style="display:grid;grid-template-columns:1.1fr 2fr;gap:20px;align-items:start">
        <div class="admin-card">
          <div class="admin-card-header">
            <span class="admin-card-title">➕ Ajouter un produit</span>
          </div>
          <div class="admin-card-body">
            <form id="admin-product-form" style="display:grid;gap:14px">
              <div class="form-group">
                <label class="form-label">Nom du produit</label>
                <input class="form-input" name="name" placeholder="Ex: iPhone 15 Pro" required>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="form-group">
                  <label class="form-label">Catégorie</label>
                  <select class="form-input" name="category" required>
                    <option value="electronics">Électronique</option>
                    <option value="fashion">Mode</option>
                    <option value="sports">Sports</option>
                    <option value="home">Maison</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">SKU</label>
                  <input class="form-input" name="sku" placeholder="JL-005" required>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <div class="form-group">
                  <label class="form-label">Prix (HTG)</label>
                  <input class="form-input" type="number" name="price" min="1" placeholder="15000" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Stock</label>
                  <input class="form-input" type="number" name="stock" min="0" placeholder="10" required>
                </div>
              </div>
              <button type="submit" class="btn-admin btn-admin-primary" style="justify-content:center">💾 Enregistrer le produit</button>
            </form>
          </div>
        </div>
        <div class="admin-card">
          <div class="admin-card-header">
            <span class="admin-card-title">📦 Catalogue</span>
          </div>
          <div style="overflow:auto">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>SKU</th>
                </tr>
              </thead>
              <tbody id="admin-products-body">
                ${products.map(product => `
                  <tr>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>G ${Number(product.price).toLocaleString('fr-FR')}</td>
                    <td>${product.stock}</td>
                    <td>${product.sku}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    const form = document.getElementById('admin-product-form');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const product = {
          id: `p_${Date.now()}`,
          name: String(formData.get('name') || '').trim(),
          category: String(formData.get('category') || 'electronics').trim(),
          sku: String(formData.get('sku') || '').trim(),
          price: Number(formData.get('price') || 0),
          stock: Number(formData.get('stock') || 0),
          status: 'active'
        };

        if (!product.name || !product.sku || product.price <= 0) {
          AdminToast.show('Veuillez renseigner les champs du produit.', 'error');
          return;
        }

        const allProducts = this.getAll();
        allProducts.unshift(product);
        this.setAll(allProducts);
        this.render();
        AdminToast.show('Produit ajouté avec succès.', 'success');
      });
    }
  },

  init() {
    if (!/products\.html$/i.test(window.location.pathname)) return;
    this.render();
  }
};

/* =========================================================
GLOBAL FUNCTIONS
========================================================= */

window.AdminAuth = AdminAuth;
window.AdminRealtime = AdminRealtime;
window.AdminToast = AdminToast;
window.AdminLogs = AdminLogs;
window.AdminProducts = AdminProducts;

/* =========================================================
INIT
========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    if (!AdminAuth.init()) return;

    AdminToast.init();

    AdminUI.init();

    AdminProducts.init();

    AdminRealtime.init();

    AdminLogs.add(
      'Connexion administrateur'
    );

  }
);

/* =========================================================
LIVE BAR ANIMATION
========================================================= */

const style =
document.createElement('style');

style.innerHTML = `
@keyframes growBar{
  from{
    height:0;
  }
}
`;

document.head.appendChild(style);
