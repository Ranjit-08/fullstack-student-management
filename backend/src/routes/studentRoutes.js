const express = require('express')
const router  = express.Router()
const {
  registerStudent,
  getAllStudents,
  getStudentById,
  getStudentsByBatch,
  deleteStudent,
} = require('../controllers/studentController')
const { validateRegister } = require('../middleware/validate')

// POST   /api/students/register     — register a new student
router.post('/register', validateRegister, registerStudent)

// GET    /api/students              — list all students
router.get('/', getAllStudents)

// GET    /api/students/batch/:batch — filter by batch (07:30, 09:00, 10:30)
router.get('/batch/:batch', getStudentsByBatch)

// GET    /api/students/:id          — get one student
router.get('/:id', getStudentById)

// DELETE /api/students/:id          — delete a student
router.delete('/:id', deleteStudent)

module.exports = router