import mongoose from 'mongoose'

/**
 * Doctor model
 *
 * Represents one doctor listed on the Doctors page.
 *
 * Fields:
 *   name      – full name including title, e.g. "Dr. Maria Santos"
 *   specialty – medical specialty, e.g. "Internal Medicine"
 *   schedule  – availability text, e.g. "Mon, Wed, Fri · 9AM–12PM"
 *   bio       – short biography text
 *   category  – classification for frontend filtering
 */
const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    schedule: { type: String, trim: true }, // Kept from previous schema
    bio: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["emergency", "wellness", "diagnostic"],
      trim: true
    },
  },
  { timestamps: true }
)

export default mongoose.model('Doctor', doctorSchema)
