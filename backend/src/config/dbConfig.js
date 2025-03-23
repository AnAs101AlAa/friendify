const { Pool } = require('pg');
require('dotenv').config();

console.log("🔹 Initializing database connection...");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_oVk8sp2SyQzx@ep-solitary-night-a24dgjuk-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  },
  idleTimeoutMillis: 300000,
  connectionTimeoutMillis: 300000,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL (Neon)');
});

pool.on('error', (err) => {
  console.error('🚨 PostgreSQL Connection Error:', err);
});

module.exports = pool;