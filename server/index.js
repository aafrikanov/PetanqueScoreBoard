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

const TIMER_INITIAL = 60

let scoreState = { ...JSON.parse(JSON.stringify(DEFAULT_SCORE)) }

let timerState = {
  secondsLeft: TIMER_INITIAL,
  isPaused: true,
}
let timerInterval = null

function startTimerTick() {
  if (timerInterval) return
  timerInterval = setInterval(() => {
    if (timerState.isPaused || timerState.secondsLeft <= 0) return
    timerState = { ...timerState, secondsLeft: Math.max(0, timerState.secondsLeft - 1) }
  }, 1000)
}

function stopTimerTick() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

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

app.get('/api/timer', (_req, res) => {
  res.json(timerState)
})

app.put('/api/timer', (req, res) => {
  const body = req.body || {}
  if (body.reset === true) {
    timerState = { secondsLeft: TIMER_INITIAL, isPaused: false }
    startTimerTick()
    return res.json(timerState)
  }
  if (body.togglePause === true) {
    timerState = { ...timerState, isPaused: !timerState.isPaused }
    if (timerState.isPaused) stopTimerTick()
    else if (timerState.secondsLeft > 0) startTimerTick()
    return res.json(timerState)
  }
  if (typeof body.secondsLeft === 'number') {
    timerState = { ...timerState, secondsLeft: Math.max(0, Math.min(60, Math.round(body.secondsLeft))) }
  }
  if (typeof body.isPaused === 'boolean') {
    timerState = { ...timerState, isPaused: body.isPaused }
    if (timerState.isPaused) stopTimerTick()
    else if (timerState.secondsLeft > 0) startTimerTick()
  }
  if (!timerState.isPaused && timerState.secondsLeft > 0) startTimerTick()
  else stopTimerTick()
  res.json(timerState)
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
