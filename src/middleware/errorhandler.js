// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';
  
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      statusCode = 400;
      const validationErrors = {};
      
      Object.keys(err.errors).forEach(key => {
        validationErrors[key] = err.errors[key].message;
      });
      
      message = 'Validation Error';
      return res.status(statusCode).json({
        success: false,
        message,
        errors: validationErrors
      });
    }
  
    // Handle Mongoose duplicate key errors
    if (err.code === 11000) {
      statusCode = 400;
      message = 'Duplicate field value entered';
    }
  
    // Handle Mongoose bad ObjectId format
    if (err.name === 'CastError') {
      statusCode = 400;
      message = `Invalid ${err.path}: ${err.value}`;
    }
  
    res.status(statusCode).json({
      success: false,
      message
    });
  };
  
  module.exports = errorHandler;