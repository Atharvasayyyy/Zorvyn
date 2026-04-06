const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, status } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const user = await User.create({ name, email, password, role, status });

  return res.status(201).json({
    success: true,
    message: 'User created',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  return res.status(200).json({ success: true, data: users });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, role, status } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  if (status !== undefined) user.status = status;

  await user.save();

  return res.status(200).json({ success: true, message: 'User updated', data: user });
});

module.exports = { createUser, getUsers, updateUser };
