const request = require('supertest');
const app = require('../server');

describe('Admin authentication', () => {
  it('accepts the seeded admin account with the required Jloodna credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jloodna@gmail.com', password: '@JLoodna2002' })
      .expect(200);

    expect(response.body.isAdmin).toBe(true);
    expect(response.body.user.email).toBe('jloodna@gmail.com');
    expect(response.body.user.id).toBe('@JLoodna-2002');
    expect(response.body.user.name).toBe('Jloodna Admin');
  });
});
