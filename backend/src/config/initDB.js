const { pool } = require('./database')

const initDB = async () => {
  const createTable = `
    CREATE TABLE IF NOT EXISTS students (
      id         INT           AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(100)  NOT NULL,
      email      VARCHAR(150)  NOT NULL UNIQUE,
      phone      VARCHAR(15)   NOT NULL,
      batch      ENUM('07:30','09:00','10:30') NOT NULL,
      created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `
  try {
    await pool.execute(createTable)
    console.log('✅  students table ready')
  } catch (err) {
    console.error('❌  Failed to initialize DB schema:', err.message)
    throw err
  }
}

module.exports = { initDB }