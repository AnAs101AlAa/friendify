const pool = require('../config/dbConfig');

const message = {
    sendMessage: async ({chatId, content, sender, receiver}) => {
        const client = await pool.connect();
        try{
            await client.query('BEGIN');
            const result1 = await pool.query(
                'INSERT INTO messages (chatId, messagecontent, sender, receiver) VALUES ($1, $2, $3, $4) RETURNING *',
                [chatId, content, sender, receiver]
            );
            const result2 = await pool.query (
                'UPDATE chats SET messages = array_append(messages, $1) WHERE id = $2 RETURNING *',
                [result1.rows[0].id, chatId]
            );
            await client.query("COMMIT");
            return result1.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    fetchMessage: async ({messageId}) => {
        const result = await pool.query(
            'SELECT * FROM messages WHERE id = $1::UUID',
            [messageId]
        );
        return result.rows[0];
    }
}

module.exports = message;