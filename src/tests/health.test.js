const request = require('supertest');
const app = require('../app');

describe('Health Check', () => {
  it('should return 200 OK for health check endpoint', async () => {
    const res = await request(app).get('/health');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should return 404 for non-existent routes', async () => {
    const res = await request(app).get('/non-existent-route');
    
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Route not found');
  });
}); 