// Modify api/index.js to correctly import routes from src/routes

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

// Initialize express app
const app = express();

// Import routes from src directory
const indexRouter = require('../src/routes/index');

// Database connection with mongoose (optimized for serverless)
const connectDB = async () => {
  // Only connect if not already connected
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        // These options help with serverless environments
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10 // Reduce from the default of 100
      });
      console.log('MongoDB connected');
    } catch (error) {
      console.error(`MongoDB connection error: ${error.message}`);
      // Don't exit process in serverless environment
    }
  }
};

// Call connectDB but don't await it to avoid blocking
connectDB();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Context middleware
const setContext = (req, res, next) => {
  if (!req.context) req.context = {};
  next();
};
app.use(setContext);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Root route for testing
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Lead management API is running' });
});

// Debug endpoint to check environment variables and connection status
app.get('/debug', async (req, res) => {
  try {
    // Check environment variables (don't expose sensitive values)
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      MONGO_URI_EXISTS: !!process.env.MONGO_URI,
      JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
      JWT_EXPIRE_EXISTS: !!process.env.JWT_EXPIRE,
      JWT_COOKIE_EXPIRE_EXISTS: !!process.env.JWT_COOKIE_EXPIRE
    };
    
    // Check MongoDB connection
    const mongoStatus = {
      connectionState: mongoose.connection.readyState,
      // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      connectionStateName: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState]
    };
    
    // Return debug info
    res.status(200).json({
      timestamp: new Date().toISOString(),
      environment: envCheck,
      mongoStatus,
      vercel: {
        isVercel: !!process.env.VERCEL,
        region: process.env.VERCEL_REGION
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? '(hidden in production)' : error.stack
    });
  }
});

// Routes - IMPORTANT CHANGE: Use the API prefix since that's what your frontend is expecting
app.use('/api', indexRouter);

// 404 handler
app.use((req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler from src/middleware
const errorHandler = require('../src/middleware/errorHandlers');
app.use(errorHandler);

// Export the Express app
module.exports = app;