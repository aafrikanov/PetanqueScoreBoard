import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ScoreState } from '../types/score'
import { DEFAULT_SCORE } from '../types/score'
import { fetchScore, putScore } from '../api/score'

type ScoreContextValue = {
  score: ScoreState
  setScore: (state: ScoreState | ((prev: ScoreState) => ScoreState)) => void
  refreshFromStorage: () => void
  error: Error | null
  isLoading: boolean
}

const ScoreContext = createContext<ScoreContextValue | null>(null)

export function ScoreProvider({ children }: { children: React.ReactNode }) {
  const [score, setScoreState] = useState<ScoreState>(DEFAULT_SCORE)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      setError(null)
      const data = await fetchScore()
      setScoreState(data)
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const setScore = useCallback(
    (update: ScoreState | ((prev: ScoreState) => ScoreState)) => {
      setScoreState((prev) => {
        const next = typeof update === 'function' ? update(prev) : update
        putScore(next).then(
          (saved) => setScoreState(saved),
          (e) => setError(e instanceof Error ? e : new Error('Unknown error'))
        )
        return next
      })
    },
    []
  )

  const refreshFromStorage = useCallback(() => {
    load()
  }, [load])

  return (
    <ScoreContext.Provider
      value={{ score, setScore, refreshFromStorage, error, isLoading }}
    >
      {children}
    </ScoreContext.Provider>
  )
}

export function useScore() {
  const ctx = useContext(ScoreContext)
  if (!ctx) throw new Error('useScore must be used within ScoreProvider')
  return ctx
}
