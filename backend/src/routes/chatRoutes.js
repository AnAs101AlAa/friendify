const express = require('express');
const chatController = require('../controllers/chatController');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router();

router.post('/chats/fetch', authMiddleware, chatController.fetchChatData);
module.exports = router;
