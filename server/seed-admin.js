/**
 * seed-admin.js — One-time admin account seeder
 *
 * Run this ONCE (manually) to create the admin account:
 *   cd server
 *   node seed-admin.js
 *
 * Prerequisites:
 *   - MONGODB_URI, ADMIN_USERNAME, and ADMIN_PASSWORD must be set in .env
 *
 * What it does:
 *   1. Connects to MongoDB
 *   2. Hashes the password with bcrypt (cost factor 12)
 *   3. Upserts a single Admin document (safe to re-run to reset credentials)
 *   4. Disconnects and exits
 *
 * NEVER expose this as an HTTP route — it is a local CLI tool only.
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import Admin from './models/Admin.js'

dotenv.config()

async function seedAdmin() {
  const { MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env

  // Guard: fail loudly if the required env vars aren't set,
  // so the developer knows exactly what's missing.
  if (!MONGODB_URI || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error(
      'Missing required env vars: MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD\n' +
      'Make sure your .env file is configured before running this script.'
    )
    process.exit(1)
  }

  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB.')

    // Cost factor 12 is the current bcrypt recommendation — high enough to
    // slow down brute-force attacks without being painful on legitimate logins.
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)

    // findOneAndUpdate with upsert: true — creates the document if it doesn't
    // exist, or updates it if it does. This makes the script safe to re-run.
    await Admin.findOneAndUpdate(
      {},                          // match any existing admin document
      { username: ADMIN_USERNAME, passwordHash },
      { upsert: true, returnDocument: 'after' }
    )

    console.log(`Admin account seeded successfully (username: "${ADMIN_USERNAME}").`)
    console.log('You can now start the server and log in at /admin/login.')

    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed:', err.message)
    process.exit(1)
  }
}

seedAdmin()
