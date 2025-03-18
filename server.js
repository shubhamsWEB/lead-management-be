// Entry point for the application
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

// Connect to database
connectDB();

// Only start the server if we're running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for Vercel
module.exports = app;