import express from 'express'
import cors from 'cors'
import analyzeRouter from './routes/analyze.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json({ limit: '25mb' }))

// API Routes
app.use('/api/analyze', analyzeRouter)

// Serve static files from the 'public' directory (where frontend build lives in Docker)
// In development, this directory might not exist, which is fine
app.use(express.static(path.join(__dirname, '../public')))

// API health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'VideoGraph AI backend' })
})

// Catch-all route to serve frontend index.html for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
