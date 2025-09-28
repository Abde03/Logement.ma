const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

// Validation middleware to handle errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Sanitize HTML content
const sanitizeMiddleware = (fields) => {
  return (req, res, next) => {
    fields.forEach(field => {
      if (req.body[field]) {
        req.body[field] = sanitizeHtml(req.body[field], {
          allowedTags: [],
          allowedAttributes: {}
        });
      }
    });
    next();
  };
};

// Validation rules for different endpoints
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  sanitizeMiddleware(['name', 'email']),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  sanitizeMiddleware(['email']),
  handleValidationErrors
];

const validateSendResetPasswordOtp = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .notEmpty()
    .withMessage('Email is required'),
  sanitizeMiddleware(['email']),
  handleValidationErrors
];

const validateVerifyResetPasswordOtp = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .notEmpty()
    .withMessage('Email is required'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number')
    .notEmpty()
    .withMessage('OTP is required'),
  sanitizeMiddleware(['email']),
  handleValidationErrors
];

const validateResetPasswordWithToken = [
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .notEmpty()
    .withMessage('New password is required'),
  body('resetToken')
    .notEmpty()
    .withMessage('Reset token is required'),
  handleValidationErrors
];

const validatePlace = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  body('price')
    .isNumeric()
    .custom(value => value > 0)
    .withMessage('Price must be a positive number'),
  body('maxGuests')
    .isInt({ min: 1, max: 20 })
    .withMessage('Max guests must be between 1 and 20'),
  sanitizeMiddleware(['title', 'description', 'address', 'extraInfo']),
  handleValidationErrors
];

const validateBooking = [
  body('place')
    .isMongoId()
    .withMessage('Invalid place ID'),
  body('checkIn')
    .isISO8601()
    .withMessage('Check-in date must be a valid date'),
  body('checkOut')
    .isISO8601()
    .withMessage('Check-out date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.checkIn)) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),
  body('numberOfGuests')
    .isInt({ min: 1, max: 20 })
    .withMessage('Number of guests must be between 1 and 20'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  sanitizeMiddleware(['name', 'phone']),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateSendResetPasswordOtp,
  validateVerifyResetPasswordOtp,
  validateResetPasswordWithToken,
  validatePlace,
  validateBooking,
  sanitizeMiddleware,
  handleValidationErrors
};