import { Router } from 'express'
import Doctor from '../models/Doctor.js'

const router = Router()

/**
 * GET /api/doctors
 *
 * Returns all doctors stored in the MongoDB 'doctors' collection.
 * The frontend fetches this endpoint to display doctor cards on the Doctors page.
 *
 * Example response:
 * [
 *   { "_id": "...", "name": "Dr. Maria Santos", "specialty": "Internal Medicine", "schedule": "Mon, Wed, Fri · 9AM–12PM" },
 *   ...
 * ]
 */
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find()
    res.json(doctors)
  } catch (err) {
    console.error('Failed to fetch doctors:', err)
    res.status(500).json({ error: 'Could not retrieve doctors. Please try again later.' })
  }
})

export default router
