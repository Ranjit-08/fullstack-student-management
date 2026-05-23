const { pool } = require('../config/database')

const StudentModel = {
  // Create a new student
  async create({ name, email, phone, batch }) {
    const sql = `
      INSERT INTO students (name, email, phone, batch)
      VALUES (?, ?, ?, ?)
    `
    const [result] = await pool.execute(sql, [name.trim(), email.trim().toLowerCase(), phone.trim(), batch])
    return result.insertId
  },

  // Get all students ordered by latest first
  async findAll() {
    const sql = `
      SELECT id, name, email, phone, batch, created_at
      FROM students
      ORDER BY created_at DESC
    `
    const [rows] = await pool.execute(sql)
    return rows
  },

  // Get single student by ID
  async findById(id) {
    const sql = `SELECT id, name, email, phone, batch, created_at FROM students WHERE id = ?`
    const [rows] = await pool.execute(sql, [id])
    return rows[0] || null
  },

  // Check if email already exists
  async emailExists(email) {
    const sql = `SELECT id FROM students WHERE email = ?`
    const [rows] = await pool.execute(sql, [email.trim().toLowerCase()])
    return rows.length > 0
  },

  // Get students by batch
  async findByBatch(batch) {
    const sql = `
      SELECT id, name, email, phone, batch, created_at
      FROM students
      WHERE batch = ?
      ORDER BY created_at DESC
    `
    const [rows] = await pool.execute(sql, [batch])
    return rows
  },

  // Delete student by ID
  async deleteById(id) {
    const sql = `DELETE FROM students WHERE id = ?`
    const [result] = await pool.execute(sql, [id])
    return result.affectedRows > 0
  },
}

module.exports = StudentModel