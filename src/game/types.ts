// ============================================================
// GAME TYPES — Central type definitions for the game state machine
// ============================================================

/** Every screen the game can show. Drives the top-level state machine in App.tsx. */
export type GameStage =
  | 'MENU'
  | 'TUTORIAL'
  | 'RANGOLI'
  | 'MODAK'
  | 'PANDAL'
  | 'DHOL'
  | 'ECO'
  | 'AARTI'
  | 'RESULT'
  | 'LEADERBOARD';

/** Per-challenge score breakdown stored for the results screen. */
export interface StageScore {
  name: string;
  score: number;
}

/** Full result of one complete run, persisted to localStorage. */
export interface RunResult {
  total: number;
  harmony: number;
  rank: string;
  stages: StageScore[];
  date: number;
  isNewBest: boolean;
}

/** Utsav Harmony classification tiers. */
export interface HarmonyTier {
  min: number;
  max: number;
  label: string;
  color: string;
}

/** Score popup that floats up and fades. */
export interface ScorePopup {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

/** Floating petal for ambient decoration. */
export interface Petal {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  speed: number;
  sway: number;
  swayOffset: number;
}
