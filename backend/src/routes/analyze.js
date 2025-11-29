import express from 'express'
import { analyzeVideoWithGemini } from '../services/geminiClient.js'

const router = express.Router()

// POST /api/analyze
// Body: { apiKey: string, frames: [{ time, data }] }
router.post('/', async (req, res) => {
  try {
    const { apiKey, frames } = req.body || {}

    if (!apiKey || !frames || !Array.isArray(frames) || frames.length === 0) {
      return res.status(400).json({ error: 'apiKey and frames[] are required' })
    }

    const result = await analyzeVideoWithGemini(apiKey, frames)
    return res.json(result)
  } catch (err) {
    console.error('Analyze error:', err)
    return res.status(500).json({ error: err.message || 'Internal Server Error' })
  }
})

export default router
