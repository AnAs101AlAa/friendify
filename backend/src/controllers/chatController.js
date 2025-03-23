const chat = require('../models/chatModel');
require('dotenv').config();

exports.fetchChatData = async (req, res) => {
    try {
        const { fuser, suser } = req.body;
        const chatData = await chat.fetchChat({ fuser, suser });
        res.status(200).json({ chat: chatData });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting friend', error });
    }
}