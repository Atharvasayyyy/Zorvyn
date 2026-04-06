const FinancialRecord = require('../models/FinancialRecord');

const getDateFilter = (range = 'month') => {
  const now = new Date();
  const start = new Date(now);

  if (range === 'week') {
    start.setDate(now.getDate() - 6);
  } else {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  return { $gte: start, $lte: now };
};

const buildSummary = async (range = 'month') => {
  const dateFilter = getDateFilter(range);

  const baseMatch = { isDeleted: false, date: dateFilter };

  const [totals, categoryTotals, recentActivity, trends] = await Promise.all([
    FinancialRecord.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]),
    FinancialRecord.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]),
    FinancialRecord.find(baseMatch)
      .sort({ date: -1, createdAt: -1 })
      .limit(5)
      .populate('createdBy', 'name email role'),
    FinancialRecord.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          period: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: [
                  { $lt: ['$_id.month', 10] },
                  { $concat: ['0', { $toString: '$_id.month' }] },
                  { $toString: '$_id.month' }
                ]
              },
              '-',
              {
                $cond: [
                  { $lt: ['$_id.day', 10] },
                  { $concat: ['0', { $toString: '$_id.day' }] },
                  { $toString: '$_id.day' }
                ]
              }
            ]
          },
          type: '$_id.type',
          total: 1
        }
      },
      { $sort: { period: 1 } }
    ])
  ]);

  const income = totals.find((item) => item._id === 'income')?.total || 0;
  const expense = totals.find((item) => item._id === 'expense')?.total || 0;

  return {
    totals: {
      income,
      expense,
      netBalance: income - expense
    },
    categoryTotals: categoryTotals.map((item) => ({
      category: item._id.category,
      type: item._id.type,
      total: item.total
    })),
    recentActivity,
    trends
  };
};

module.exports = { buildSummary };
