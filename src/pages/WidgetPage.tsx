import { useEffect } from 'react'
import { useScore } from '../context/ScoreContext'
import type { TeamScore } from '../types/score'
import './WidgetPage.css'

const WIDGET_EMBED_CLASS = 'widget-embed'
const WIDGET_POLL_INTERVAL_MS = 5000

function TeamRow({ team }: { team: TeamScore }) {
  return (
    <div className="widget-row">
      <div className="widget-team-name">{team.name}</div>
      <div className="widget-balls">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className={`widget-ball ${i <= team.balls ? 'active' : ''}`}
            aria-hidden
          />
        ))}
      </div>
      <div className="widget-score">{team.score}</div>
    </div>
  )
}

export function WidgetPage() {
  const { score, refreshFromStorage } = useScore()
  useEffect(() => {
    document.body.classList.add(WIDGET_EMBED_CLASS)
    return () => document.body.classList.remove(WIDGET_EMBED_CLASS)
  }, [])
  useEffect(() => {
    const id = setInterval(refreshFromStorage, WIDGET_POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [refreshFromStorage])
  return (
    <div className="widget-panel">
      <TeamRow team={score.team1} />
      <TeamRow team={score.team2} />
    </div>
  )
}
