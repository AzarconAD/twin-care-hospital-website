import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import contactRoute from './routes/contact.js'

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Twin Care Hospital API is running.')
})

app.use('/api/contact', contactRoute)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
