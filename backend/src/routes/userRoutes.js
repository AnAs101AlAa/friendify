const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../config/authMiddleware');
const router = express.Router();

router.post('/users/register', userController.createUser);
router.post('/users/login', userController.loginUser);
router.post('/users/fetch', authMiddleware, userController.fetchId);
router.post('/users/addfriend', authMiddleware, userController.addFriend);
router.post('/users/friend', authMiddleware, userController.getFriend);
router.post('/users/acceptfriend', authMiddleware, userController.acceptFriend);
router.post('/users/rejectfriend', authMiddleware, userController.rejectFriend);
module.exports = router;