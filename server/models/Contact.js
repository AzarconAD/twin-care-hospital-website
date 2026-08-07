import mongoose from 'mongoose'

/**
 * Contact model
 *
 * Stores every inquiry submitted through the contact form.
 * This gives the hospital team a permanent record of messages even if
 * the email delivery fails.
 *
 * Fields:
 *   name        – sender's full name
 *   email       – sender's email address
 *   message     – the inquiry text
 *   submittedAt – timestamp set automatically to the moment of submission
 */
const contactSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, trim: true, lowercase: true },
  message:     { type: String, required: true, trim: true },
  submittedAt: { type: Date, default: Date.now },
  isRead:      { type: Boolean, default: false },
  isDeleted:   { type: Boolean, default: false },
})

export default mongoose.model('Contact', contactSchema)
