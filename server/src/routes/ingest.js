const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { protect, authorize } = require('../middleware/auth');
const { ingestLog, getLogs, generateKey } = require('../controllers/ingestController');

const ingestLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  message: { message: "Too many requests, please try again later." }
});

router.post('/', ingestLimiter, ingestLog);
router.get('/logs', protect, authorize('admin'), getLogs);
router.post('/keys', protect, authorize('admin'), generateKey);

module.exports = router;

