import express from 'express'
import cors from 'cors'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = join(__dirname, '..', 'dist')
const isProduction = existsSync(dist)

const DEFAULT_SCORE = {
  team1: { name: 'ARLANC', balls: 3, score: 1 },
  team2: { name: 'ST-TROPEZ', balls: 2, score: 0 },
}

let scoreState = { ...JSON.parse(JSON.stringify(DEFAULT_SCORE)) }

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/score', (_req, res) => {
  res.json(scoreState)
})

app.put('/api/score', (req, res) => {
  const body = req.body
  if (body && typeof body === 'object' && body.team1 && body.team2) {
    scoreState = {
      team1: { ...DEFAULT_SCORE.team1, ...body.team1 },
      team2: { ...DEFAULT_SCORE.team2, ...body.team2 },
    }
    res.json(scoreState)
  } else {
    res.status(400).json({ error: 'Invalid score state' })
  }
})

const PORT = Number(process.env.PORT) || 3001

if (isProduction) {
  app.use(express.static(dist))
  app.get('*', (_req, res) => {
    res.sendFile(join(dist, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Score API: http://localhost:${PORT}` + (isProduction ? ' (static from dist)' : ''))
})
