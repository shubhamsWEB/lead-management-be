// Configuration variables with defaults
const config = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    // Defaults for pagination
    defaultPageSize: 10,
    maxPageSize: 100
  };
  
  module.exports = config;