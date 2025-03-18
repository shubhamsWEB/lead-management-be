const request = require('supertest');
const app = require('../app');
const Lead = require('../models/leads');
const User = require('../models/user');

describe('Lead Routes', () => {
  let token;
  
  beforeEach(async () => {
    // Create a test user and get token for authentication
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    token = user.getSignedJwtToken();
    
    // Create some test leads
    await Lead.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Example Inc',
        stage: 'I',
        engaged: true,
        lastContacted: new Date('2023-01-01')
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        company: 'Test Corp',
        stage: 'II',
        engaged: false,
        lastContacted: null
      }
    ]);
  });

  // Test get all leads
  describe('GET /api/leads', () => {
    it('should get all leads with pagination', async () => {
      const res = await request(app)
        .get('/api/leads');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.data.length).toBe(2);
    });

    it('should filter leads by stage', async () => {
      const res = await request(app)
        .get('/api/leads?stage=II');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].stage).toBe('II');
    });

    it('should search leads by name', async () => {
      const res = await request(app)
        .get('/api/leads?search=John');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].name).toBe('John Doe');
    });

    it('should sort leads by company name', async () => {
      const res = await request(app)
        .get('/api/leads?sort=company&sortOrder=asc');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].company).toBe('Example Inc');
    });

    it('should paginate leads', async () => {
      const res = await request(app)
        .get('/api/leads?page=1&limit=1');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(1);
      expect(res.body.pagination.total).toBe(2);
      expect(res.body.pagination.totalPages).toBe(2);
    });
  });

  // Test get single lead
  describe('GET /api/leads/:id', () => {
    it('should get a single lead by ID', async () => {
      const lead = await Lead.findOne({ name: 'John Doe' });
      
      const res = await request(app)
        .get(`/api/leads/${lead._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.name).toBe('John Doe');
      expect(res.body.data.email).toBe('john@example.com');
    });

    it('should return 404 if lead not found', async () => {
      const nonExistentId = '60f7a7b5c9b4d83e3c9b4d83';
      
      const res = await request(app)
        .get(`/api/leads/${nonExistentId}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Lead not found');
    });
  });

  // Test create lead
  describe('POST /api/leads', () => {
    it('should create a new lead', async () => {
      const newLead = {
        name: 'New Lead',
        email: 'newlead@example.com',
        company: 'New Company',
        stage: 'III',
        engaged: true,
        lastContacted: '2023-02-01'
      };
      
      const res = await request(app)
        .post('/api/leads')
        .send(newLead);
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.name).toBe('New Lead');
      expect(res.body.data.email).toBe('newlead@example.com');
      expect(res.body.data.company).toBe('New Company');
      expect(res.body.data.stage).toBe('III');
      expect(res.body.data.engaged).toBe(true);
      
      // Check that initials were generated
      expect(res.body.data.initials).toBe('NL');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/leads')
        .send({
          name: 'Incomplete Lead',
          // email missing
          company: 'Test Company'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 if email is invalid', async () => {
      const res = await request(app)
        .post('/api/leads')
        .send({
          name: 'Invalid Email',
          email: 'not-an-email',
          company: 'Test Company'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  // Test update lead
  describe('PUT /api/leads/:id', () => {
    it('should update a lead', async () => {
      const lead = await Lead.findOne({ name: 'John Doe' });
      
      const updateData = {
        name: 'Updated Name',
        company: 'Updated Company',
        stage: 'IIII'
      };
      
      const res = await request(app)
        .put(`/api/leads/${lead._id}`)
        .send(updateData);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Updated Name');
      expect(res.body.data.company).toBe('Updated Company');
      expect(res.body.data.stage).toBe('IIII');
      // Email should remain unchanged
      expect(res.body.data.email).toBe('john@example.com');
    });

    it('should return 404 if lead not found', async () => {
      const nonExistentId = '60f7a7b5c9b4d83e3c9b4d83';
      
      const res = await request(app)
        .put(`/api/leads/${nonExistentId}`)
        .send({
          name: 'Updated Name'
        });
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Lead not found');
    });

    it('should return 400 if stage is invalid', async () => {
      const lead = await Lead.findOne({ name: 'John Doe' });
      
      const res = await request(app)
        .put(`/api/leads/${lead._id}`)
        .send({
          stage: 'Invalid Stage'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  // Test delete lead
  describe('DELETE /api/leads/:id', () => {
    it('should delete a lead', async () => {
      const lead = await Lead.findOne({ name: 'John Doe' });
      
      const res = await request(app)
        .delete(`/api/leads/${lead._id}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual({});
      
      // Verify lead was actually deleted
      const deletedLead = await Lead.findById(lead._id);
      expect(deletedLead).toBeNull();
    });

    it('should return 404 if lead not found', async () => {
      const nonExistentId = '60f7a7b5c9b4d83e3c9b4d83';
      
      const res = await request(app)
        .delete(`/api/leads/${nonExistentId}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Lead not found');
    });
  });

  // Test export leads
  describe('GET /api/leads/export', () => {
    it('should export leads as CSV', async () => {
      const res = await request(app)
        .get('/api/leads/export');
      
      expect(res.statusCode).toBe(200);
      expect(res.header['content-type']).toBe('text/csv; charset=utf-8');
      expect(res.header['content-disposition']).toBe('attachment; filename=leads.csv');
      
      // Check CSV content
      const csvContent = res.text;
      expect(csvContent).toContain('Name,Email,Company,Stage,Engaged,Last Contacted,Created At');
      expect(csvContent).toContain('John Doe,john@example.com,Example Inc,I,Yes');
      expect(csvContent).toContain('Jane Smith,jane@example.com,Test Corp,II,No');
    });

    it('should return 404 if no leads found', async () => {
      // Delete all leads first
      await Lead.deleteMany({});
      
      const res = await request(app)
        .get('/api/leads/export');
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('No leads found to export');
    });
  });
}); 