import { Router } from 'express'
import Schedule from '../models/Schedule.js'

const router = Router()

/**
 * GET /api/schedule
 *
 * Returns all schedule entries stored in the MongoDB 'schedules' collection.
 * The frontend fetches this endpoint to display doctor availability on the Doctors page.
 */
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find()
    res.json(schedules)
  } catch (err) {
    console.error('Failed to fetch schedule:', err)
    res.status(500).json({ error: 'Could not retrieve schedule. Please try again later.' })
  }
})

export default router
