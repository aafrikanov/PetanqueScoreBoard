import { useScore } from "../context/ScoreContext";
import type { ScoreState, TeamScore } from "../types/score";
import { Link } from "react-router-dom";
import "./AdminPage.css";

function clampBalls(v: number) {
  return Math.min(6, Math.max(1, Math.round(v)));
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
          placeholder="ARLANC"
        />
      </label>
      <label>
        Шары
        <div className="admin-balls-control">
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
            disabled={team.balls <= 1}
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
        Счёт
        <div className="admin-balls-control">
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

export function AdminPage() {
  const { score, setScore } = useScore();

  const update = (key: "team1" | "team2", team: TeamScore) => {
    setScore((prev: ScoreState) => ({ ...prev, [key]: team }));
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Управление счётом</h1>
        <Link to="/widget" className="admin-link">
          Открыть виджет →
        </Link>
      </header>
      <div className="admin-form">
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
      </div>
      <p className="admin-hint">
        Изменения сохраняются автоматически и отображаются на странице виджета
        (в этой же вкладке или в другой).
      </p>
    </div>
  );
}
