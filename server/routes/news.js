import express from 'express'
import News from '../models/News.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

// GET /api/news
// Fetch all news, sorted by date descending
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 })
    res.json(news)
  } catch (err) {
    console.error('Error fetching news:', err)
    res.status(500).json({ error: 'Failed to fetch news' })
  }
})

// POST /api/news
// Create a new article (Protected)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { featured } = req.body

    // Enforce "only one featured article" rule
    if (featured) {
      await News.updateMany({}, { featured: false })
    }

    const newsItem = new News(req.body)
    await newsItem.save()
    res.status(201).json(newsItem)
  } catch (err) {
    console.error('Error creating news:', err)
    res.status(400).json({ error: 'Failed to create news item', details: err.message })
  }
})

// PUT /api/news/:id
// Update an existing article (Protected)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { featured } = req.body

    // Enforce "only one featured article" rule
    if (featured) {
      // Unset featured on all OTHER articles
      await News.updateMany({ _id: { $ne: req.params.id } }, { featured: false })
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!updatedNews) {
      return res.status(404).json({ error: 'News item not found' })
    }

    res.json(updatedNews)
  } catch (err) {
    console.error('Error updating news:', err)
    res.status(400).json({ error: 'Failed to update news item', details: err.message })
  }
})

// DELETE /api/news/:id
// Delete an article (Protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id)
    if (!deletedNews) {
      return res.status(404).json({ error: 'News item not found' })
    }
    res.json({ message: 'News item deleted' })
  } catch (err) {
    console.error('Error deleting news:', err)
    res.status(500).json({ error: 'Failed to delete news item' })
  }
})

export default router
