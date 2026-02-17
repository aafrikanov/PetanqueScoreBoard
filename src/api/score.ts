import type { ScoreState } from '../types/score'
import { DEFAULT_SCORE } from '../types/score'

const API_BASE = ''

function mergeWithDefaults(parsed: Partial<ScoreState>): ScoreState {
  return {
    team1: { ...DEFAULT_SCORE.team1, ...parsed.team1 },
    team2: { ...DEFAULT_SCORE.team2, ...parsed.team2 },
  }
}

export async function fetchScore(): Promise<ScoreState> {
  const res = await fetch(`${API_BASE}/api/score`)
  if (!res.ok) throw new Error('Failed to fetch score')
  const data = (await res.json()) as Partial<ScoreState>
  return mergeWithDefaults(data)
}

export async function putScore(state: ScoreState): Promise<ScoreState> {
  const res = await fetch(`${API_BASE}/api/score`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  })
  if (!res.ok) throw new Error('Failed to save score')
  const data = (await res.json()) as Partial<ScoreState>
  return mergeWithDefaults(data)
}
