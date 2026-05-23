require('dotenv').config()

const app                    = require('./app')
const { testConnection }     = require('./config/database')
const { initDB }             = require('./config/initDB')

const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    await testConnection()   // verify RDS is reachable
    await initDB()           // create tables if they don't exist

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀  Server running on port ${PORT}  [${process.env.NODE_ENV || 'development'}]`)
    })
  } catch (err) {
    console.error('Startup failed:', err.message)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully')
  process.exit(0)
})
process.on('SIGINT', () => {
  console.log('SIGINT received — shutting down')
  process.exit(0)
})

start()