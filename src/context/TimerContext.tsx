import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { TimerState } from '../types/timer'
import { fetchTimer, putTimer } from '../api/timer'

type TimerContextValue = {
  timer: TimerState
  setTimer: (updates: { reset?: boolean; togglePause?: boolean }) => void
  refreshTimer: () => void
  error: Error | null
  isLoading: boolean
}

const TimerContext = createContext<TimerContextValue | null>(null)

const INITIAL_TIMER: TimerState = { secondsLeft: 60, isPaused: true }

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timer, setTimerState] = useState<TimerState>(INITIAL_TIMER)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      setError(null)
      const data = await fetchTimer()
      setTimerState(data)
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const setTimer = useCallback(
    (updates: { reset?: boolean; togglePause?: boolean }) => {
      putTimer(updates).then(
        (next) => setTimerState(next),
        (e) => setError(e instanceof Error ? e : new Error('Unknown error'))
      )
    },
    []
  )

  const refreshTimer = useCallback(() => {
    load()
  }, [load])

  return (
    <TimerContext.Provider
      value={{ timer, setTimer, refreshTimer, error, isLoading }}
    >
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimer must be used within TimerProvider')
  return ctx
}
