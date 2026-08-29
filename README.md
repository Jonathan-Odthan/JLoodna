# 🛍️ Jloodna | Global Trading

> **La boutique e-commerce #1 en Haïti** — Devise principale : **HTG (Gourdes Haïtiennes · G)**

---

## 📋 Table des matières
1. [Présentation](#présentation)
2. [Structure du projet](#structure)
3. [Installation rapide](#installation)
4. [Pages incluses](#pages)
5. [Accès Admin](#admin)
6. [Paiements](#paiements)
7. [Sécurité](#sécurité)
8. [API Backend](#api)
9. [Déploiement](#déploiement)

---

## 🌟 Présentation

**Jloodna | Global Trading** est une plateforme e-commerce complète, moderne et professionnelle construite pour le marché haïtien.

- 💰 **Devise : HTG** (Gourdes Haïtiennes, symbole **G**)
- 🔔 **Notifications temps réel** (WebSocket / polling)
- 🛒 **Panier persistant** (localStorage)
- 💳 **6 modes de paiement** acceptés
- 📱 **100% responsive** mobile/tablette/desktop
- 🔐 **Accès admin strict** par email autorisé

---

## 📁 Structure du Projet

```
jloodna/
├── frontend/
│   ├── pages/              # 22 pages client HTML
│   │   ├── index.html      # Accueil
│   │   ├── shop.html       # Boutique + filtres
│   │   ├── product.html    # Détail produit
│   │   ├── cart.html       # Panier
│   │   ├── checkout.html   # Paiement multi-étapes
│   │   ├── login.html      # Connexion
│   │   ├── register.html   # Inscription
│   │   ├── account.html    # Mon compte
│   │   ├── orders.html     # Mes commandes
│   │   ├── tracking.html   # Suivi commande
│   │   ├── wishlist.html   # Favoris
│   │   ├── notifications.html
│   │   ├── faq.html
│   │   ├── contact.html
│   │   ├── about.html
│   │   ├── returns.html
│   │   ├── privacy.html
│   │   ├── terms.html
│   │   ├── forgot-password.html
│   │   ├── 404.html
│   │   ├── access-denied.html
│   │   └── maintenance.html
│   └── assets/
│       ├── css/
│       │   ├── main.css         # Styles globaux
│       │   └── variables.css    # Variables CSS
│       ├── js/
│       │   └── app.js           # App core (Cart, Auth, Toast, Currency...)
│       └── images/
│           ├── logo.svg
│           └── favicon.svg
│
├── admin/
│   ├── pages/              # 16 pages admin
│   │   ├── dashboard.html  # Tableau de bord
│   │   ├── products.html   # CRUD produits
│   │   ├── orders.html     # Gestion commandes
│   │   ├── categories.html
│   │   ├── customers.html
│   │   ├── payments.html
│   │   ├── coupons.html
│   │   ├── statistics.html
│   │   ├── delivery.html
│   │   ├── stock.html
│   │   ├── returns.html
│   │   ├── reviews.html
│   │   ├── banners.html
│   │   ├── audit-logs.html
│   │   ├── settings.html
│   │   └── security.html
│   └── assets/
│       ├── css/admin.css
│       └── js/admin.js
│
├── backend/
│   ├── server.js           # Point d'entrée Express
│   ├── config/
│   │   ├── database.js     # Connexion Sequelize/MySQL
│   │   └── jwt.js          # Configuration JWT
│   ├── middleware/
│   │   ├── auth.js         # Auth + Admin guard
│   │   └── validate.js     # Validation + Sanitization
│   └── routes/
│       ├── auth.js         # POST /api/auth/login|register|logout
│       ├── products.js     # GET/POST/PUT/DELETE /api/products
│       ├── orders.js       # Gestion commandes
│       ├── users.js        # Profil utilisateur
│       ├── payments.js     # Vérification paiements
│       ├── notifications.js# Notifications
│       ├── search.js       # Recherche
│       └── admin.js        # Routes admin protégées
│
├── package.json
├── .env.example            # → copier en .env
├── .gitignore
└── README.md
```

---

## ⚡ Installation Rapide

### Option 1 — Site statique (sans backend)
Ouvrez directement `frontend/pages/index.html` dans votre navigateur. Tout fonctionne en local (panier, favoris, notifications simulées).

### Option 2 — Avec backend Node.js

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditez .env avec vos valeurs

# 3. Lancer en développement
npm run dev

# 4. Lancer en production
npm start
```

**Accès :**
- 🌐 Frontend : `http://localhost:3000/frontend/pages/index.html`
- 🔐 Admin : `http://localhost:3000/admin/pages/dashboard.html`
- 🔌 API : `http://localhost:3000/api/health`

---

## 📄 Pages incluses (22 pages client + 16 admin)

| Page | URL | Description |
|------|-----|-------------|
| Accueil | `index.html` | Hero, catégories, produits vedette |
| Boutique | `shop.html` | Catalogue + filtres avancés |
| Produit | `product.html` | Détail, variantes, avis |
| Panier | `cart.html` | Panier persistant |
| Checkout | `checkout.html` | Paiement multi-étapes |
| Connexion | `login.html` | Auth sécurisée |
| Inscription | `register.html` | Création compte |
| Mon compte | `account.html` | Profil utilisateur |
| Commandes | `orders.html` | Historique commandes |
| Suivi | `tracking.html` | Tracking en temps réel |
| Favoris | `wishlist.html` | Liste de souhaits |
| Notifications | `notifications.html` | Alertes temps réel |
| FAQ | `faq.html` | Questions fréquentes |
| Contact | `contact.html` | Formulaire contact |
| À propos | `about.html` | Présentation |
| Retours | `returns.html` | Politique retours |
| Confidentialité | `privacy.html` | RGPD |
| CGU | `terms.html` | Conditions |
| Mot de passe | `forgot-password.html` | Reset |
| 404 | `404.html` | Page introuvable |
| Accès refusé | `access-denied.html` | Non autorisé |
| Maintenance | `maintenance.html` | Site en maintenance |

---

## 🔐 Accès Administrateur

> ⚠️ **ACCÈS STRICTEMENT RESTREINT**

| Paramètre | Valeur |
|-----------|--------|
| Email 1 | `jloodna@gmail.com` |
| Email 2 | `odthanempire@gmail.com` |
| Username | `@JLoodna20021996` |
| URL Admin | `/admin/pages/dashboard.html` |

Tout autre email est automatiquement **redirigé vers la page d'accès refusé**.

### Fonctionnalités Admin
- 📊 Tableau de bord avec KPIs en temps réel
- 🛍️ CRUD produits (variantes, prix promo, stock, SKU)
- 📦 Gestion commandes + mise à jour statuts
- 📂 Catégories et sous-catégories
- 👥 Gestion clients (VIP, blocage)
- 💳 Suivi paiements par méthode
- 🚚 Gestion livraisons
- 📋 Alertes stock faible
- ↩️ Retours et remboursements
- ⭐ Modération avis clients
- 🎟️ Coupons et promotions
- 🖼️ Bannières homepage
- 📝 Journal d'audit complet
- 🔒 Paramètres de sécurité
- ⚙️ Configuration du site

---

## 💳 Modes de Paiement

| Méthode | Type | Devise | ID |
|---------|------|--------|----|
| **Csh Direk** | Mobile Haiti | HTG | `202518760458266` |
| **Natcash** | Mobile Haiti | HTG | — |
| **Visa** | Carte bancaire | Multi | — |
| **Mastercard** | Carte bancaire | Multi | — |
| **PayPal** | En ligne | USD | — |
| **Virement bancaire** | Bancaire | HTG | — |

**Devise par défaut : HTG (G)** — Convertisseur optionnel USD/EUR/CAD disponible.

---

## 🛡️ Sécurité

- ✅ Mots de passe hashés avec **bcrypt** (12 rounds)
- ✅ Tokens **JWT** sécurisés (séparés client/admin)
- ✅ Protection **CSRF** via tokens
- ✅ **Rate limiting** : 10 tentatives/15min sur login
- ✅ **Helmet.js** pour les headers HTTP sécurisés
- ✅ **Sanitization XSS** sur toutes les entrées
- ✅ Cookies **httpOnly + secure + sameSite:strict**
- ✅ Sessions expirables (24h client, 8h admin)
- ✅ **Audit logs** complets de toutes les actions admin
- ✅ Validation stricte des entrées côté serveur
- ✅ CORS configuré
- ✅ Séparation complète client / admin

---

## 🔌 API Backend

```
GET  /api/health                    → Santé du serveur
POST /api/auth/register             → Inscription
POST /api/auth/login                → Connexion
POST /api/auth/logout               → Déconnexion
POST /api/auth/forgot-password      → Réinitialisation mdp

GET  /api/products?cat=&q=&sort=    → Liste produits (filtrés)
GET  /api/products/:id              → Détail produit
POST /api/products                  → Créer produit (admin)
PUT  /api/products/:id              → Modifier produit (admin)
DELETE /api/products/:id            → Supprimer produit (admin)

GET  /api/orders                    → Mes commandes
POST /api/orders                    → Passer une commande
GET  /api/orders/:id                → Détail commande
PATCH /api/orders/:id/status        → Changer statut (admin)

GET  /api/users/me                  → Mon profil
PUT  /api/users/me                  → Modifier profil
GET  /api/users                     → Tous les clients (admin)

POST /api/payments/verify           → Vérifier paiement
GET  /api/payments                  → Historique (admin)
GET  /api/payments/methods          → Méthodes disponibles

GET  /api/notifications             → Mes notifications
POST /api/notifications/mark-read   → Marquer lues
GET  /api/search?q=                 → Recherche produits

POST /api/admin/verify              → Vérifier accès admin
GET  /api/admin/stats               → Stats dashboard
GET  /api/admin/logs                → Audit logs
```

---

## 🚀 Déploiement

### Variables .env pour la production

```env
NODE_ENV=production
PORT=3000
DB_HOST=votre-serveur-mysql
DB_NAME=jloodna_db
JWT_SECRET=clé_très_longue_et_aléatoire_minimum_64_caractères
ADMIN_JWT_SECRET=autre_clé_très_longue_pour_admin
FRONTEND_URL=https://www.jloodna.ht
```

### Avec PM2 (recommandé)
```bash
npm install -g pm2
pm2 start backend/server.js --name jloodna
pm2 save
pm2 startup
```

### Avec Nginx (reverse proxy)
```nginx
server {
    listen 80;
    server_name jloodna.ht www.jloodna.ht;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📞 Support

- 📧 Email : support@jloodna.ht
- 💬 WhatsApp : +509 XXXX XXXX
- 🇭🇹 Port-au-Prince, Haïti

---

**© 2025 Jloodna | Global Trading — Tous droits réservés**
*Développé avec ❤️ pour Haïti — Devise HTG (G)*
