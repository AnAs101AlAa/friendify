const message = require('../models/messageModel');

exports.sendMessage = async (messageData) => {
    try {
        const { chatId, content, sender, receiver } = messageData;
        const returnedVals = await message.sendMessage({ chatId, content, sender, receiver });
        return returnedVals;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

exports.fetchMessage = async (req, res) => {
    try {
        const { messageId } = req.body;
        const messageData = await message.fetchMessage({ messageId });
        res.status(200).json(messageData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching message', error });
    }
};