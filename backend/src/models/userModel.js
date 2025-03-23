const pool = require('../config/dbConfig');

const User = {
    create: async ({ username, password }) => {
        try {
            const result = await pool.query(
                "INSERT INTO users (name, pass) VALUES ($1, $2) RETURNING *",
                [username, password]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error creating user:", error.code, error.message, error.detail);
            throw error;
        }
    },

    login: async ({ username, password }) => {
        const result = await pool.query(
            'SELECT * FROM users WHERE name = $1 AND pass = $2',
            [username, password]
        );
        return result.rows[0];
    },

    fetchId: async ({ username }) => {
        const result = await pool.query(
            'SELECT * FROM users WHERE name = $1',
            [username]
        );
        return result.rows[0];
    },

    fetchPassword: async ({ password }) => {
        const result = await pool.query(
            'SELECT * FROM users WHERE pass = $1',
            [password]
        );
        return result.rows[0];
    },

    searchfriend: async ({ username }) => {
        const result = await pool.query(
            'SELECT * FROM users WHERE name ILIKE $1',
            [`%${username}%`]
        );
        return result.rows;
    },

    addFriend: async ({ username, friendName }) => {
        const result = await pool.query(
            'UPDATE users SET requests = array_append(requests, $1) WHERE name = $2 RETURNING *',
            [username, friendName]
        );
        return result.rows[0];
    },

    acceptFriend: async ({ username, friendName }) => {
        console.log('🔹 Attempting to connect to the database');
        try {
            const client = await pool.connect();
            console.log('🔹 Connected to the database');
            try {
                console.log('🔹 Starting transaction for accepting friend request');
                await client.query('BEGIN');
                console.log('🔹 Transaction started');

                console.log('🔹 Updating friends for user:', username);
                const result1 = await client.query(
                    'UPDATE users SET friends = array_append(friends, $1) WHERE name = $2 RETURNING *',
                    [friendName, username]
                );
                console.log('🔹 Result of updating friends for user:', result1.rows);

                console.log('🔹 Updating friends for friend:', friendName);
                const result2 = await client.query(
                    'UPDATE users SET friends = array_append(friends, $1) WHERE name = $2 RETURNING *',
                    [username, friendName]
                );
                console.log('🔹 Result of updating friends for friend:', result2.rows);

                console.log('🔹 Inserting into chats table');
                const result3 = await client.query(
                    'INSERT INTO chats (fuser, suser) VALUES ($1, $2) RETURNING *',
                    [username, friendName]
                );
                console.log('🔹 Result of inserting into chats table:', result3.rows);

                await client.query('COMMIT');
                console.log('🔹 Transaction committed');

                return { user1: result1.rows[0], user2: result2.rows[0], user3: result3.rows[0] };
            } catch (error) {
                await client.query('ROLLBACK');
                console.error('🚨 Transaction rolled back due to error:', error);
                throw error;
            } finally {
                client.release();
                console.log('🔹 Client released');
            }
        } catch (error) {
            console.error('🚨 Error connecting to the database:', error);
            throw error;
        }
    },

    rejectFriend: async ({ username, friendName }) => {
        const result = await pool.query(
            'UPDATE users SET requests = array_remove(requests, $1) WHERE name = $2 RETURNING *',
            [friendName, username]
        );
        return result.rows[0];
    }
};

module.exports = User;