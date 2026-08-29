const request = require('supertest');
const app = require('./backend/server');

(async () => {
  const r = await request(app).get('/api/payments/paypal/config');

  console.log(JSON.stringify({
    status: r.status,
    clientId: r.body.clientId,
    merchant: r.body.merchant,
    email: r.body.email
  }, null, 2));

  const ok = r.status === 200 &&
    r.body.clientId === 'AdI4wGqusD1U_r2ng3TxPlIUpNdHFN0CkoVc1bTtUuGumlKeItEm7kgy74gym9w-rPs4-D0lANzmZq5j';

  process.exit(ok ? 0 : 1);
})();
