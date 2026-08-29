const request = require('supertest');
const app = require('./backend/server');

(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'jloodna@gmail.com', password: '@JLoodna2002' });

  console.log(JSON.stringify({
    status: res.status,
    isAdmin: res.body.isAdmin,
    email: res.body.user && res.body.user.email,
    id: res.body.user && res.body.user.id,
    name: res.body.user && res.body.user.name,
    error: res.body.error || null
  }, null, 2));

  process.exit(
    res.status === 200 &&
    res.body.isAdmin === true &&
    res.body.user &&
    res.body.user.email === 'jloodna@gmail.com' &&
    res.body.user.id === '@JLoodna-2002' ? 0 : 1
  );
})();
