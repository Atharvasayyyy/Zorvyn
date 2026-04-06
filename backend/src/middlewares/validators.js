const { body, query, param } = require('express-validator');

const loginValidator = [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const createUserValidator = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['viewer', 'analyst', 'admin']).withMessage('Role must be viewer, analyst, or admin'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
];

const updateUserValidator = [
  param('id').isMongoId().withMessage('Invalid user id'),
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('role').optional().isIn(['viewer', 'analyst', 'admin']).withMessage('Role must be viewer, analyst, or admin'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive')
];

const recordValidator = [
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number or zero'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Date must be a valid ISO date'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

const updateRecordValidator = [
  body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number or zero'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO date'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

const recordIdValidator = [param('id').isMongoId().withMessage('Invalid record id')];

const recordFilterValidator = [
  query('type').optional().isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid date'),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be at least 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100')
];

module.exports = {
  loginValidator,
  createUserValidator,
  updateUserValidator,
  recordValidator,
  updateRecordValidator,
  recordIdValidator,
  recordFilterValidator
};
