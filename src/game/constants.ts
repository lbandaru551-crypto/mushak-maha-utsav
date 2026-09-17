// ============================================================
// CONSTANTS — Shared game configuration values
// ============================================================

import type { HarmonyTier, GameStage } from './types';

/** Stages in order, used for progression display. */
export const STAGE_ORDER: GameStage[] = [
  'RANGOLI',
  'MODAK',
  'PANDAL',
  'DHOL',
  'ECO',
];

/** Human-readable names for each stage. */
export const STAGE_NAMES: Record<GameStage, string> = {
  MENU: 'Main Menu',
  TUTORIAL: 'How to Play',
  RANGOLI: 'Rangoli Memory',
  MODAK: 'Modak Rush',
  PANDAL: 'Pandal Decoration',
  DHOL: 'Dhol Rhythm',
  ECO: 'Eco Festival',
  AARTI: 'Final Aarti',
  RESULT: 'Results',
  LEADERBOARD: 'Leaderboard',
};

/** Harmony tier thresholds for the final classification. */
export const HARMONY_TIERS: HarmonyTier[] = [
  { min: 95, max: 100, label: 'PERFECT UTSAV', color: '#d4af37' },
  { min: 80, max: 94, label: 'BLESSED UTSAV', color: '#ff9f1c' },
  { min: 60, max: 79, label: 'GOOD UTSAV', color: '#5ba35b' },
  { min: 0, max: 59, label: 'KEEP PRACTICING', color: '#9b3a4a' },
];

/** Scoring constants */
export const SCORE = {
  CORRECT: 100,
  MISTAKE: -25,
  PERFECT_BONUS: 250,
  ECO_BONUS: 500,
  SPEED_MIN: 50,
  SPEED_MAX: 300,
  AARTI_MAX_BONUS: 1000,
} as const;

/** Rangoli color palette — festive, high-contrast */
export const RANGOLI_COLORS = [
  '#E84393', // pink
  '#FF9F1C', // saffron
  '#6C5CE7', // purple
  '#00B894', // green
  '#E17055', // terracotta
  '#FDCB6E', // gold
];

/** Modak recipe — correct ingredients */
export const MODAK_INGREDIENTS = [
  { id: 'rice-flour', name: 'Rice Flour', emoji: '🍚', correct: true },
  { id: 'jaggery', name: 'Jaggery', emoji: '🟤', correct: true },
  { id: 'coconut', name: 'Coconut', emoji: '🥥', correct: true },
  { id: 'ghee', name: 'Ghee', emoji: '🫙', correct: true },
  { id: 'cardamom', name: 'Cardamom', emoji: '🌿', correct: true },
];

/** Distractor ingredients for Modak Rush */
export const MODAK_DISTRACTORS = [
  { id: 'chili', name: 'Chili', emoji: '🌶️', correct: false },
  { id: 'salt', name: 'Salt', emoji: '🧂', correct: false },
  { id: 'sugar', name: 'Sugar', emoji: '🍬', correct: false },
  { id: 'oil', name: 'Oil', emoji: '💧', correct: false },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', correct: false },
  { id: 'cheese', name: 'Cheese', emoji: '🧀', correct: false },
];

/** Eco challenge options — pairs of eco-friendly vs harmful */
export const ECO_PAIRS = [
  {
    eco: { id: 'clay', name: 'Natural Clay Idol', emoji: '🏺' },
    bad: { id: 'plaster', name: 'Plaster of Paris Idol', emoji: '🪨' },
  },
  {
    eco: { id: 'reuse', name: 'Reusable Decorations', emoji: '🔁' },
    bad: { id: 'thermocol', name: 'Thermocol Decor', emoji: '📦' },
  },
  {
    eco: { id: 'flowers', name: 'Natural Flowers', emoji: '🌸' },
    bad: { id: 'plastic-flowers', name: 'Plastic Flowers', emoji: '🥄' },
  },
  {
    eco: { id: 'paper', name: 'Paper Banners', emoji: '📜' },
    bad: { id: 'plastic-banner', name: 'Plastic Banner', emoji: '🛍️' },
  },
  {
    eco: { id: 'leaves', name: 'Banana Leaf Plates', emoji: '🍃' },
    bad: { id: 'disposable', name: 'Disposable Plastic Plates', emoji: '🥡' },
  },
];

/** Dhol rhythm keys for desktop */
export const DHOL_KEYS = ['a', 's', 'd', 'f'] as const;

/** Stage continuity messages shown when each stage completes. */
export const STAGE_COMPLETE_MESSAGES: Record<string, string> = {
  RANGOLI: 'Rangoli ready! The Utsav is taking shape.',
  MODAK: 'Modaks ready! The celebration is coming together.',
  PANDAL: 'Pandal ready! Let\u2019s bring the rhythm.',
  DHOL: 'Dhol ready! One final eco-friendly choice.',
  ECO: 'The Maha Utsav is ready.',
};

/** Stage intro messages shown when each stage begins. */
export const STAGE_INTRO_MESSAGES: Record<string, string> = {
  RANGOLI: 'Let\u2019s prepare the Maha Utsav!',
  MODAK: 'Rangoli ready! Now let\u2019s make the modaks.',
  PANDAL: 'Modaks ready! Time to decorate the pandal.',
  DHOL: 'Pandal ready! Let\u2019s bring the rhythm.',
  ECO: 'Dhol ready! One final eco-friendly choice.',
};

/** Get harmony tier from a 0–100 value. */
export function getHarmonyTier(harmony: number): HarmonyTier {
  const clamped = Math.max(0, Math.min(100, harmony));
  return (
    HARMONY_TIERS.find((t) => clamped >= t.min && clamped <= t.max) ??
    HARMONY_TIERS[HARMONY_TIERS.length - 1]
  );
}

/** Shuffle an array (Fisher-Yates) for replayability. */
export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
