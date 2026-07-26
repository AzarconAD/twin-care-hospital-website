import mongoose from 'mongoose'

/**
 * connectDB
 *
 * Establishes a connection to MongoDB Atlas using Mongoose.
 * Call this once when the server starts (see index.js).
 *
 * The MONGODB_URI value comes from your .env file — it looks like:
 *   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/twincare
 *
 * Mongoose will automatically use the database name at the end of that URI
 * (in this case "twincare"). If the database doesn't exist yet, MongoDB
 * creates it automatically the first time data is written.
 */
export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected successfully.')
  } catch (err) {
    // Log the error and exit — there's no point running the API without a database.
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  }
}
