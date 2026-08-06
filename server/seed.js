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
// These must match the Service model fields: title, text, category, photo.
// 'category' must be one of: 'emergency', 'wellness', 'diagnostic'.
// 'photo' is a placeholder Unsplash URL — swap with a real path once available.
const services = [
  {
    category: 'emergency',
    title: 'Emergency Room',
    text: '24/7 emergency care for critical and life-threatening conditions.',
    photo: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=500&h=375',
  },
  {
    category: 'emergency',
    title: 'Trauma & Critical Care',
    text: 'A rapid-response team ready for high-acuity trauma cases at any hour.',
    photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=500&h=375',
  },
  {
    category: 'emergency',
    title: 'Ambulance & Transport',
    text: 'Round-the-clock ambulance dispatch for urgent patient transport.',
    photo: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=500&h=375',
  },
  {
    category: 'wellness',
    title: 'Wellness & Nutrition',
    text: 'Personalized nutrition and lifestyle counseling for long-term health.',
    photo: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=500&h=375',
  },
  {
    category: 'wellness',
    title: 'Vaccination & Immunization',
    text: 'Full immunization schedules and boosters for every age group.',
    photo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500&h=375',
  },
  {
    category: 'wellness',
    title: 'Annual Checkups',
    text: 'Comprehensive physical exams designed to catch issues early.',
    photo: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=500&h=375',
  },
  {
    category: 'diagnostic',
    title: 'Laboratory Services',
    text: 'Fast, accurate lab testing across a full range of diagnostics.',
    photo: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=500&h=375',
  },
  {
    category: 'diagnostic',
    title: 'Imaging & Radiology',
    text: 'On-site X-ray, ultrasound, and CT imaging with quick turnaround.',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&h=375',
  },
  {
    category: 'diagnostic',
    title: 'Specialist Clinics',
    text: 'Cardiology, pediatrics, OB-GYN, and other specialist consultations.',
    photo: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=500&h=375',
  },
]

// ── Placeholder doctors ───────────────────────────────────────────────────────
// These must match the Doctor model fields: name, specialty, bio, category.
// 'category' must be one of: 'emergency', 'wellness', 'diagnostic'.
// 'photo' is optional — omit it here; the frontend falls back to an avatar icon.
// Replace with real profiles once the hospital provides them.
const doctors = [
  {
    name: 'Dr. Ramon Villareal',
    specialty: 'Emergency Medicine',
    bio: 'Leads rapid assessment and treatment for urgent, high-risk conditions around the clock.',
    category: 'emergency',
  },
  {
    name: 'Dr. Carla Mendoza',
    specialty: 'Trauma Surgery',
    bio: 'Specializes in emergency surgical care for serious injuries and critical trauma cases.',
    category: 'emergency',
  },
  {
    name: 'Dr. Bea Santos',
    specialty: 'Family & Wellness Medicine',
    bio: 'Focuses on long-term health, preventive screening, and whole-family primary care.',
    category: 'wellness',
  },
  {
    name: 'Dr. Miguel Torres',
    specialty: 'Pediatrics',
    bio: 'Provides checkups, immunizations, and developmental care for infants through teens.',
    category: 'wellness',
  },
  {
    name: 'Dr. Elena Cruz',
    specialty: 'Cardiology',
    bio: 'Diagnoses and manages heart conditions using on-site imaging and diagnostic testing.',
    category: 'diagnostic',
  },
  {
    name: 'Dr. Paolo Reyes',
    specialty: 'Radiology',
    bio: 'Reads and interprets X-ray, ultrasound, and CT imaging to guide accurate diagnoses.',
    category: 'diagnostic',
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
