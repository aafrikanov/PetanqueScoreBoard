export interface TeamScore {
  name: string
  balls: number // 1–6
  score: number // 0–13
}

export interface ScoreState {
  team1: TeamScore
  team2: TeamScore
}

export const DEFAULT_SCORE: ScoreState = {
  team1: { name: 'ARLANC', balls: 3, score: 1 },
  team2: { name: 'ST-TROPEZ', balls: 2, score: 0 },
}

export const STORAGE_KEY = 'petanque-score'
