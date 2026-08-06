import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { connectDB } from './db.js'
import contactRoute from './routes/contact.js'
import servicesRoute from './routes/services.js'
import doctorsRoute from './routes/doctors.js'
import adminRoute from './routes/admin.js'

// Load .env variables (MONGODB_URI, PORT, SMTP_EMAIL, etc.) before anything else
dotenv.config()

const app = express()

// ── Trust proxy ───────────────────────────────────────────────────────────────
// Required when the server runs behind a reverse proxy (e.g. Render in production).
// Without this, express-session can't detect HTTPS and won't set secure cookies.
app.set('trust proxy', 1)

// ── Middleware ────────────────────────────────────────────────────────────────
// CORS: allow requests from the React dev server (or production URL).
// credentials: true is required so the browser sends the session cookie on
// cross-origin requests. Note: credentials + wildcard origin (*) is rejected
// by browsers, so we must specify the exact origin here.
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

// Parse incoming JSON request bodies so req.body works in route handlers
app.use(express.json())

// ── Session middleware ────────────────────────────────────────────────────────
// Sessions are stored in MongoDB (not the default in-memory store) so they
// survive server restarts and work correctly in production.
// MongoStore.create() must be called explicitly — omitting the store option
// silently falls back to in-memory storage.
const isProduction = process.env.NODE_ENV === 'production'
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    httpOnly: true,  // JS on the page cannot read this cookie
    // 8 hours — covers a typical hospital shift without forcing mid-shift re-login.
    maxAge: 1000 * 60 * 60 * 8,
    // In production (different domains): cookies must be secure (HTTPS-only)
    // and sameSite: 'none' to be sent cross-origin. In local dev (same machine,
    // http) these flags would break the cookie, so we switch them off.
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  },
}))

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Twin Care Hospital API is running.')
})

// Mount each route file at its path prefix.
// e.g. a GET / inside services.js becomes GET /api/services here.
app.use('/api/contact', contactRoute)
app.use('/api/services', servicesRoute)
app.use('/api/doctors', doctorsRoute)
app.use('/api/admin', adminRoute)

// ── Start server ──────────────────────────────────────────────────────────────
// Connect to MongoDB FIRST, then start listening for HTTP requests.
// This ensures the API never receives requests before the DB is ready.
const PORT = process.env.PORT || 5000

// Try to connect to MongoDB, but start the HTTP server regardless.
// This way the server is still reachable even if the DB is temporarily down.
// Routes that need the DB (services, doctors, contact) will return errors until
// the MongoDB connection is restored.
connectDB().catch((err) => {
  console.warn('MongoDB unavailable — server starting anyway:', err.message)
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
