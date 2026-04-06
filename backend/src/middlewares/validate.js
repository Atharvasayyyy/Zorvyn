const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((error) => `${error.path}: ${error.msg}`)
      .join(', ');

    throw new ApiError(400, message);
  }

  return next();
};

module.exports = { validate };
