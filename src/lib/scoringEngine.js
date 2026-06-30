/**
 * src/lib/scoringEngine.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Scoring constants, helpers, and timer utilities for WIE2026 – The Cypher Trail.
 *
 * Consumed by:
 *   - Round components (scoreRound1, scorePassFail, validate*, timers)
 *   - AdminPanel.jsx (ROUND_NAMES, ROUND_MAX_SCORES)
 */

import { supabase } from './supabase.js';

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
 * ROUND 1 scoring: +1 per correct answer, 0 for wrong.
 * Each answer tracked with attemptsUsed (1 or 2); scoring is same regardless
 * of attempts (binary correct/wrong at end of quiz).
 *
 * @param {{ questionId: string|number, isCorrect: boolean, attemptsUsed: number }[]} answers
 * @returns {number} total points (0–20)
 */
export function scoreRound1(answers) {
  return answers.reduce((total, a) => total + (a.isCorrect ? 1 : 0), 0);
}

/**
 * Pass/fail scoring for Rounds 2–5.
 * @param {boolean} isCorrect
 * @returns {10|0}
 */
export function scorePassFail(isCorrect) {
  return isCorrect ? 10 : 0;
}

/**
 * Validate Round 4 answer — case-insensitive, trimmed.
 * Correct answer: "nebula"
 * @param {string} input
 * @returns {boolean}
 */
export function validateRound4Answer(input) {
  return typeof input === 'string' && input.trim().toLowerCase() === 'nebula';
}

/**
 * Validate Round 5 pass-code.
 * Correct code: "5503"
 * @param {string} input
 * @returns {boolean}
 */
export function validateRound5Code(input) {
  return typeof input === 'string' && input.trim() === '5503';
}

/**
 * Calculate total score for a player by summing all round scores from the DB.
 * @param {string} playerId
 * @returns {Promise<number>}
 */
export async function calculateTotalScore(playerId) {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select('score')
      .eq('player_id', playerId);

    if (error) throw error;
    return (data ?? []).reduce((sum, row) => sum + (row.score ?? 0), 0);
  } catch (err) {
    console.error('[scoringEngine] calculateTotalScore failed:', err);
    return 0;
  }
}

// ── Timer utilities ───────────────────────────────────────────────────────────

/**
 * Start a wall-clock timer. Returns a stop function that returns elapsed seconds.
 * Usage:
 *   const stopTimer = startTimer();
 *   // ... later:
 *   const elapsedSecs = stopTimer();
 *
 * @returns {() => number} stop function → elapsed seconds (integer)
 */
export function startTimer() {
  const t0 = Date.now();
  return function stopTimer() {
    return Math.round((Date.now() - t0) / 1000);
  };
}

/**
 * Start a per-question timer. Call startQuestionTimer() when a question is shown.
 * Call the returned function when the player answers to get elapsed seconds.
 * Identical to startTimer() — two named aliases for clarity.
 *
 * @returns {() => number}
 */
export function startQuestionTimer() {
  return startTimer();
}

/**
 * Start a round-level timer. Call startRoundTimer() when the round begins.
 * @returns {() => number}
 */
export function startRoundTimer() {
  return startTimer();
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
