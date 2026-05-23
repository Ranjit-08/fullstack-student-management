const { body } = require('express-validator')

const VALID_BATCHES = ['07:30', '09:00', '10:30']

const validateRegister = [
  body('batch')
    .notEmpty().withMessage('Batch is required')
    .isIn(VALID_BATCHES).withMessage('Batch must be 07:30, 09:00, or 10:30'),

  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters')
    .matches(/^[a-zA-Z\s.'-]+$/).withMessage('Name contains invalid characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail()
    .isLength({ max: 150 }).withMessage('Email too long'),

  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Must be a valid 10-digit Indian mobile number'),
]

module.exports = { validateRegister }