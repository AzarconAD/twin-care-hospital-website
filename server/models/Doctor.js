import mongoose from 'mongoose'

/**
 * Doctor model
 *
 * Represents one doctor listed on the Doctors page.
 * The seed script (seed.js) populates this collection with sample data.
 *
 * Fields:
 *   name      – full name including title, e.g. "Dr. Maria Santos"
 *   specialty – medical specialty, e.g. "Internal Medicine"
 *   schedule  – availability text, e.g. "Mon, Wed, Fri · 9AM–12PM"
 */
const doctorSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  specialty: { type: String, required: true, trim: true },
  schedule:  { type: String, required: true, trim: true },
})

export default mongoose.model('Doctor', doctorSchema)
