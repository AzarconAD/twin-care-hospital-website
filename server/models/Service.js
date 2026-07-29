import mongoose from 'mongoose'

/**
 * Service model
 *
 * Represents one hospital department/service.
 *
 * Fields:
 *   code        – short location code shown on cards, e.g. "ER · G/F" (legacy)
 *   title       – display name, e.g. "Emergency Care"
 *   text        – one or two sentence summary shown on the card
 *   category    – classification for frontend filtering
 *   photo       – URL or path to the service image
 */
const serviceSchema = new mongoose.Schema(
  {
    code: { type: String, trim: true }, // Kept from previous schema as it doesn't conflict
    title: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["emergency", "wellness", "diagnostic"],
      trim: true
    },
    // Placeholder photo URL until real service photos exist.
    // Frontend expects a usable image URL/path here.
    photo: { type: String, default: "", trim: true },
  },
  { timestamps: true }
)

export default mongoose.model('Service', serviceSchema)
