const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const PAYPAL_CONFIG = {
  clientId: process.env.PAYPAL_CLIENT_ID || 'AdI4wGqusD1U_r2ng3TxPlIUpNdHFN0CkoVc1bTtUuGumlKeItEm7kgy74gym9w-rPs4-D0lANzmZq5j',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'EMHcNJgFKhE3RQqZlW6wKswhARkVx61kl2KFtlUoz6qVvV0O7EWd3fXn03X6n0spoGghMZFak9RRXL6T'
};

const PAYPAL_BASE_URL = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const PAYMENT_METHODS = {
  cshdireck: { name: 'Csh Direk', id: '202518760458266', currency: 'HTG' },
  natcash: { name: 'Natcash', currency: 'HTG' },
  visa: { name: 'Visa', currency: 'multi' },
  mastercard: { name: 'Mastercard', currency: 'multi' },
  paypal: {
    name: 'PayPal',
    currency: 'USD',
    email: 'paypal@jloodna.ht',
    accountName: 'Jloodna Global Trading',
    id: '@JLoodna-2002',
    clientId: PAYPAL_CONFIG.clientId
  },
  bank: { name: 'Virement Bancaire', currency: 'HTG' }
};

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CONFIG.clientId}:${PAYPAL_CONFIG.clientSecret}`).toString('base64');
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Paypal token error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

router.get('/methods', (req, res) => {
  res.json(PAYMENT_METHODS);
});

router.get('/paypal/config', (req, res) => {
  res.json({
    clientId: PAYPAL_CONFIG.clientId,
    merchant: 'Jloodna Global Trading',
    email: 'paypal@jloodna.ht'
  });
});

router.post('/paypal/create-order', async (req, res) => {
  try {
    const { amount, currency = 'USD', orderId = `JL-${Date.now()}` } = req.body || {};
    const value = Number(amount || 10);

    if (!Number.isFinite(value) || value <= 0) {
      return res.status(400).json({ error: 'Montant PayPal invalide.' });
    }

    const accessToken = await getPayPalAccessToken();
    const createOrderPayload = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderId,
        description: 'Commande Jloodna',
        amount: {
          currency_code: currency,
          value: value.toFixed(2)
        }
      }],
      application_context: {
        brand_name: 'Jloodna Global Trading',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: `${req.protocol}://${req.get('host')}/checkout/success`,
        cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`
      }
    };

    const paypalResponse = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(createOrderPayload)
    });

    const paypalData = await paypalResponse.json();

    if (!paypalResponse.ok) {
      return res.status(500).json({ error: 'Erreur PayPal', details: paypalData });
    }

    const approvalLink = (paypalData.links || []).find(link => link.rel === 'approve');

    res.json({
      ok: true,
      orderId: paypalData.id,
      approvalUrl: approvalLink ? approvalLink.href : null,
      paypal: paypalData
    });
  } catch (error) {
    console.error('PayPal create-order error:', error);
    res.status(500).json({ error: 'La création de la commande PayPal a échoué.', details: error.message });
  }
});

router.post('/verify', authMiddleware, (req, res) => {
  const { method, reference, amount, orderId } = req.body;
  if (!method || !amount || !orderId) return res.status(400).json({ error: 'Données de paiement manquantes.' });
  // In production: verify with actual payment gateway
  const transaction = {
    id: 'TRX-' + String(Date.now()).slice(-6),
    orderId, method, amount, reference,
    status: 'confirmed',
    timestamp: new Date()
  };
  res.json({ transaction, message: 'Paiement vérifié avec succès.' });
});

router.get('/', adminMiddleware, (req, res) => {
  res.json([
    { id:'TRX-789012', orderId:'JL-002341', customer:'Marie Jean', method:'cshdireck', amount:45800, status:'confirmed', date: new Date() },
    { id:'TRX-789011', orderId:'JL-002340', customer:'Pierre Dupont', method:'natcash', amount:17800, status:'confirmed', date: new Date(Date.now()-3600000) },
  ]);
});

module.exports = router;
