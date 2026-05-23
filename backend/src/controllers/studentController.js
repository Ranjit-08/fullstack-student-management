const { validationResult } = require('express-validator')
const StudentModel = require('../models/studentModel')

// POST /api/students/register
const registerStudent = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    })
  }

  const { name, email, phone, batch } = req.body

  try {
    // Duplicate email check
    const exists = await StudentModel.emailExists(email)
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered.',
      })
    }

    const studentId = await StudentModel.create({ name, email, phone, batch })

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      id: studentId,
    })
  } catch (err) {
    console.error('registerStudent error:', err.message)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// GET /api/students
const getAllStudents = async (req, res) => {
  try {
    const students = await StudentModel.findAll()
    return res.status(200).json({ success: true, count: students.length, data: students })
  } catch (err) {
    console.error('getAllStudents error:', err.message)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await StudentModel.findById(req.params.id)
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' })
    }
    return res.status(200).json({ success: true, data: student })
  } catch (err) {
    console.error('getStudentById error:', err.message)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// GET /api/students/batch/:batch
const getStudentsByBatch = async (req, res) => {
  const { batch } = req.params
  const validBatches = ['07:30', '09:00', '10:30']
  if (!validBatches.includes(batch)) {
    return res.status(400).json({ success: false, message: 'Invalid batch. Use 07:30, 09:00 or 10:30' })
  }
  try {
    const students = await StudentModel.findByBatch(batch)
    return res.status(200).json({ success: true, count: students.length, data: students })
  } catch (err) {
    console.error('getStudentsByBatch error:', err.message)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const deleted = await StudentModel.deleteById(req.params.id)
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Student not found' })
    }
    return res.status(200).json({ success: true, message: 'Student deleted successfully' })
  } catch (err) {
    console.error('deleteStudent error:', err.message)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

module.exports = {
  registerStudent,
  getAllStudents,
  getStudentById,
  getStudentsByBatch,
  deleteStudent,
}