import mongoose from 'mongoose'

/**
 * Schedule model
 *
 * Represents one doctor's availability for a specific date.
 */
const scheduleSchema = new mongoose.Schema(
  {
    doctorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Doctor', 
      required: true 
    },
    date: { 
      type: String, 
      required: true 
    }, // "YYYY-MM-DD", matches the frontend's date format
    timeSlots: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
)

// Add a compound unique index so the same doctor can't have duplicate entries for the same day
scheduleSchema.index({ doctorId: 1, date: 1 }, { unique: true })

export default mongoose.model('Schedule', scheduleSchema)
