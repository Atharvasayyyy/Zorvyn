const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized: token missing');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'Unauthorized: user not found');
    }

    if (user.status !== 'active') {
      throw new ApiError(403, 'Your account is inactive');
    }

    req.user = user;
    return next();
  } catch (error) {
    throw new ApiError(401, 'Unauthorized: invalid token');
  }
});

module.exports = { protect };
