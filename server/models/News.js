import mongoose from 'mongoose'

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  tagColor: {
    type: String,
    required: true,
    enum: ["primary", "secondary", "accent"],
  },
  date: {
    type: Date,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

export default mongoose.model('News', newsSchema)
