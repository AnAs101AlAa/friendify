const pool = require('../config/dbConfig');

const chat = {
    fetchChat: async ({fuser, suser}) => {
        const result = await pool.query(
            'SELECT * FROM chats WHERE (fuser = $1 AND suser = $2) or (fuser = $2 and suser = $1)',
            [fuser, suser]
        );
        return result.rows[0];
    }
}

module.exports = chat;