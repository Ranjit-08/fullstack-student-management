// Central error handler — must be registered last in Express
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err.message)

  // MySQL duplicate entry
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'Email is already registered.' })
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
}

// 404 handler for unknown routes
const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` })
}

module.exports = { errorHandler, notFound }