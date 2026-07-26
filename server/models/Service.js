import mongoose from 'mongoose'

/**
 * Service model
 *
 * Represents one hospital department/service.
 * The seed script (seed.js) populates this collection with sample data.
 *
 * Fields:
 *   code        – short location code shown on cards, e.g. "ER · G/F"
 *   name        – display name, e.g. "Emergency Care"
 *   description – one or two sentence summary shown on the card
 */
const serviceSchema = new mongoose.Schema({
  code:        { type: String, required: true, trim: true },
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
})

// mongoose.model('Service', serviceSchema) registers a model named 'Service'.
// Mongoose will look for (and create if needed) a collection called 'services'
// (lowercase + plural) in the connected database.
export default mongoose.model('Service', serviceSchema)
