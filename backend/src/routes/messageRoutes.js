const express = require('express');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router();

router.post('/messages/sendmessage', authMiddleware, messageController.sendMessage);
router.post('/messages/fetch', authMiddleware, messageController.fetchMessage);
module.exports = router;