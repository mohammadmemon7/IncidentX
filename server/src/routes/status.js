const express = require('express');
const router = express.Router();
const { getPublicStatus, subscribeToStatus } = require('../controllers/statusController');

router.get('/public', getPublicStatus);
router.post('/subscribe', subscribeToStatus);

module.exports = router;

