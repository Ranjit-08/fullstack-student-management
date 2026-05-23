const express    = require('express')
const cors       = require('cors')
const helmet     = require('helmet')
const rateLimit  = require('express-rate-limit')

const studentRoutes = require('./routes/studentRoutes')
const healthRoutes  = require('./routes/healthRoutes')
const { errorHandler, notFound } = require('./middleware/errorHandler')

const app = express()

// ── Security headers ──────────────────────────────────────────────
app.use(helmet())

// ── CORS ──────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. health checks, Postman) and listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`))
    }
  },
  methods:     ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

// ── Body parser ───────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ── Rate limiting ─────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max:      100,               // 100 requests per window per IP
  message:  { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false,
})
app.use('/api', limiter)

// ── Routes ────────────────────────────────────────────────────────
app.use('/health',       healthRoutes)
app.use('/api/students', studentRoutes)

// ── 404 & error handlers ─────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

module.exports = app