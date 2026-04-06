const express = require('express');
const { login, me } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { loginValidator } = require('../middlewares/validators');

const router = express.Router();

router.post('/login', loginValidator, validate, login);
router.get('/me', protect, me);

module.exports = router;
