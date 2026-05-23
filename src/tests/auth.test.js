const request = require('supertest');
const app = require('../app');

describe('Auth validator', () => {
  it('should reject invalid registration payload', async () => {
    const response = await request(app).post('/api/auth/register').send({ email: 'bad-email', password: 'weak' });
    expect(response.status).toBe(422);
    expect(response.body.error).toContain('Validation failed');
  });
});
