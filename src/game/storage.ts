// ============================================================
// LOCAL STORAGE — Safe persistence for best score, last score, and mute setting.
// All access is wrapped in try/catch so the game still runs if
// localStorage is unavailable (private mode, sandboxed iframe, etc.).
// ============================================================

import type { RunResult } from './types';

const KEY_BEST = 'mushak_best_score';
const KEY_LAST = 'mushak_last_score';
const KEY_MUTE = 'mushak_muted';
const KEY_RUNS = 'mushak_run_history';

/** Safely read a value from localStorage, returning a fallback on any error. */
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Safely write a value to localStorage, swallowing errors. */
function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore — storage may be unavailable */
  }
}

export function getBestScore(): number {
  return safeGet<number>(KEY_BEST, 0);
}

export function setBestScore(score: number): void {
  safeSet(KEY_BEST, score);
}

export function getLastRun(): RunResult | null {
  return safeGet<RunResult | null>(KEY_LAST, null);
}

export function setLastRun(run: RunResult): void {
  safeSet(KEY_LAST, run);
}

export function getMuted(): boolean {
  return safeGet<boolean>(KEY_MUTE, false);
}

export function setMuted(muted: boolean): void {
  safeSet(KEY_MUTE, muted);
}

/** Keep the last 10 runs for the local leaderboard display. */
export function getRunHistory(): RunResult[] {
  return safeGet<RunResult[]>(KEY_RUNS, []);
}

export function addRunToHistory(run: RunResult): void {
  const history = getRunHistory();
  history.unshift(run);
  if (history.length > 10) history.length = 10;
  safeSet(KEY_RUNS, history);
}
