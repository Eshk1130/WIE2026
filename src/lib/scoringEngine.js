/**
 * src/lib/scoringEngine.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared scoring constants and helpers for WIE2026 – The Cypher Trail.
 *
 * Consumed by:
 *   - AdminPanel.jsx (ROUND_NAMES, ROUND_MAX_SCORES)
 *   - Round components (MAX_SCORE_* constants)
 */

// ── Round identifier strings ──────────────────────────────────────────────────
// These must match the `round` column values stored in Supabase `scores` table.
export const ROUND_NAMES = {
  ROUND1: 'round1',
  ROUND2: 'round2',
  ROUND3: 'round3',
  ROUND4: 'round4',
  ROUND5: 'round5',
};

// ── Maximum achievable score per round ───────────────────────────────────────
export const ROUND_MAX_SCORES = {
  [ROUND_NAMES.ROUND1]: 20,
  [ROUND_NAMES.ROUND2]: 10,
  [ROUND_NAMES.ROUND3]: 10,
  [ROUND_NAMES.ROUND4]: 10,
  [ROUND_NAMES.ROUND5]: 10,
};

// Total max score across all rounds
export const TOTAL_MAX_SCORE = Object.values(ROUND_MAX_SCORES).reduce(
  (a, b) => a + b,
  0
);

// ── Score calculation helpers ─────────────────────────────────────────────────

/**
 * Clamp a score to its round's maximum.
 * @param {string} roundName - One of ROUND_NAMES values
 * @param {number} raw       - Raw computed score
 * @returns {number}
 */
export function clampScore(roundName, raw) {
  const max = ROUND_MAX_SCORES[roundName] ?? Infinity;
  return Math.max(0, Math.min(raw, max));
}

/**
 * Calculate a time-bonus multiplier (1.0 → 1.5) based on how quickly the
 * round was completed relative to the par time.
 *
 * @param {number} timeTakenSecs  - Actual time the player took
 * @param {number} parSecs        - Expected/average completion time
 * @returns {number} multiplier between 1.0 and 1.5
 */
export function timeBonusMultiplier(timeTakenSecs, parSecs) {
  if (!timeTakenSecs || !parSecs || timeTakenSecs >= parSecs) return 1.0;
  const ratio = timeTakenSecs / parSecs;          // 0 → 1
  return Math.min(1.5, 1 + (1 - ratio) * 0.5);
}
