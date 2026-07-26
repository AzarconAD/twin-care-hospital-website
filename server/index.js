import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './db.js'
import contactRoute from './routes/contact.js'
import servicesRoute from './routes/services.js'
import doctorsRoute from './routes/doctors.js'

// Load .env variables (MONGODB_URI, PORT, SMTP_EMAIL, etc.) before anything else
dotenv.config()

const app = express()

// ── Middleware ────────────────────────────────────────────────────────────────
// CORS: only allow requests from the React dev server (or production URL)
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
// Parse incoming JSON request bodies so req.body works in route handlers
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('Twin Care Hospital API is running.')
})

// Mount each route file at its path prefix.
// e.g. a GET / inside services.js becomes GET /api/services here.
app.use('/api/contact', contactRoute)
app.use('/api/services', servicesRoute)
app.use('/api/doctors', doctorsRoute)

// ── Start server ──────────────────────────────────────────────────────────────
// Connect to MongoDB FIRST, then start listening for HTTP requests.
// This ensures the API never receives requests before the DB is ready.
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})
