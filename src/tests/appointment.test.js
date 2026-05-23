const request = require('supertest');
const app = require('../app');

describe('Appointment API', () => {
  it('should require authentication for booking', async () => {
    const response = await request(app).post('/api/appointments').send({});
    expect(response.status).toBe(401);
  });
});
