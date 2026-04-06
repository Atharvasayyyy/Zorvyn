const asyncHandler = require('../utils/asyncHandler');
const { buildSummary } = require('../services/dashboardService');

const getSummary = asyncHandler(async (req, res) => {
  const range = req.query.range === 'week' ? 'week' : 'month';
  const summary = await buildSummary(range);

  return res.status(200).json({
    success: true,
    message: `Dashboard summary fetched for ${range}`,
    data: summary
  });
});

module.exports = { getSummary };
