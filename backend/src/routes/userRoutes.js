const express = require('express');
const { createUser, getUsers, updateUser } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');
const { validate } = require('../middlewares/validate');
const { createUserValidator, updateUserValidator } = require('../middlewares/validators');

const router = express.Router();

router.use(protect, authorize('admin'));
router.route('/').post(createUserValidator, validate, createUser).get(getUsers);
router.patch('/:id', updateUserValidator, validate, updateUser);

module.exports = router;
