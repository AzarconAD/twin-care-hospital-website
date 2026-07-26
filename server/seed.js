/**
 * seed.js — Database Seeder
 *
 * Run this script ONCE after setting up your MongoDB Atlas cluster to
 * pre-populate the 'services' and 'doctors' collections with sample data.
 *
 * How to run:
 *   cd server
 *   node seed.js
 *
 * What it does:
 *   1. Connects to MongoDB using MONGODB_URI from your .env file
 *   2. Clears the existing services and doctors collections
 *   3. Inserts fresh placeholder records
 *   4. Disconnects and exits
 *
 * You can re-run this any time to reset the data back to the defaults.
 * It will NOT touch the 'contacts' collection (real form submissions).
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Service from './models/Service.js'
import Doctor from './models/Doctor.js'

dotenv.config()

// ── Placeholder services ──────────────────────────────────────────────────────
// Replace these with real hospital departments once the hospital provides them.
// The 'code' field is a short floor/location code shown on the card.
const services = [
  {
    code: 'ER · G/F',
    name: 'Emergency Care',
    description: 'Round-the-clock emergency response for urgent and critical cases.',
  },
  {
    code: 'OPD · 2F',
    name: 'Outpatient Department',
    description: 'Walk-in consultations across general and specialty clinics.',
  },
  {
    code: 'LAB · 2F',
    name: 'Laboratory Services',
    description: 'Diagnostic testing with same-day results for most panels.',
  },
  {
    code: 'RAD · 3F',
    name: 'Radiology & Imaging',
    description: 'X-ray, ultrasound, and CT scan services.',
  },
  {
    code: 'PED · 4F',
    name: 'Pediatrics',
    description: 'Dedicated care for infants, children, and adolescents.',
  },
  {
    code: 'SUR · 5F',
    name: 'Surgical Services',
    description: 'Elective and emergency surgical procedures.',
  },
]

// ── Placeholder doctors ───────────────────────────────────────────────────────
// Replace these with real doctor profiles once the hospital provides them.
const doctors = [
  {
    name: 'Dr. Placeholder Santos',
    specialty: 'Internal Medicine',
    schedule: 'Mon, Wed, Fri · 9AM–12PM',
  },
  {
    name: 'Dr. Placeholder Reyes',
    specialty: 'Pediatrics',
    schedule: 'Tue, Thu · 1PM–5PM',
  },
  {
    name: 'Dr. Placeholder Cruz',
    specialty: 'General Surgery',
    schedule: 'By appointment',
  },
  {
    name: 'Dr. Placeholder Bautista',
    specialty: 'Obstetrics & Gynecology',
    schedule: 'Mon–Fri · 10AM–2PM',
  },
]

// ── Main seed function ─────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB.')

    // deleteMany({}) clears ALL documents from a collection.
    // We do this so re-running the seed doesn't create duplicates.
    await Service.deleteMany({})
    await Doctor.deleteMany({})
    console.log('Cleared existing services and doctors.')

    // insertMany() inserts an array of documents in a single operation.
    await Service.insertMany(services)
    await Doctor.insertMany(doctors)
    console.log(`Inserted ${services.length} services and ${doctors.length} doctors.`)

    await mongoose.disconnect()
    console.log('Done. Database seeded successfully.')
    process.exit(0)
  } catch (err) {
    console.error('Seeding failed:', err.message)
    process.exit(1)
  }
}

seed()
