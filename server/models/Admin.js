import mongoose from 'mongoose'

/**
 * Admin model
 *
 * Stores the single admin account for the hospital dashboard.
 * There is intentionally only ONE document in this collection —
 * the account is created by running `node seed-admin.js`, not via
 * any public route.
 *
 * Fields:
 *   username     – the login username (unique)
 *   passwordHash – bcrypt hash of the password; the raw password is NEVER stored
 */
const adminSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
})

export default mongoose.model('Admin', adminSchema)
