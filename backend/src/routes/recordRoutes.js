const express = require('express');
const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
} = require('../controllers/recordController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');
const { validate } = require('../middlewares/validate');
const {
  recordValidator,
  updateRecordValidator,
  recordIdValidator,
  recordFilterValidator
} = require('../middlewares/validators');

const router = express.Router();

router.use(protect);

router.get('/', authorize('analyst', 'admin'), recordFilterValidator, validate, getRecords);
router.post('/', authorize('admin'), recordValidator, validate, createRecord);
router.patch('/:id', authorize('admin'), recordIdValidator, updateRecordValidator, validate, updateRecord);
router.delete('/:id', authorize('admin'), recordIdValidator, validate, deleteRecord);

module.exports = router;
