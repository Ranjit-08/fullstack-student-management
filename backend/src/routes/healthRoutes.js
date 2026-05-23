const express = require('express')
const router  = express.Router()
const { pool } = require('../config/database')

// GET /health — used by ALB target group health checks
router.get('/', async (req, res) => {
  try {
    await pool.execute('SELECT 1')
    res.status(200).json({
      status:    'healthy',
      db:        'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    res.status(503).json({
      status:    'unhealthy',
      db:        'disconnected',
      error:     err.message,
      timestamp: new Date().toISOString(),
    })
  }
})

module.exports = router