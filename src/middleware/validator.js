const { body, validationResult } = require('express-validator');
// Common validation middleware

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  };
  
  // Validate register input
  exports.validateRegisterInput = [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 50 })
      .withMessage('Name cannot be more than 50 characters'),
    
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    
    body('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('Role must be either user or admin'),
    
    validate
  ];
  
  // Validate login input
  exports.validateLoginInput = [
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    
    validate
  ];
  
  // Validate update details input
  exports.validateUpdateDetailsInput = [
    body('name')
      .optional()
      .notEmpty()
      .withMessage('Name cannot be empty')
      .isLength({ max: 50 })
      .withMessage('Name cannot be more than 50 characters'),
    
    body('email')
      .optional()
      .notEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Please provide a valid email address'),
    
    validate
  ];
  
  // Validate update password input
  exports.validateUpdatePasswordInput = [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    
    body('newPassword')
      .notEmpty()
      .withMessage('New password is required')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long'),
    
    validate
  ];

// Validate lead input
exports.validateLeadInput = [
  body('name')
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name cannot be more than 100 characters'),
  
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  
  body('company')
    .notEmpty()
    .withMessage('Company cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Company name cannot be more than 100 characters'),
  
  body('stage')
    .optional()
    .isIn(['I', 'II', 'III', 'IIII'])
    .withMessage('Stage must be one of: I, II, III, IIII'),
  
  body('engaged')
    .optional()
    .isBoolean()
    .withMessage('Engaged must be a boolean value'),
  
  body('lastContacted')
    .optional()
    .isISO8601()
    .withMessage('Last contacted date must be a valid date'),

    validate
];

exports.validateUpdateLeadInput = [
  body('name')
    .optional()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name cannot be more than 100 characters'),

  body('email')
    .optional()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('company')
    .optional()
    .notEmpty()
    .withMessage('Company cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Company name cannot be more than 100 characters'),

  body('stage')
    .optional()
    .isIn(['I', 'II', 'III', 'IIII'])
    .withMessage('Stage must be one of: I, II, III, IIII'),

  body('lastContacted')
    .optional()
    .isISO8601()
    .withMessage('Last contacted date must be a valid date'),

  body('engaged')
    .optional()
    .isBoolean()
    .withMessage('Engaged must be a boolean value'),

    validate
];