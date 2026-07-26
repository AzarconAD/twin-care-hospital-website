import { Router } from 'express'
import Service from '../models/Service.js'

const router = Router()

/**
 * GET /api/services
 *
 * Returns all services stored in the MongoDB 'services' collection.
 * The frontend fetches this endpoint to display service cards on the home page.
 *
 * Example response:
 * [
 *   { "_id": "...", "code": "ER · G/F", "name": "Emergency Care", "description": "..." },
 *   ...
 * ]
 */
router.get('/', async (req, res) => {
  try {
    // Service.find() with no arguments returns ALL documents in the collection.
    const services = await Service.find()
    res.json(services)
  } catch (err) {
    console.error('Failed to fetch services:', err)
    res.status(500).json({ error: 'Could not retrieve services. Please try again later.' })
  }
})

export default router
