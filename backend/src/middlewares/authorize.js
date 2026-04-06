const ApiError = require('../utils/ApiError');

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  if (!allowedRoles.includes(req.user.role)) {
    throw new ApiError(403, 'Forbidden: insufficient role permissions');
  }

  return next();
};

module.exports = { authorize };
