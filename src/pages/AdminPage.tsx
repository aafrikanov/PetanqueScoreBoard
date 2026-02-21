import { useEffect } from "react";
import { useScore } from "../context/ScoreContext";
import { useTimer } from "../context/TimerContext";
import type { ScoreState, TeamScore } from "../types/score";
import "./AdminPage.css";

function clampBalls(v: number) {
  return Math.min(6, Math.max(0, Math.round(v)));
}
function clampScore(v: number) {
  return Math.min(13, Math.max(0, Math.round(v)));
}

function TeamForm({
  label,
  team,
  onChange,
}: {
  label: string;
  team: TeamScore;
  onChange: (t: TeamScore) => void;
}) {
  return (
    <fieldset className="admin-team">
      <legend>{label}</legend>
      <label>
        Название команды
        <input
          type="text"
          value={team.name}
          onChange={(e) => onChange({ ...team, name: e.target.value })}
          maxLength={24}
          placeholder=""
        />
      </label>
      <label>
        <div className="admin-balls-control">
          <div className="admin-team-row-title">Шары</div>
          <button
            type="button"
            className="admin-btn admin-btn-reset"
            onClick={() => onChange({ ...team, balls: 6 })}
          >
            Reset
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-minus"
            onClick={() =>
              onChange({ ...team, balls: clampBalls(team.balls - 1) })
            }
            disabled={team.balls <= 0}
          >
            −
          </button>
          <span className="admin-value">{team.balls}</span>
          <button
            type="button"
            className="admin-btn admin-btn-plus"
            onClick={() =>
              onChange({ ...team, balls: clampBalls(team.balls + 1) })
            }
            disabled={team.balls >= 6}
          >
            +
          </button>
        </div>
      </label>
      <label>
        <div className="admin-balls-control">
          <div className="admin-team-row-title">Счёт</div>
          <button
            type="button"
            className="admin-btn admin-btn-reset"
            onClick={() => onChange({ ...team, score: 0 })}
          >
            Reset
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-minus"
            onClick={() =>
              onChange({ ...team, score: clampScore(team.score - 1) })
            }
            disabled={team.score <= 0}
          >
            −
          </button>
          <span className="admin-value">{team.score}</span>
          <button
            type="button"
            className="admin-btn admin-btn-plus"
            onClick={() =>
              onChange({ ...team, score: clampScore(team.score + 1) })
            }
            disabled={team.score >= 13}
          >
            +
          </button>
        </div>
      </label>
    </fieldset>
  );
}

const TIMER_POLL_MS = 1000;

export function AdminPage() {
  const { score, setScore } = useScore();
  const { timer, setTimer, refreshTimer } = useTimer();

  useEffect(() => {
    const id = setInterval(refreshTimer, TIMER_POLL_MS);
    return () => clearInterval(id);
  }, [refreshTimer]);

  const update = (key: "team1" | "team2", team: TeamScore) => {
    const prevTeam = key === "team1" ? score.team1 : score.team2;
    if (team.balls < prevTeam.balls) {
      setTimer({ reset: true });
    }
    setScore((prev: ScoreState) => ({ ...prev, [key]: team }));
  };

  const newGame = () => {
    setScore((prev: ScoreState) => ({
      team1: { ...prev.team1, score: 0, balls: 6 },
      team2: { ...prev.team2, score: 0, balls: 6 },
    }));
  };

  const newSet = () => {
    setTimer({ reset: true, isPaused: true });
    setScore((prev: ScoreState) => ({
      team1: { ...prev.team1, balls: 6 },
      team2: { ...prev.team2, balls: 6 },
    }));
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Управление счётом</h1>
      </header>
      <div className="admin-form">
        <div className="admin-quick-actions">
          <button
            type="button"
            className="admin-btn admin-btn-action"
            onClick={newGame}
          >
            Новая игра
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-action"
            onClick={newSet}
          >
            Новый гейм
          </button>
        </div>
        <TeamForm
          label="Команда 1"
          team={score.team1}
          onChange={(t) => update("team1", t)}
        />
        <TeamForm
          label="Команда 2"
          team={score.team2}
          onChange={(t) => update("team2", t)}
        />
        <fieldset className="admin-team admin-timer">
          <legend>Таймер (60 сек)</legend>
          <div className="admin-timer-display">
            {Math.max(0, Math.floor(timer.secondsLeft))} сек
            {timer.isPaused && " (пауза)"}
          </div>
          <div className="admin-timer-actions">
            <button
              type="button"
              className="admin-btn admin-btn-action"
              onClick={() => setTimer({ reset: true })}
            >
              Сбросить
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-action"
              onClick={() => setTimer({ togglePause: true })}
            >
              {timer.isPaused ? "Пауза" : "Старт"}
            </button>
          </div>
        </fieldset>
      </div>
      <p className="admin-hint">
        Изменения сохраняются автоматически и отображаются на странице виджета
        (в этой же вкладке или в другой).
      </p>
    </div>
  );
}
