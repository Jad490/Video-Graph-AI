import express from 'express'
import cors from 'cors'
import analyzeRouter from './routes/analyze.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '25mb' }))

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'VideoGraph AI backend' })
})

app.use('/api/analyze', analyzeRouter)

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
