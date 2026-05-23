const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               parseInt(process.env.DB_PORT || '3306'),
  database:           process.env.DB_NAME,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  connectTimeout:     10000,
})

// Test connection on startup
const testConnection = async () => {
  try {
    const conn = await pool.getConnection()
    console.log('✅  MySQL RDS connected successfully')
    conn.release()
  } catch (err) {
    console.error('❌  MySQL connection failed:', err.message)
    process.exit(1)
  }
}

module.exports = { pool, testConnection }