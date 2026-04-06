const FinancialRecord = require('../models/FinancialRecord');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const createRecord = asyncHandler(async (req, res) => {
  const { amount, type, category, date, notes } = req.body;

  const record = await FinancialRecord.create({
    amount,
    type,
    category,
    date,
    notes,
    createdBy: req.user._id
  });

  return res.status(201).json({ success: true, message: 'Record created', data: record });
});

const getRecords = asyncHandler(async (req, res) => {
  const {
    type,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sortBy = 'date',
    sortOrder = 'desc'
  } = req.query;

  const filter = { isDeleted: false };

  if (type) filter.type = type;
  if (category) filter.category = { $regex: category, $options: 'i' };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [records, total] = await Promise.all([
    FinancialRecord.find(filter)
      .populate('createdBy', 'name email role')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    FinancialRecord.countDocuments(filter)
  ]);

  return res.status(200).json({
    success: true,
    data: records,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit))
    }
  });
});

const updateRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await FinancialRecord.findOne({ _id: id, isDeleted: false });
  if (!record) {
    throw new ApiError(404, 'Record not found');
  }

  const { amount, type, category, date, notes } = req.body;
  if (amount !== undefined) record.amount = amount;
  if (type !== undefined) record.type = type;
  if (category !== undefined) record.category = category;
  if (date !== undefined) record.date = date;
  if (notes !== undefined) record.notes = notes;

  await record.save();

  return res.status(200).json({ success: true, message: 'Record updated', data: record });
});

const deleteRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const record = await FinancialRecord.findOne({ _id: id, isDeleted: false });
  if (!record) {
    throw new ApiError(404, 'Record not found');
  }

  record.isDeleted = true;
  await record.save();

  return res.status(200).json({ success: true, message: 'Record deleted (soft delete)' });
});

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
};
