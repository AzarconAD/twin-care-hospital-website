import { Router } from 'express'
import Appointment from '../models/Appointment.js'

const router = Router()

/**
 * POST /api/appointments
 * 
 * Accepts an appointment request, validates required fields, and creates a document with status: "pending".
 */
router.post('/', async (req, res) => {
  const { doctorId, date, time, patientName, email, phone, notes } = req.body

  if (!doctorId || !date || !time || !patientName || !email || !phone) {
    return res.status(400).json({ error: 'doctorId, date, time, patientName, email, and phone are all required.' })
  }

  try {
    const appointment = new Appointment({
      doctorId,
      date,
      time,
      patientName,
      email,
      phone,
      notes: notes || ""
    })
    
    await appointment.save()
    res.status(201).json(appointment)
  } catch (err) {
    console.error('Error creating appointment:', err)
    res.status(500).json({ error: 'Failed to create appointment request.' })
  }
})

export default router
