import type { TimerState } from '../types/timer'

const API_BASE = ''

export async function fetchTimer(): Promise<TimerState> {
  const res = await fetch(`${API_BASE}/api/timer`)
  if (!res.ok) throw new Error('Failed to fetch timer')
  return res.json() as Promise<TimerState>
}

export async function putTimer(updates: {
  reset?: boolean
  togglePause?: boolean
  secondsLeft?: number
  isPaused?: boolean
}): Promise<TimerState> {
  const res = await fetch(`${API_BASE}/api/timer`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Failed to update timer')
  return res.json() as Promise<TimerState>
}
