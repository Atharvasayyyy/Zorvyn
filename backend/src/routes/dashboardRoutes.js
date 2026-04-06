const express = require('express');
const { getSummary } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');

const router = express.Router();

router.get('/summary', protect, authorize('viewer', 'analyst', 'admin'), getSummary);

module.exports = router;
